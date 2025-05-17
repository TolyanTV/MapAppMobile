import { MapProps } from "@/types";
import React from 'react';
import { View } from 'react-native';
import MapView, { Circle, Marker } from "react-native-maps";

export default function Map({
    markers,
    pressingMap,
    tappingMarker, 
    userLocation, 
    proximityThreshold}: MapProps & {userLocation: {latitude: number; longitude: number} | null; proximityThreshold: number}) {
    return(
        <View style={{flex: 1}}>
            <MapView
                style={{width: '100%', height: '100%'}}
                onLongPress={pressingMap}
                initialRegion={{ 
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            >
                {markers.map(marker => (
                    <Marker 
                        key={marker.id} 
                        coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                        onPress={() => tappingMarker(marker)}
                    />         
                ))}
                {userLocation && (
                    <Circle
                        center={userLocation}
                        radius={proximityThreshold}
                        strokeColor='blue'
                    />
                )}
            </MapView>
        </View>
    );
}