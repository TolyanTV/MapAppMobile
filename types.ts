import * as Location from "expo-location";
import { LongPressEvent } from "react-native-maps";

export interface MarkerData{
    id: string;
    latitude: number;
    longitude: number;
    images: ImageData[];
}

export interface ImageData{
    id: string;
    uri: string;
}

export interface MapProps{
    markers: MarkerData[];
    pressingMap: (event: LongPressEvent) => void;
    tappingMarker: (marker: MarkerData) => void;
}

export interface ImageListProps{
    images: ImageData[];
    deleteImage: (imageId: string) => void;
}

export interface DatabaseContextType {
    addMarker: (latitude: number, longitude: number) => Promise<string>;
    deleteMarker: (id: string) => Promise<void>;
    getMarkers: () => Promise<MarkerData[]>;
    addImage: (markerId: string, uri: string) => Promise<void>;
    deleteImage: (id: string) => Promise<void>;
    getMarkerImages: (markerId: string) => Promise<ImageData[]>;

    isLoading: boolean;
    error: Error | null;
}

export interface LocationConfig {
    accuracy: Location.LocationAccuracy;
    timeInterval: number;
    distanceInterval: number;
}

export interface ActiveNotification {
    markerId: string;
    notificationId: string;
    timestamp: number;
}