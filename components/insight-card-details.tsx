import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  FilePlusCorner,
  Star,
} from "lucide-react-native";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

export function InsightCardDetails() {
  const [inputText, setInputText] = useState("");
  const colorScheme = useColorScheme();
  const hasText = inputText.trim().length > 0;

  const handleGenerate = () => {
    if (!hasText) return;
    console.log("Generate insight:", inputText);
  };

  return (
    <View className="flex-1 bg-background">
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      > */}
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
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
          Insight Card
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
        {/* Prompt Pill */}
        <View
          className={cn(
            "self-start rounded-full border px-5 py-3 mt-4 mb-6",
            colorScheme === "dark"
              ? "border-zinc-700 bg-zinc-800/50"
              : "border-gray-200 bg-gray-50",
          )}
        >
          <Text
            className="text-foreground text-sm"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            I{"'"}m stuck planning Q1 priorities
          </Text>
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
              20th Mar, 2026
            </Text>
          </View>

          {/* Card Title */}
          <Text
            className="text-primary-foreground text-xl font-bold mb-3"
            style={{ fontFamily: "Urbanist_700Bold" }}
          >
            I{"'"}m stuck planning Q1 priorities
          </Text>

          {/* Card Body */}
          <Text
            className="text-primary-foreground/90 text-base leading-6 mb-4"
            style={{ fontFamily: "Urbanist_400Regular" }}
          >
            You may be experiencing planning overload. Consider narrowing to 3
            priority outcomes. Working long hours in physically demanding
            environments can take a toll on your mental health. Here are 5
            simple yet effective.
          </Text>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-full bg-amber-100 px-4 py-1.5">
              <Text
                className="text-amber-900 text-sm font-medium"
                style={{ fontFamily: "Urbanist_500Medium" }}
              >
                Planning
              </Text>
            </View>
            <View className="rounded-full bg-amber-100 px-4 py-1.5">
              <Text
                className="text-amber-900 text-sm font-medium"
                style={{ fontFamily: "Urbanist_500Medium" }}
              >
                Overwhelm
              </Text>
            </View>
            <View className="rounded-full bg-amber-100 px-4 py-1.5">
              <Text
                className="text-amber-900 text-sm font-medium"
                style={{ fontFamily: "Urbanist_500Medium" }}
              >
                Prioritization
              </Text>
            </View>
          </View>
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Referenced Memory, 2 items"
          className={cn(
            "flex-row items-center justify-between rounded-2xl border px-5 py-4 mb-6",
            colorScheme === "dark"
              ? "border-zinc-700 bg-zinc-800/50 active:bg-zinc-700"
              : "border-gray-200 bg-slate-100 active:bg-gray-50",
          )}
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
                2
              </Text>
            </View>
          </View>
          <ChevronRight
            size={20}
            color={colorScheme === "dark" ? "#a1a1a1" : "#6b7280"}
          />
        </Pressable>

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
        >
          <FilePlusCorner size={22} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fab: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});
