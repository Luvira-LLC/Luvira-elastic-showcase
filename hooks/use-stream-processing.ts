import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef } from "react";

import { useCaptureAudioMutation } from "@/services/stream/mutations";
import { useStreamStore } from "@/store/stream-store";

export const useStreamProcessing = () => {
  const router = useRouter();

  const {
    setStreamingPhase,
    setStreamingMessage,
    setCardData,
    setRecallResultData,
    setIsProcessing,
    setUploadProgress,
    setErrorResponse,
    resetStreamState,
  } = useStreamStore();

  const updateCounterRef = useRef(0);

  const streamCallbacks = useMemo(
    () => ({
      onStatus: (status: { phase: string; message: string }) => {
        const delay = updateCounterRef.current * 100;
        updateCounterRef.current++;
        setTimeout(() => {
          setStreamingPhase(status.phase);
          setStreamingMessage(status.message);
        }, delay);
      },
      onCardHeader: (header: {
        title: string;
        vibe: string;
        card_type: string;
      }) => {
        const delay = updateCounterRef.current * 100;
        updateCounterRef.current++;
        setTimeout(() => {
          setCardData((prev) => ({
            ...prev,
            title: header.title,
            vibe: header.vibe,
            card_type: header.card_type,
          }));
        }, delay);
      },
      onSummaryBullets: (bullets: string[]) => {
        const delay = updateCounterRef.current * 100;
        updateCounterRef.current++;
        setTimeout(() => {
          setCardData((prev) => ({
            ...prev,
            bullets,
          }));
        }, delay);
      },
      onRecallAnchor: (anchor: string) => {
        const delay = updateCounterRef.current * 100;
        updateCounterRef.current++;
        setTimeout(() => {
          setCardData((prev) => ({
            ...prev,
            recall_anchor: anchor,
          }));
        }, delay);
      },
      onActionItem: (item: string) => {
        const delay = updateCounterRef.current * 100;
        updateCounterRef.current++;
        setTimeout(() => {
          setCardData((prev) => ({
            ...prev,
            action_item: item,
          }));
        }, delay);
      },
      onRecallResults: (data: any) => {
        console.log("Recall result: ", data);
        const delay = updateCounterRef.current * 100;
        updateCounterRef.current++;
        setTimeout(() => {
          setRecallResultData(data);
          router.replace("/(root)/insight-card-details");
        }, delay);
      },
      onComplete: (finalData: {
        session_id: string;
        status: string;
        processing_time_ms: number;
      }) => {
        const delay = updateCounterRef.current * 100;
        updateCounterRef.current++;
        setTimeout(() => {
          setStreamingPhase("complete");
          setStreamingMessage("Processing complete!");

          setTimeout(() => {
            setIsProcessing(false);
            updateCounterRef.current = 0;
          }, 3000);
        }, delay);
      },
      onError: (error: any) => {
        setIsProcessing(false);

        let errorMessage = "Failed to process audio stream";

        try {
          if (error.message) {
            const parsed = JSON.parse(error.message);
            if (parsed.detail) {
              errorMessage = parsed.detail;
            }
          } else if (typeof error === "string") {
            errorMessage = error;
          }
        } catch {
          errorMessage = error.message || error.toString() || errorMessage;
        }

        setErrorResponse(errorMessage);
      },
    }),
    [
      setStreamingPhase,
      setStreamingMessage,
      setCardData,
      setRecallResultData,
      setIsProcessing,
      setErrorResponse,
      router,
    ],
  );

  const { mutateAsync } = useCaptureAudioMutation(streamCallbacks);

  const processAudioFile = useCallback(
    async (audioUri: string) => {
      setIsProcessing(true);
      await mutateAsync({ audioUri, setUploadProgress });
    },
    [mutateAsync, setIsProcessing, setUploadProgress],
  );

  return {
    processAudioFile,
    resetStreamState,
  };
};
