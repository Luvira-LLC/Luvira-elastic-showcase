import * as FileSystem from "expo-file-system/legacy";
import EventSource from "react-native-sse";

import { apiConfig } from "@/config/api-config";
import { BASE_URL } from "../BASE_URL";
import axios from "../axios";
import {
  AudioStreamEventType,
  TAudioCaptureResponse,
  TCaptureAudioArgs,
  TInsightArgs,
  TStreamCallbacks,
  TUserInsightAnalysis,
} from "./type";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NzIzNjUzNjAsInN1YiI6IjA0ZGEwZDc5LTRjNTAtNDQyNi04NDU1LTc4ZTA5YTgxZTQxYiJ9.pABosbRKaq71_6D7OrOBZyPWOD7Hpm3SbL9U4WBntWc";

export const captureAudio = async ({
  audioUri,
  setUploadProgress,
}: TCaptureAudioArgs): Promise<TAudioCaptureResponse> => {
  const formData = new FormData();

  formData.append("file", {
    uri: audioUri,
    type: "audio/m4a",
    name: "recording.m4a",
  } as any);

  const { data } = await axios.post(
    apiConfig.stream["audio-capture"],
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress(progressEvent) {
        const total = progressEvent.total;
        if (total) {
          const percentage = Number(
            Math.round((progressEvent.loaded * 100) / total!),
          );

          setUploadProgress(percentage);
        }
      },
    },
  );

  return data as TAudioCaptureResponse;
};

export const captureAudioRecording = async ({
  audioUri,
  setUploadProgress,
  lastEventId,
}: TCaptureAudioArgs): Promise<TAudioCaptureResponse> => {
  const uploadResult = FileSystem.createUploadTask(
    BASE_URL + apiConfig.stream["audio-capture"],
    audioUri,
    {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      mimeType: "audio/mp4",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    (progressData) => {
      const percentage = Math.round(
        (progressData.totalBytesSent * 100) /
          progressData.totalBytesExpectedToSend,
      );

      setUploadProgress(percentage);
    },
  );

  const response = await uploadResult.uploadAsync();
  if (!response || response.status < 200 || response.status >= 300) {
    console.error(response?.body);
    throw new Error(`Upload failed with status ${response?.status}`);
  }

  return JSON.parse(response.body) as TAudioCaptureResponse;
};

export const connectToStream = (
  sessionId: string,
  callbacks: TStreamCallbacks = {},
  lastEventId?: string,
  retryCount = 0,
  maxRetries = 3,
) => {
  // Track the last event ID received
  let currentLastEventId = lastEventId || "0";

  // Build URL with last_event_id query parameter
  const baseUrl = BASE_URL + apiConfig.stream["insight-card"](sessionId);
  const url = lastEventId ? `${baseUrl}?last_event_id=${lastEventId}` : baseUrl;

  console.log(
    `Connecting to SSE stream (attempt ${retryCount + 1}/${maxRetries + 1})...`,
  );

  const es = new EventSource<AudioStreamEventType>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  es.addEventListener("open", (event) => {
    console.log("✅ SSE connection opened successfully");
  });

  // Helper to track event ID from each event
  const trackEventId = (event: any) => {
    if (event.id) {
      currentLastEventId = event.id;
      console.log(`📍 Tracked event ID: ${event.id}`);
    }
  };

  es.addEventListener("status", (event) => {
    trackEventId(event);
    const data = JSON.parse(event.data ?? "{}");
    console.log(data.phase, data.message);
    callbacks.onStatus?.(data);
  });

  es.addEventListener("card_header", (event) => {
    trackEventId(event);
    const data = JSON.parse(event.data ?? "{}");
    console.log(data.title, data.vibe, data.card_type);
    callbacks.onCardHeader?.(data);
  });

  es.addEventListener("summary_bullets", (event) => {
    trackEventId(event);
    const bullets: string[] = JSON.parse(event.data ?? "[]");
    console.log(bullets);
    callbacks.onSummaryBullets?.(bullets);
  });

  es.addEventListener("recall_anchor", (event) => {
    trackEventId(event);
    const data = event.data;
    console.log(data);
    callbacks.onRecallAnchor?.(event.data ?? "");
  });

  es.addEventListener("action_item", (event) => {
    trackEventId(event);
    const data = event.data;
    console.log(data);
    callbacks.onActionItem?.(event.data ?? "");
  });

  es.addEventListener("final", (event) => {
    trackEventId(event);
    const data = JSON.parse(event.data ?? "{}");
    console.log("✅ Done:", data.session_id, data.status);
    callbacks.onComplete?.(data);
    es.close();
  });

  es.addEventListener("error", (event: any) => {
    console.error("❌ SSE error:", event);

    // Check if we should retry
    const shouldRetry = retryCount < maxRetries;
    const isNetworkError =
      event.type === "error" && !event.message?.includes("404");

    if (shouldRetry && isNetworkError) {
      // Close current connection
      es.close();

      // Calculate exponential backoff delay
      const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 10000);
      console.log(
        `🔄 Retrying connection in ${retryDelay}ms (from event ${currentLastEventId})...`,
      );

      // Retry with last event ID after delay
      setTimeout(() => {
        connectToStream(
          sessionId,
          callbacks,
          currentLastEventId,
          retryCount + 1,
          maxRetries,
        );
      }, retryDelay);
    } else {
      // Max retries reached or non-recoverable error
      console.error("💥 Connection failed, invoking error callback");
      callbacks.onError?.(event);
      es.close();
    }
  });

  return es;
};

export const retrieveUserPastInsights = async ({
  userId,
  sessionId,
  anchorText,
}: TInsightArgs) => {
  const { data } = await axios.post(apiConfig["agent-run"], {
    user_id: userId,
    session_id: sessionId,
    anchor_text: anchorText,
  });

  return data as TUserInsightAnalysis;
};
