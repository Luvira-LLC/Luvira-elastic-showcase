import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import EventSource from "react-native-sse";

import { captureAudioRecording, connectToStream } from "./api";
import {
  AudioStreamEventType,
  TCaptureAudioArgs,
  TStreamCallbacks,
} from "./type";

export const useCaptureAudioMutation = (streamCallbacks?: TStreamCallbacks) => {
  const queryClient = useQueryClient();
  const esRef = useRef<EventSource<AudioStreamEventType> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      esRef.current?.close();
    };
  }, []);

  return useMutation({
    mutationFn: ({ audioUri, setUploadProgress }: TCaptureAudioArgs) =>
      captureAudioRecording({ audioUri, setUploadProgress }),
    onSettled: async (data, error) => {
      if (error) {
        return;
      }

      if (data?.session_id) {
        esRef.current?.close();

        esRef.current = connectToStream(data.session_id, {
          onStatus: streamCallbacks?.onStatus,
          onCardHeader: streamCallbacks?.onCardHeader,
          onSummaryBullets: streamCallbacks?.onSummaryBullets,
          onRecallAnchor: streamCallbacks?.onRecallAnchor,
          onActionItem: streamCallbacks?.onActionItem,
          onRecallResults: streamCallbacks?.onRecallResults,
          onComplete: (finalData) => {
            streamCallbacks?.onComplete?.(finalData);
            queryClient.invalidateQueries({ queryKey: ["capture"] });
          },
          onError: streamCallbacks?.onError,
        });
      }
    },
  });
};
