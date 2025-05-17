import { ActiveNotification, MarkerData } from "@/types";
import * as Notifications from "expo-notifications";


export class NotificationManager {
    private activeNotifications: Map <string, ActiveNotification>;

    constructor() {
        this.activeNotifications = new Map();
    }

    async requestNotificationPermission(){
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted"){
            throw new Error("Доступ запрещен");
        }

        Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
      }),
    });
  }

    async showNotification(marker: MarkerData): Promise<void> {
        if (this.activeNotifications.has(marker.id)){
            return;
        }
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Вы рядом с меткой!",
                body: "Вы находитесь рядом с сохраненной точкой.",
            },
            trigger: null
        });

        this.activeNotifications.set(marker.id, {
            markerId: marker.id,
            notificationId,
            timestamp: Date.now()
        });
    }

    async removeNotification(markerId: string): Promise<void> {
        const notification = this.activeNotifications.get(markerId);
        if(notification){
            await Notifications.dismissNotificationAsync(notification.notificationId);
            await Notifications.cancelScheduledNotificationAsync(notification.notificationId);
            this.activeNotifications.delete(markerId);
        }
    }
}