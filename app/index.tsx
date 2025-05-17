import { useDatabase } from "@/contexts/DatabaseContext";
import { calculateDistance, requestLocationPermissions, startLocationUpdates } from "@/services/location";
import { NotificationManager } from "@/services/notifications";
import { MarkerData } from '@/types';
import * as Location from "expo-location";
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import 'react-native-get-random-values';
import Map from '../components/Map';

const PROXIMITY_THRESHOLD = 100;

export default function Index() {
  const {addMarker, getMarkers} = useDatabase();
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null> (null);
  const notificationManager = React.useRef(new NotificationManager()).current;

  useFocusEffect(useCallback(() => {
    const loadData = async () => {
      const loadMarkers = await getMarkers();
      setMarkers(loadMarkers);
    };
    loadData();
  }, [getMarkers]));

  const checkProximity = (userLocation: Location.LocationObject, markers: MarkerData[]) => {
    markers.forEach(marker => {
      const distance = calculateDistance(
        userLocation.coords.latitude,
        userLocation.coords.longitude,
        marker.latitude,
        marker.longitude
      );
      notificationManager.requestNotificationPermission();
      if (distance <= PROXIMITY_THRESHOLD){
        notificationManager.showNotification(marker);
      }else{
        notificationManager.removeNotification(marker.id);
      }
    });
  };

  let locationSubscription: Location.LocationSubscription;

  const setupLocation = async () => {
      try{
        await requestLocationPermissions();
        locationSubscription = await startLocationUpdates((location) => { //отслеживает местоположение
          setUserLocation(location.coords);
          checkProximity(location, markers);
        });
      }catch(error){
        console.error("Ошибка геолокации: ", error);
      }
    };

  useEffect(() => {
    setupLocation();
    return () => {
      if(locationSubscription){ 
        locationSubscription.remove(); //Очищает подписку
      }
    };
  }, [markers])


  const addMarkerHere = async (latitude: number, longitude: number) => {
    await addMarker(latitude, longitude);
    const updatedMarkers = await getMarkers();
    setMarkers(updatedMarkers);
  };

  const pressingMap = (event: any) => {
    const { coordinate } = event.nativeEvent;
    addMarkerHere(coordinate.latitude, coordinate.longitude);
  };

  const tappingMarker = (marker: MarkerData) => {
    try {
      router.push({
        pathname: '/marker/[id]',
        params: {
          id: marker.id,
          marker: JSON.stringify(marker)
        }
      });
    }catch(error){
      console.error("Ошибка навигации: ", error);
      Alert.alert("Ошибка", "Ошибка навигации к маркеру");
    }
  };

  return (
    <View style={{flex: 1}}>      
      <Map
        markers={markers}
        pressingMap={pressingMap}
        tappingMarker={tappingMarker}
        userLocation={userLocation}
        proximityThreshold={PROXIMITY_THRESHOLD}
      />
    </View>
  );
}