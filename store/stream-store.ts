import { TRecallResultData } from "@/services/stream/type";
import { create } from "zustand";

export interface CardData {
  title?: string;
  vibe?: string;
  card_type?: string;
  bullets?: string[];
  recall_anchor?: string;
  action_item?: string;
}

interface StreamState {
  streamingPhase: string;
  streamingMessage: string;
  cardData: CardData;
  recallResultData: TRecallResultData | null;
  isProcessing: boolean;
  uploadProgress: number;
  errorResponse: string;
}

interface StreamActions {
  setStreamingPhase: (phase: string) => void;
  setStreamingMessage: (message: string) => void;
  setCardData: (updater: (prev: CardData) => CardData) => void;
  setRecallResultData: (data: TRecallResultData) => void;
  setIsProcessing: (value: boolean) => void;
  setUploadProgress: (progress: number) => void;
  setErrorResponse: (error: string) => void;
  resetStreamState: () => void;
}

const initialState: StreamState = {
  streamingPhase: "",
  streamingMessage: "",
  cardData: {},
  recallResultData: null,
  isProcessing: false,
  uploadProgress: 0,
  errorResponse: "",
};

export const useStreamStore = create<StreamState & StreamActions>((set) => ({
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
}));
