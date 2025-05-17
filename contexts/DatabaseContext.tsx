import * as operations from "@/database/migrations/operations";
import { initDatabase } from "@/database/schema";
import { DatabaseContextType } from "@/types";
import * as SQLite from 'expo-sqlite';
import React, { createContext, useContext, useEffect, useState } from "react";

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC< {children: React.ReactNode} > = ({children}) => {
    const [db, setDB] = useState<SQLite.SQLiteDatabase| null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        initDatabase().then(setDB).catch(setError).finally(() => setIsLoading(false));
        return () => {
            if (db) {
                db.closeAsync().catch(console.error);
            }
        };
    }, []);

    const isInitDatabase = () => {
        if (!db){
            throw new Error('База данных не инициолизирована!');
        } 
        return db;
    }

    const contextValue: DatabaseContextType = {
        addMarker: async (latitude, longitude) => 
            operations.addMarker(isInitDatabase(), latitude, longitude),
        deleteMarker: async (id) =>
            operations.deleteMarker(isInitDatabase(), id),
        getMarkers: async () =>
            operations.getMarkers(isInitDatabase()),
        addImage: async (markerId, uri) =>
            operations.addImage(isInitDatabase(), markerId, uri),
        deleteImage: async (id) => 
            operations.deleteImage(isInitDatabase(), id),
        getMarkerImages: async (markerId) => 
            operations.getMarkerImages(isInitDatabase(), markerId),
        isLoading: isLoading,
        error: error
    };

    return (
        <DatabaseContext.Provider value={contextValue}>
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (context === undefined){
        throw new Error('useDatabase должна использоваться с DatabaseProvider');
    }
    return context;
}