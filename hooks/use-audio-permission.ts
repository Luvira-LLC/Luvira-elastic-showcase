import { Audio } from "expo-av";
import { useCallback, useState } from "react";
import { Alert, Linking } from "react-native";

export const useAudioPermissions = () => {
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  const handlePermissionRequest = useCallback(async (): Promise<boolean> => {
    if (isCheckingPermission) return false;

    setIsCheckingPermission(true);
    try {
      let currentPermissionStatus = permissionResponse;

      if (!currentPermissionStatus) {
        currentPermissionStatus = await requestPermission();
      }

      // If already granted, we're good
      if (currentPermissionStatus.granted) {
        return true;
      }

      // If we can ask again, request permission
      if (currentPermissionStatus.canAskAgain) {
        const newPermissionStatus = await requestPermission();

        if (newPermissionStatus.granted) {
          return true;
        }

        Alert.alert(
          "Microphone Permission Required",
          "Luvira needs microphone access to record your voice. Please grant permission to continue.",
          [{ text: "OK", style: "cancel" }],
        );
        return false;
      }

      // User denied access to mic, so guide them to settings to enable the mic
      Alert.alert(
        "Microphone Access Required",
        "Microphone access has been denied. Please enable it in your device settings to use voice recording.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ],
      );
      return false;
    } catch (error) {
      console.error("Error handling audio permission:", error);
      Alert.alert(
        "Permission Error",
        "An error occurred while checking microphone permissions. Please try again.",
        [{ text: "OK", style: "cancel" }],
      );
      return false;
    } finally {
      setIsCheckingPermission(false);
    }
  }, [isCheckingPermission, permissionResponse, requestPermission]);

  return {
    handlePermissionRequest,
    isCheckingPermission,
  };
};
