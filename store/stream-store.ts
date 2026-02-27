import { TStreamRecallResults } from "@/services/stream/type";
import { create } from "zustand";

export type TCardData = {
  title?: string;
  vibe?: string;
  card_type?: string;
  bullets?: string[];
  recall_anchor?: string;
  action_item?: string;
};

type TStreamState = {
  streamingPhase: string;
  streamingMessage: string;
  cardData: TCardData;
  recallResultData: TStreamRecallResults | null;
  isProcessing: boolean;
  uploadProgress: number;
  errorResponse: string;
  sessionId: string;
};

type TStreamActions = {
  setStreamingPhase: (phase: string) => void;
  setStreamingMessage: (message: string) => void;
  setCardData: (updater: (prev: TCardData) => TCardData) => void;
  setRecallResultData: (data: TStreamRecallResults) => void;
  setIsProcessing: (value: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setErrorResponse: (error: string) => void;
  resetStreamState: () => void;
  setSessionId: (value: string) => void;
};

const initialState: TStreamState = {
  streamingPhase: "",
  streamingMessage: "",
  cardData: {},
  recallResultData: null,
  isProcessing: false,
  uploadProgress: 0,
  errorResponse: "",
  sessionId: "",
};

export const useStreamStore = create<TStreamState & TStreamActions>((set) => ({
  ...initialState,
  setStreamingPhase: (phase) => set({ streamingPhase: phase }),
  setStreamingMessage: (message) => set({ streamingMessage: message }),
  setCardData: (updater) =>
    set((state) => ({ cardData: updater(state.cardData) })),
  setRecallResultData: (data) => set({ recallResultData: data }),
  setIsProcessing: (value) => set({ isProcessing: value }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setErrorResponse: (error) => set({ errorResponse: error }),
  resetStreamState: () => set(initialState),
  setSessionId: (value) => set({ sessionId: value }),
}));
