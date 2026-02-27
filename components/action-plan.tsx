import { cn } from "@/lib/utils";
import { TStreamRecallResults } from "@/services/stream/type";
import React from "react";
import { useColorScheme, View } from "react-native";
import { Text } from "./ui/text";

type ActionPlanProps = {
  recallResult: TStreamRecallResults | null;
};

export default function ActionPlan({ recallResult }: ActionPlanProps) {
  const colorScheme = useColorScheme();

  if (!recallResult) return null;

  const { decision, action_plan: actionPlan, pattern_analysis } = recallResult;

  return (
    <View
      className={cn(
        "rounded-2xl border p-5 mb-6",
        colorScheme === "dark"
          ? "border-zinc-700 bg-zinc-800/50"
          : "border-gray-200 bg-white",
      )}
    >
      {/* Title & Subtitle */}
      {actionPlan ? (
        <>
          <Text
            className="text-foreground text-xl font-bold mb-1"
            style={{ fontFamily: "Urbanist_700Bold" }}
          >
            {actionPlan.title}
          </Text>
          <Text
            className="text-muted-foreground text-sm mb-5 leading-5"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            Generated based on recurring {actionPlan.related_theme} friction in
            the last {pattern_analysis?.window_days ?? 30} days.
          </Text>
        </>
      ) : (
        <Text
          className="text-foreground text-xl font-bold mb-5"
          style={{ fontFamily: "Urbanist_700Bold" }}
        >
          Recall Summary
        </Text>
      )}

      {/* Divider */}
      <View
        className={cn(
          "mb-5",
          colorScheme === "dark"
            ? "border-zinc-700"
            : "border-dashed border-gray-200",
        )}
      />

      {/* Status */}
      <View
        className={cn(
          "rounded-xl px-5 py-4 mb-5",
          colorScheme === "dark" ? "bg-zinc-800" : "bg-gray-50",
        )}
      >
        <Text
          className="text-foreground text-base font-semibold mb-2"
          style={{ fontFamily: "Urbanist_600SemiBold" }}
        >
          Status
        </Text>
        <View
          className="self-start rounded-full px-4 py-1.5"
          style={{
            backgroundColor:
              decision === "action_created" ? "#dcfce7" : "#dbeafe",
          }}
        >
          <Text
            className="text-sm font-medium"
            style={{
              fontFamily: "Urbanist_500Medium",
              color: actionPlan ? "#16a34a" : "#2563eb",
            }}
          >
            {decision === "action_created" ? "Action Created" : "Recall Only"}
          </Text>
        </View>
      </View>

      {/* Recommended Steps — only when action_plan exists */}
      {actionPlan && actionPlan.recommended_steps.length > 0 && (
        <>
          {/* Divider */}
          <View
            className={cn(
              "border-b mb-5",
              colorScheme === "dark"
                ? "border-zinc-700"
                : "border-dashed border-gray-200",
            )}
          />

          <View
            className={cn(
              "rounded-xl px-5 py-4 mb-5",
              colorScheme === "dark" ? "bg-zinc-800" : "bg-gray-50",
            )}
          >
            <Text
              className="text-foreground text-base font-semibold mb-4"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              Recommended Steps
            </Text>
            {actionPlan.recommended_steps.map((step, index) => (
              <View key={step} className="flex-row items-center gap-3 mb-3">
                <View className="size-8 rounded-full border border-primary/30 items-center justify-center">
                  <Text
                    className="text-primary text-sm font-semibold"
                    style={{ fontFamily: "Urbanist_600SemiBold" }}
                  >
                    {index + 1}
                  </Text>
                </View>
                <Text
                  className="text-foreground text-sm flex-1 leading-5"
                  style={{ fontFamily: "Urbanist_400Regular" }}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {actionPlan?.related_theme && (
        <>
          <View
            className={cn(
              "border-b mb-5",
              colorScheme === "dark"
                ? "border-zinc-700"
                : "border-dashed border-gray-200",
            )}
          />

          <View
            className={cn(
              "rounded-xl px-5 py-4 mb-5",
              colorScheme === "dark" ? "bg-zinc-800" : "bg-gray-50",
            )}
          >
            <Text
              className="text-foreground text-base font-semibold mb-2"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              Theme
            </Text>
            <View
              className="self-start rounded-full px-4 py-1.5"
              style={{ backgroundColor: "#f1f5f9" }}
            >
              <Text
                className="text-foreground text-sm font-medium"
                style={{ fontFamily: "Urbanist_500Medium" }}
              >
                {actionPlan.related_theme}
              </Text>
            </View>
          </View>
        </>
      )}

      {/* Confidence Score */}
      {actionPlan && actionPlan.confidence !== null && (
        <>
          <View
            className={cn(
              "border-b mb-5",
              colorScheme === "dark"
                ? "border-zinc-700"
                : "border-dashed border-gray-200",
            )}
          />

          <View
            className={cn(
              "rounded-xl px-5 py-4",
              colorScheme === "dark" ? "bg-zinc-800" : "bg-gray-50",
            )}
          >
            <Text
              className="text-foreground text-base font-semibold mb-2"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              Confidence Score
            </Text>
            <Text
              className="text-sm font-semibold"
              style={{
                fontFamily: "Urbanist_600SemiBold",
                color: "#16a34a",
              }}
            >
              {actionPlan.confidence.toFixed(2)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}
