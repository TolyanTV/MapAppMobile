import { ImageData, MarkerData } from "@/types";
import * as SQLite from "expo-sqlite";
import { v4 as uuidv4 } from "uuid";

export const addMarker = async (
    db: SQLite.SQLiteDatabase,
    latitude: number,
    longitude: number
): Promise<string> => {
    try{
        const id = uuidv4();
        await db.runAsync(
            `INSERT INTO markers (id, latitude, longitude) VALUES (?, ?, ?)`,
            [id, latitude, longitude]
        );
        return id;
    }catch (error) {
        console.error('Ошибка добавления маркера: ', error);
        throw error;
    };
};

export const deleteMarker = async (
    db: SQLite.SQLiteDatabase,
    id: string
): Promise<void> => {
    try{
        await db.runAsync(
            `DELETE FROM markers WHERE id = ?`,
            [id]
        );
    }catch(error){
        console.error('Ошибка удаления маркера: ', error);
        throw error;
    }
};

export const getMarkers = async (
    db: SQLite.SQLiteDatabase
): Promise<MarkerData[]> => {
    try{
        const result = await db.getAllAsync<MarkerData>(
            'SELECT * FROM markers'
        );
        return result;
    }catch(error){
        console.error('Ошибка получения маркеров: ', error);
        throw error;
    }
};

export const addImage = async (
    db: SQLite.SQLiteDatabase,
    markerId: string,
    uri: string
): Promise<void> => {
    try{
        const id = uuidv4();
        await db.runAsync(
            `INSERT INTO markerImages (id, marker_id, uri) VALUES (?, ?, ?)`,
            [id, markerId, uri]
        );
    }catch(error){
        console.log('Ошибка добавления изображения: ', error);
        throw error;
    }
};

export const deleteImage = async (
    db: SQLite.SQLiteDatabase,
    id: string
): Promise<void> => {
    try{
        await db.runAsync(
            'DELETE FROM markerImages WHERE id = ?',
            [id]
        );
    }catch(error){
        console.log('Ошибка удаления изображения: ', error);
        throw error;
    }
};

export const getMarkerImages = async (
    db: SQLite.SQLiteDatabase,
    markerId: string
): Promise<ImageData[]> => {
    try{
        const result = await db.getAllAsync<ImageData>(
            `SELECT id, uri FROM markerImages WHERE marker_id = ?`,
            [markerId]
        );
        return result;
    }catch(error){
        console.log('Ошибка получения изображений для маркера: ', error);
        throw error;
    }
};