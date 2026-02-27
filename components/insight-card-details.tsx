import { TrueSheet } from "@lodev09/react-native-true-sheet";
import { useRouter } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  Mic,
  Star,
  X,
} from "lucide-react-native";
import React, { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

import { Text } from "@/components/ui/text";
import ReferencedMemoryCardItem from "./referenced-memory-card-item";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useStreamStore } from "@/store/stream-store";

import { cn } from "@/lib/utils";

const TAG_COLORS = ["#e7ffdf", "#fde68a", "#ffe5cb", "#dbeafe", "#ede9fe"];

export function InsightCardDetails() {
  const sheet = useRef<TrueSheet>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();

  const cardData = useStreamStore((s) => s.cardData);
  const recallResultData = useStreamStore((s) => s.recallResultData);

  const hits = recallResultData?.hits ?? [];
  const decision = recallResultData?.decision;
  const actionPlan = recallResultData?.action_plan;

  const present = async () => {
    await sheet.current?.present(1);
  };

  const dismiss = async () => {
    await sheet.current?.dismiss();
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
        >
          <ChevronLeft
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#1a1a1a"}
          />
        </Pressable>
        <Text
          className="text-lg font-bold text-foreground"
          style={{ fontFamily: "Urbanist_700Bold" }}
        >
          Generated Insight
        </Text>
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="More options"
        >
          <Ellipsis
            size={24}
            color={colorScheme === "dark" ? "#fff" : "#1a1a1a"}
          />
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Recording Info Row */}
        <View className="flex-row items-center gap-3 mt-4 mb-6">
          <View className="size-10 rounded-full bg-primary/15 items-center justify-center">
            <Mic size={20} color="#3bcaca" />
          </View>
          <View>
            <Text
              className="text-foreground text-base font-semibold"
              style={{ fontFamily: "Urbanist_600SemiBold" }}
            >
              {cardData.title || "Insight Card"}
            </Text>
            <Text
              className="text-muted-foreground text-sm"
              style={{ fontFamily: "Urbanist_400Regular" }}
            >
              {cardData.vibe || ""}{" "}
              {cardData.card_type ? `| ${cardData.card_type}` : ""}
            </Text>
          </View>
        </View>

        {/* Memory Card */}
        <View className="rounded-2xl bg-primary p-5 mb-6">
          {/* Card Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center gap-2">
              <View className="size-8 rounded-full bg-white/20 items-center justify-center">
                <Star size={16} color="#fff" fill="#fff" />
              </View>
              <Text
                className="text-primary-foreground text-base font-semibold"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                Memory 1
              </Text>
            </View>
            <Text
              className="text-primary-foreground/80 text-sm"
              style={{ fontFamily: "Urbanist_400Regular" }}
            >
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </View>

          {/* Card Title */}
          <Text
            className="text-primary-foreground text-xl font-bold mb-3"
            style={{ fontFamily: "Urbanist_700Bold" }}
          >
            {cardData.recall_anchor || cardData.title || "Processing..."}
          </Text>

          {/* Card Body - Bullets */}
          {cardData.bullets && cardData.bullets.length > 0 ? (
            <Text
              className="text-primary-foreground/90 text-lg leading-6 mb-4 tracking-wide"
              style={{ fontFamily: "Urbanist_500Medium" }}
            >
              {cardData.bullets.join(". ")}
            </Text>
          ) : (
            <Text
              className="text-primary-foreground/90 text-base leading-6 mb-4"
              style={{ fontFamily: "Urbanist_400Regular" }}
            >
              Generating summary...
            </Text>
          )}

          {/* Tags from first recall hit themes */}
          {hits.length > 0 &&
            (hits[0]?.insight.themes_array.length ?? 0) > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {hits[0]?.insight.themes_array.map((tag, i) => (
                  <View
                    key={tag + i}
                    className="rounded-full px-4 py-1.5"
                    style={{
                      backgroundColor: TAG_COLORS[i % TAG_COLORS.length],
                    }}
                  >
                    <Text
                      className="text-amber-900 text-sm font-medium"
                      style={{ fontFamily: "Urbanist_500Medium" }}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}
        </View>

        {/* Privacy Notice */}
        <Text
          className="text-muted-foreground text-sm text-center leading-5 mb-6"
          style={{ fontFamily: "Urbanist_400Regular" }}
        >
          Only sanitized insight summaries are stored.{"\n"}Raw transcripts are
          never indexed.
        </Text>

        {/* Referenced Memory Row */}
        {hits.length > 0 && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Referenced Memory, ${hits.length} items`}
            className={cn(
              "flex-row items-center justify-between rounded-2xl border px-5 py-4 mb-6",
              colorScheme === "dark"
                ? "border-zinc-700 bg-zinc-800/50 active:bg-zinc-700"
                : "border-gray-200 bg-slate-100 active:bg-gray-50",
            )}
            onPress={present}
          >
            <View className="flex-row items-center gap-3">
              <Text
                className="text-foreground text-base font-semibold"
                style={{ fontFamily: "Urbanist_600SemiBold" }}
              >
                Referenced Memory
              </Text>
              <View className="size-7 rounded-full bg-primary items-center justify-center">
                <Text className="text-primary-foreground text-xs font-bold">
                  {hits.length}
                </Text>
              </View>
            </View>
            <ChevronRight
              size={20}
              color={colorScheme === "dark" ? "#a1a1a1" : "#6b7280"}
            />
          </Pressable>
        )}

        {/* Action Plan / Recall Section */}
        {decision && (
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
                  Generated based on recurring {actionPlan.related_theme}{" "}
                  friction in the last{" "}
                  {recallResultData?.pattern_analysis?.window_days ?? 30} days.
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
                  backgroundColor: actionPlan ? "#dcfce7" : "#dbeafe",
                }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{
                    fontFamily: "Urbanist_500Medium",
                    color: actionPlan ? "#16a34a" : "#2563eb",
                  }}
                >
                  {actionPlan ? "Action Created" : "Recall Only"}
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
                    <View
                      key={step}
                      className="flex-row items-center gap-3 mb-3"
                    >
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

            {/* Theme */}
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
            {actionPlan && actionPlan.confidence != null && (
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
        )}

        {/* FAB spacer */}
        <View className="h-16" />
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute right-5 bottom-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="New insight"
          className="size-14 rounded-full bg-primary items-center justify-center active:bg-primary/90"
          style={styles.fab}
          onPress={() => router.replace("/(root)/recording")}
        >
          <Mic size={22} color="#fff" />
        </Pressable>
      </View>

      {/* Referenced Memory Bottom Sheet */}
      <TrueSheet
        ref={sheet}
        name="referenced-memory-sheet"
        detents={[0.5, 0.75, 1]}
        initialDetentAnimated={false}
        cornerRadius={24}
        accessible
        accessibilityLabel="Referenced Memory bottom sheet"
        accessibilityHint="Swipe down to dismiss"
        header={() => (
          <View
            className="flex-row justify-end px-4 pt-3 pb-1"
            accessible
            accessibilityRole="header"
          >
            <Pressable
              onPress={dismiss}
              className="size-10 rounded-full bg-slate-300 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="Close bottom sheet"
              hitSlop={8}
            >
              <X size={20} color="#fff" />
            </Pressable>
          </View>
        )}
      >
        <ScrollView
          className="px-5"
          nestedScrollEnabled
          overScrollMode="never"
          contentContainerStyle={{ paddingBottom: 200 }}
          accessibilityRole="list"
          accessibilityLabel="Referenced memories list"
        >
          {/* Sheet Title */}
          <View className="flex-row items-center gap-3 mb-1 mt-2">
            <Text
              className="text-foreground text-xl font-bold"
              style={{ fontFamily: "Urbanist_700Bold" }}
              accessibilityRole="header"
            >
              Referenced Memory
            </Text>
            <View className="size-7 rounded-full bg-primary items-center justify-center">
              <Text
                className="text-primary-foreground text-xs font-bold"
                accessibilityLabel={`${hits.length} memories`}
              >
                {hits.length}
              </Text>
            </View>
          </View>
          <Text
            className="text-muted-foreground text-sm mb-6"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            See similar memories and generated insights
          </Text>

          {/* Dynamic Memory Cards */}
          {hits.map((hit, index) => (
            <ReferencedMemoryCardItem
              key={hit.insight.id}
              hit={hit}
              index={index}
            />
          ))}
        </ScrollView>
      </TrueSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});
