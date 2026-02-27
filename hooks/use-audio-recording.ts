import { Audio } from "expo-av";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";

import { MAX_BARS } from "@/constants/recording";

type RecordingStatus = Audio.RecordingStatus;

interface UseAudioRecordingProps {
  onRecordingComplete: (audioUri: string) => Promise<void>;
  setupNotification: () => Promise<void>;
  dismissNotification: () => Promise<void>;
}

export const useAudioRecording = ({
  onRecordingComplete,
  setupNotification,
  dismissNotification,
}: UseAudioRecordingProps) => {
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [levels, setLevels] = useState<number[]>([]);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onStopRecordingRef = useRef<() => Promise<void>>(null);
  const startTimeRef = useRef<number | null>(null);
  const pauseTimeRef = useRef<number>(0);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const meteringIntervalRef = useRef<ReturnType<typeof setInterval>>(null);
  const isStoppingRef = useRef<boolean>(false);

  const startMetering = useCallback((rec: Audio.Recording): void => {
    meteringIntervalRef.current = setInterval(async () => {
      const status = (await rec.getStatusAsync()) as RecordingStatus;
      if (!status.isRecording || typeof status.metering !== "number") return;

      const amplitude = Math.max(
        0.05,
        Math.pow(10, (status.metering + 40) / 20),
      );
      setLevels((prev) => [...prev.slice(-MAX_BARS + 1), amplitude]);
    }, 100);
  }, []);

  const stopMetering = useCallback((): void => {
    if (meteringIntervalRef.current) {
      clearInterval(meteringIntervalRef.current);
      meteringIntervalRef.current = null;
    }
    // setLevels([]);
  }, []);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      newRecording.setProgressUpdateInterval(500);
      newRecording.setOnRecordingStatusUpdate((status) => {
        if (status.durationMillis >= 60000) {
          onStopRecordingRef.current?.();
        }
      });

      setRecording(newRecording);
      startTimeRef.current = Date.now();
      setTimer(0);

      countdownRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current) / 1000,
          );
          setTimer(elapsed > 60 ? 60 : elapsed);
        }
      }, 1000);

      await setupNotification();
      startMetering(newRecording);
    } catch (err) {
      console.error("Recording Start Error:", err);
      throw err;
    }
  }, [setupNotification, startMetering]);

  const pauseRecording = useCallback(async (): Promise<void> => {
    if (!recording || isPaused) return;

    try {
      await recording.pauseAsync();
      setIsPaused(true);

      // Stop metering
      if (meteringIntervalRef.current) {
        clearInterval(meteringIntervalRef.current);
        meteringIntervalRef.current = null;
      }

      // Stop timer
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }

      // Track pause time
      pauseTimeRef.current = Date.now();
    } catch (error) {
      console.error("Pause Recording Error:", error);
      throw error;
    }
  }, [recording, isPaused]);

  const resumeRecording = useCallback(async (): Promise<void> => {
    if (!recording || !isPaused) return;

    try {
      await recording.startAsync();
      setIsPaused(false);

      // Adjust start time to account for pause duration
      if (startTimeRef.current && pauseTimeRef.current) {
        const pauseDuration = Date.now() - pauseTimeRef.current;
        startTimeRef.current += pauseDuration;
        pauseTimeRef.current = 0;
      }

      // Resume timer
      countdownRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor(
            (Date.now() - startTimeRef.current) / 1000,
          );
          setTimer(elapsed > 60 ? 60 : elapsed);
        }
      }, 1000);

      // Resume metering
      startMetering(recording);
    } catch (error) {
      console.error("Resume Recording Error:", error);
      throw error;
    }
  }, [recording, isPaused, startMetering]);

  const stopRecording = useCallback(async (): Promise<void> => {
    if (isStoppingRef.current || !recording) return;
    isStoppingRef.current = true;

    try {
      stopMetering();
      startTimeRef.current = null;
      pauseTimeRef.current = 0;
      setIsPaused(false);

      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }

      const recordingInstance = recording;
      setRecording(undefined);

      if (recordingInstance) {
        try {
          await recordingInstance.stopAndUnloadAsync();
        } catch {
          // Already stopped/unloaded, safe to ignore
        }

        const uri = recordingInstance.getURI();
        console.log("Recording saved to:", uri);

        if (uri) {
          await onRecordingComplete(uri);
        }
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      await dismissNotification();
    } catch (error: any) {
      console.error("Recording Stop Error:", error);
      throw error;
    } finally {
      isStoppingRef.current = false;
    }
  }, [recording, onRecordingComplete, stopMetering, dismissNotification]);

  const discardRecording = useCallback(async (): Promise<void> => {
    if (isStoppingRef.current || !recording) return;
    isStoppingRef.current = true;

    try {
      stopMetering();
      startTimeRef.current = null;
      pauseTimeRef.current = 0;
      setIsPaused(false);

      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }

      const recordingInstance = recording;
      setRecording(undefined);

      if (recordingInstance) {
        try {
          await recordingInstance.stopAndUnloadAsync();
        } catch {
          // Already stopped/unloaded, safe to ignore
        }
      }

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      await dismissNotification();
    } catch (error) {
      console.error("Discard Recording Error:", error);
    } finally {
      isStoppingRef.current = false;
    }
  }, [recording, stopMetering, dismissNotification]);

  useEffect(() => {
    onStopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active" && recording && startTimeRef.current) {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setTimer(elapsed);
        if (elapsed >= 60) stopRecording();
      }
    });

    return () => {
      subscription.remove();
      if (recording) stopRecording();
    };
  }, [recording, stopRecording]);

  return {
    recording,
    levels,
    timer,
    isPaused,
    startRecording,
    stopRecording,
    discardRecording,
    pauseRecording,
    resumeRecording,
  };
};
