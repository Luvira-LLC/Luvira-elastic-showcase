import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { useCallback, useRef, useState } from "react";

export const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const isTranscribingRef = useRef(false);
  const finalTranscriptRef = useRef("");

  useSpeechRecognitionEvent("result", (event) => {
    const currentResult = event.results[0]?.transcript ?? "";

    if (event.isFinal) {
      finalTranscriptRef.current += currentResult + " ";
      setTranscript(finalTranscriptRef.current.trim());
    } else {
      setTranscript((finalTranscriptRef.current + currentResult).trim());
    }
  });

  useSpeechRecognitionEvent("end", () => {
    // Restart if still transcribing (handles auto-stop by the system)
    if (isTranscribingRef.current) {
      try {
        ExpoSpeechRecognitionModule.start({
          lang: "en-US",
          interimResults: true,
          continuous: true,
          addsPunctuation: true,
        });
      } catch (error) {
        console.error("Speech recognition restart error:", error);
      }
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.error("Speech recognition error:", event.error, event.message);
  });

  const startTranscription = useCallback(async () => {
    try {
      const { granted } =
        await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!granted) {
        console.log("Speech recognition permission not granted");
        return;
      }

      finalTranscriptRef.current = "";
      setTranscript("");
      isTranscribingRef.current = true;
      setIsTranscribing(true);

      ExpoSpeechRecognitionModule.start({
        lang: "en-US",
        interimResults: true,
        continuous: true,
        addsPunctuation: true,
      });
    } catch (error) {
      console.error("Start transcription error:", error);
    }
  }, []);

  const stopTranscription = useCallback(() => {
    isTranscribingRef.current = false;
    setIsTranscribing(false);
    try {
      ExpoSpeechRecognitionModule.stop();
    } catch (error) {
      console.error("Stop transcription error:", error);
    }
  }, []);

  const resetTranscription = useCallback(() => {
    finalTranscriptRef.current = "";
    setTranscript("");
    isTranscribingRef.current = false;
    setIsTranscribing(false);
  }, []);

  return {
    transcript,
    isTranscribing,
    startTranscription,
    stopTranscription,
    resetTranscription,
  };
};
