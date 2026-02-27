import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { NOTIFICATION_ID, RECORDING_CHANNEL_ID } from "@/constants/recording";

export const useNotificationPermissions = () => {
  const [notificationPermissionGranted, setNotificationPermissionGranted] =
    useState<boolean | null>(null);

  const checkNotificationPermissions =
    useCallback(async (): Promise<boolean> => {
      try {
        const { status } = await Notifications.getPermissionsAsync();
        return status === "granted";
      } catch (error) {
        console.error("Error checking notification permissions:", error);
        return false;
      }
    }, []);

  const requestNotificationPermissions =
    useCallback(async (): Promise<boolean> => {
      try {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();

        if (existingStatus === "granted") {
          setNotificationPermissionGranted(true);
          return true;
        }

        if (existingStatus === "denied") {
          setNotificationPermissionGranted(false);
          return false;
        }

        if (notificationPermissionGranted === false) {
          return false;
        }

        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        const granted = newStatus === "granted";
        setNotificationPermissionGranted(granted);

        return granted;
      } catch (error) {
        console.error("Error requesting notification permissions:", error);
        setNotificationPermissionGranted(false);
        return false;
      }
    }, [notificationPermissionGranted]);

  const setupNotification = useCallback(async (): Promise<void> => {
    try {
      if (!notificationPermissionGranted) {
        console.log("Skipping notification - permission not granted");
        return;
      }

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_ID,
        content: {
          title: "Luvira: Listening…",
          body: "Your audio is being captured.",
          sticky: true,
          autoDismiss: false,
          color: "#B91C1C",
        },
        trigger: null,
      });
    } catch (error) {
      console.error("Failed to show notification:", error);
    }
  }, [notificationPermissionGranted]);

  const dismissNotification = useCallback(async (): Promise<void> => {
    try {
      await Notifications.dismissNotificationAsync(NOTIFICATION_ID);
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.log("Notification cleanup skipped:", error);
    }
  }, []);

  // Initialize notification channel immediately the component is mounted
  useEffect(() => {
    const initializeNotifications = async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(RECORDING_CHANNEL_ID, {
          name: "Voice Recording",
          importance: Notifications.AndroidImportance.HIGH,
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
          sound: null,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      const hasPermission = await checkNotificationPermissions();
      if (hasPermission) {
        setNotificationPermissionGranted(true);
      }
    };

    initializeNotifications();
  }, [checkNotificationPermissions]);

  return {
    notificationPermissionGranted,
    requestNotificationPermissions,
    setupNotification,
    dismissNotification,
  };
};
