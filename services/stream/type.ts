export type TAudioCaptureResponse = {
  audio_duration_seconds: number;
  audio_size_bytes: number;
  message: string;
  session_id: string;
  status: string;
};

export type TCaptureAudioArgs = {
  audioUri: string;
  lastEventId?: string;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
};

export type AudioStreamEventType =
  | "status"
  | "card_header"
  | "summary_bullets"
  | "recall_anchor"
  | "action_item"
  | "final";

export type TStreamCallbacks = {
  onStatus?: (data: { phase: string; message: string }) => void;
  onCardHeader?: (data: {
    title: string;
    vibe: string;
    card_type: string;
  }) => void;
  onSummaryBullets?: (bullets: string[]) => void;
  onRecallAnchor?: (anchor: string) => void;
  onActionItem?: (item: string) => void;
  onComplete?: (data: {
    session_id: string;
    status: string;
    processing_time_ms: number;
  }) => void;
  onError?: (error: Event) => void;
};
