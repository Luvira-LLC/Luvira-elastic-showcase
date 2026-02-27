import { useQuery } from "@tanstack/react-query";

import { recallInsights } from "./api";
import { TRecallRequestParams } from "./type";

export const useRecallInsightsQuery = ({
  recallAnchor,
  sessionId,
}: TRecallRequestParams) => {
  return useQuery({
    queryKey: ["recall"],
    queryFn: () => recallInsights({ recallAnchor, sessionId }),
    enabled: Boolean(sessionId),
  });
};
