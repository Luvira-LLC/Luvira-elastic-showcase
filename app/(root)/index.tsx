import { useRouter } from "expo-router";
import { CalendarDays, Mic } from "lucide-react-native";
import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";

import ScreenLayout from "@/components/layouts/screen-layout";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SUGGESTION_TAGS } from "@/constants/suggestion-tags";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();

  const colorScheme = useColorScheme();

  return (
    <ScreenLayout>
      <ScrollView
        className="flex-1 px-5 "
        contentContainerClassName="pb-6"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center justify-between mt-4 mb-2">
          <Text className="text-muted-foreground text-base">Hello, Ivan</Text>
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open calendar"
          >
            <CalendarDays
              size={24}
              color={colorScheme === "dark" ? "#a1a1a1" : "#6b7280"}
            />
          </Pressable>
        </View>

        <Text
          className="text-2xl font-semibold text-foreground mb-6 leading-9 tracking-wide"
          style={{ fontFamily: "Urbanist_600SemiBold" }}
        >
          What would you like to{"\n"}generate today?
        </Text>

        <View className="gap-3 mb-8">
          {SUGGESTION_TAGS.map((tag) => (
            <Pressable
              key={tag}
              //   onPress={() => handleTagPress(tag)}
              accessibilityRole="button"
              accessibilityLabel={tag}
              className={cn(
                "self-start rounded-full border px-5 py-3",
                colorScheme === "dark"
                  ? "border-zinc-700 bg-zinc-800/50 active:bg-zinc-700"
                  : "border-gray-200 bg-gray-50 active:bg-gray-100",
              )}
            >
              <Text className="text-foreground text-sm">{tag}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      <View className={cn("px-5 pt-3 pb-12 rounded-t-2xl  items-end")}>
        <Button
          variant="outline"
          size="icon"
          className="bg-primary border-0 p-8 rounded-full"
          onPress={() => router.navigate("/(root)/recording")}
          accessibilityLabel="Start voice recording"
          accessibilityHint="Opens the recording screen to capture audio"
        >
          <Icon as={Mic} size={28} className="text-white" />
        </Button>
      </View>
    </ScreenLayout>
  );
}
