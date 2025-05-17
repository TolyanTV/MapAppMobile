import { LocationConfig } from "@/types";
import * as Location from "expo-location";

export const config: LocationConfig = {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 5000, // Как часто обновлять местоположение (мс)
    distanceInterval: 5 // Минимальное расстояние (в метрах) между обновлениями
}

export const requestLocationPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted'){
        throw new Error('Доступ к местоположению не разрешен');
    }
};

export const startLocationUpdates = async (onLocation: (location: Location.LocationObject) 
=> void): Promise<Location.LocationSubscription> => {
    return await Location.watchPositionAsync(
        config,
        onLocation
    );
};

export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const R = 6371e3; 
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};