import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import ScreenLayout from "@/components/layouts/screen-layout";
import Waveform from "@/components/recording/waveform";
import { CustomIconSwitch } from "@/components/shared/custom-icon-switch";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { useAudioPermissions } from "@/hooks/use-audio-permission";
import { useAudioRecording } from "@/hooks/use-audio-recording";
import { useNotificationPermissions } from "@/hooks/use-notification-permission";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useStreamProcessing } from "@/hooks/use-stream-processing";
import { cn } from "@/lib/utils";
import { Pause, Play, Square } from "lucide-react-native";

const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export default function Recording() {
  const router = useRouter();
  const [value, setValue] = useState<"waveform" | "transcription">("waveform");
  const [countdown, setCountdown] = useState<number | null>(3);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasStartedRef = useRef(false);

  const { handlePermissionRequest: handleAudioPermission } =
    useAudioPermissions();
  const {
    requestNotificationPermissions,
    setupNotification,
    dismissNotification,
  } = useNotificationPermissions();
  const { processAudioFile, resetStreamState } = useStreamProcessing();
  const {
    transcript,
    startTranscription,
    stopTranscription,
    resetTranscription,
  } = useSpeechRecognition();

  const {
    recording,
    timer,
    isPaused,
    startRecording,
    stopRecording,
    discardRecording,
    pauseRecording,
    resumeRecording,
    levels,
  } = useAudioRecording({
    onRecordingComplete: processAudioFile,
    setupNotification,
    dismissNotification,
  });

  const beginRecording = useCallback(async () => {
    resetStreamState();
    resetTranscription();

    const hasAudioPermission = await handleAudioPermission();
    if (!hasAudioPermission) return;

    const hasNotificationPermission = await requestNotificationPermissions();
    if (!hasNotificationPermission) {
      console.log("Go ahead and recording withoout notiifcation");
    }

    await startRecording();
    await startTranscription();
  }, [
    handleAudioPermission,
    requestNotificationPermissions,
    startRecording,
    startTranscription,
    resetStreamState,
    resetTranscription,
  ]);

  const handleStop = useCallback(async () => {
    stopTranscription();
    await stopRecording();
    router.back();
  }, [stopRecording, stopTranscription, router]);

  // Countdown on mount, then start recording
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Start recording when countdown finishes
  useEffect(() => {
    if (countdown === null && !hasStartedRef.current) {
      hasStartedRef.current = true;
      beginRecording();
    }
  }, [countdown, beginRecording]);

  // Clean up recording and transcription when navigating away from this screen
  const discardRecordingRef = useRef(discardRecording);
  discardRecordingRef.current = discardRecording;
  const stopTranscriptionRef = useRef(stopTranscription);
  stopTranscriptionRef.current = stopTranscription;

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopTranscriptionRef.current();
        discardRecordingRef.current();
      };
    }, []),
  );

  const isCountingDown = countdown !== null;

  return (
    <ScreenLayout edges={["top", "left", "right", "bottom"]}>
      <ScrollView
        className="flex-1 px-3"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View className="flex-1">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-medium tracking-wide text-gray-500">
              {isCountingDown ? "Get Ready" : "Speak Now"}
            </Text>
            <View>
              <CustomIconSwitch
                value={value}
                onValueChange={(val) => setValue(val)}
              />
            </View>
          </View>
          <View className="min-h-80 bg-gray-200 rounded-lg relative">
            {!isCountingDown && recording && (
              <View
                className={cn(
                  "h-3 w-3 rounded-full bg-primary absolute top-2 right-2 animate-none",
                  {
                    "bg-red-500": isPaused,
                    "animate-ping": !isPaused && recording,
                  },
                )}
              />
            )}
            <View className="flex-1 justify-center items-center overflow-hidden">
              {isCountingDown ? (
                <Text className="text-8xl font-bold text-primary">
                  {countdown}
                </Text>
              ) : value === "waveform" ? (
                <Waveform levels={levels} />
              ) : (
                <ScrollView
                  className="flex-1 w-full p-4"
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <Text className="text-base text-gray-700 leading-7 tracking-wide">
                    {transcript || "Start speaking to see transcription..."}
                  </Text>
                </ScrollView>
              )}
            </View>
          </View>
          <View className="mt-5">
            <Text className="text-2xl font-semibold tracking-wider text-center text-gray-500">
              {isCountingDown ? formatTime(0) : formatTime(timer)}
            </Text>
          </View>
          <View className="flex flex-row gap-x-3 items-center justify-center mt-5">
            <Text className="text-lg font-normal text-gray-500">
              {isCountingDown
                ? "Recording starts soon"
                : isPaused
                  ? "Recording paused"
                  : "Luvira is listening"}
            </Text>
            {!isCountingDown && !isPaused && (
              <Text className="font-semibold text-primary text-xl">...</Text>
            )}
          </View>
        </View>
        {!isCountingDown && recording && (
          <View className="flex-row gap-x-3">
            {!isPaused ? (
              <Button
                variant="default"
                className="flex-1 flex-row items-center min-h-14 bg-gray-200 rounded-full active:bg-gray-300"
                accessibilityLabel="Pause recording"
                accessibilityHint="Pauses the current audio recording"
                onPress={pauseRecording}
              >
                <Icon as={Pause} size={24} />
                <Text className="text-lg">Pause</Text>
              </Button>
            ) : (
              <Button
                variant="default"
                className="flex-1 flex-row items-center min-h-14 bg-primary rounded-full active:bg-teal-300"
                accessibilityLabel="Resume recording"
                accessibilityHint="Resumes the paused audio recording"
                onPress={resumeRecording}
              >
                <Icon as={Play} size={24} className="text-white" />
                <Text className="text-lg text-white font-medium">Resume</Text>
              </Button>
            )}

            <Button
              variant="destructive"
              className="flex-1 rounded-full min-h-14 bg-red-200 active:bg-red-300"
              accessibilityLabel="Stop recording"
              accessibilityHint="Stops and saves the current audio recording"
              onPress={handleStop}
            >
              <Icon as={Square} size={24} className="text-red-700" />
              <Text className="text-red-700 text-lg">Stop</Text>
            </Button>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
