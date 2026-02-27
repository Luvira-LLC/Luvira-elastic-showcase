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
  setUploadProgress: (progress: number) => void;
};

export type AudioStreamEventType =
  | "status"
  | "card_header"
  | "summary_bullets"
  | "recall_anchor"
  | "action_item"
  | "final"
  | "recall_results";

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
  onRecallResults?: (data: TRecallResultData) => void;
  onComplete?: (data: {
    session_id: string;
    status: string;
    processing_time_ms: number;
  }) => void;
  onError?: (error: Event) => void;
};

export type TUserInsightAnalysis = {
  ok: boolean;
  agent_run_id: string;
  timestamp: string;
  result: {
    recall_hits: string[];
    pattern_analysis: {
      dominant_theme: string;
      recurrence_count: number;
      window_days: number;
    };
    decision: "action_created" | "recall_only" | "no_hits";
    action_plan: {
      plan_id: string;
      title: string;
      recommended_steps: string[];
      related_theme: string;
      confidence: number;
    } | null;
    explainability: {
      why: string;
      policy: {
        similarity_threshold: number;
        recurrence_threshold: number;
        window_days: number;
      };
    };
    impact_report: {
      manual_baseline_seconds: number;
      agent_execution_seconds: number;
      efficiency_gain_multiplier: number;
      agent_builder_tools_used: string[];
    } | null;
  };
  trace: string[];
  metrics: {
    recall_latency_ms: number;
    analysis_latency_ms: number;
    write_latency_ms: number;
    total_time_ms: number;
    benchmarking: {
      manual_process_est_seconds: number;
      agent_process_seconds: number;
      efficiency_gain_pct: number;
      human_steps_automated: number;
    };
  };
};

export type TInsightArgs = {
  userId: string;
  sessionId: string;
  anchorText: string;
};

export type TInsight = {
  id: string;
  schema_version: number;
  timestamp: string;
  anchor_text: string;
  themes_array: string[];
  source_session_hash: string;
};

export type TRecallResultData = {
  hits: [
    {
      insight: TInsight;
      similarity_score: number;
    },
  ];
  pattern_analysis: {
    dominant_theme: string;
    recurrence_count: number;
    window_days: number;
  };
  decision: "action_created" | "recall_only" | "no_hits";
  action_plan: {
    plan_id: string;
    title: string;
    recommended_steps: string[];
    related_theme: string;
    confidence: number;
  } | null;
  explainability: {
    why: string;
    policy: {
      similarity_threshold: number;
      recurrence_threshold: number;
      window_days: number;
    };
  };
  impact_report: {
    manual_baseline_seconds: number;
    agent_execution_seconds: number;
    efficiency_gain_multiplier: number;
    agent_builder_tools_used: string[];
  };
  trace: string[];
  metrics: {
    recall_latency_ms: number;
    analysis_latency_ms: number;
    write_latency_ms: number;
    total_time_ms: number;
    benchmarking: {
      manual_process_est_seconds: number;
      agent_process_seconds: number;
      efficiency_gain_pct: number;
      human_steps_automated: number;
    };
  };
  run_id: string;
  timestamp: string;
};
