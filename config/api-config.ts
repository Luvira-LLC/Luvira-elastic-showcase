export const apiConfig = {
  stream: {
    "audio-capture": "/api/v1/capture",
    "insight-card": (sessionId: string) => `/api/v1/stream/${sessionId}`,
  },
  recall: "/api/v1/recall",
};
