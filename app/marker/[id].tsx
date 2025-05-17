import ImageList from "@/components/ImageList";
import { useDatabase } from "@/contexts/DatabaseContext";
import { ImageData, MarkerData } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, View } from "react-native";

export default function MarkerInfo() {
    const { id, marker: markerString} = useLocalSearchParams<{id: string; marker: string;}>();
    const {getMarkers, addImage: adImage, getMarkerImages, deleteImage: delImage, deleteMarker: delMarker} = useDatabase();
    const [marker, setMarker] = useState<MarkerData>(JSON.parse(markerString || '{}'));
    const [images, setImages] = useState<ImageData[]>([]);
    const router = useRouter();
    
    //загрузка метки и изображения к ней
    const loadMarker = async () => {
          const markers = await getMarkers();
          const foundMarker = markers.find((m: MarkerData) => m.id === id);
          if (foundMarker) {
            setMarker(foundMarker);
            const allImages = await getMarkerImages(foundMarker.id);
            setImages(allImages);
          } else {
            router.back();
          }
    };

    useEffect(() => {
        loadMarker();
      }, [id]);

    const addImage = async () => {
        try {
            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if(!pickerResult.canceled){
                await adImage(marker.id, pickerResult.assets[0].uri);    
                const updatedImages = await getMarkerImages(id);
                setImages(updatedImages);
            }
        }catch(error){
            console.error("Ошибка выбора изображения: ", error);
            Alert.alert("Ошибка", "Ошибка выбора изображения")
        }
    };
    
    const deleteImage = async (imageId: string) => {
        await delImage(imageId);
        const updatedImages = await getMarkerImages(id);
        setImages(updatedImages);
    };

    const deleteMarker = async () => {
        await delMarker(id);
        router.back();
    };

    return(
        <View style={styles.container}>
            <View style={styles.imageListContainer}>
                <ImageList images={images} deleteImage={deleteImage} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Добавить изображение" color="green" onPress={addImage} />
                <Button title="Удалить маркер" color="red" onPress={deleteMarker} />
                <Button title="Назад" onPress={() => router.back()} />
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    padding: 10,
  },
  imageListContainer: {
    flex: 1,
  },
  buttonContainer: {
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center', 
    gap: 15, 
  },
});
