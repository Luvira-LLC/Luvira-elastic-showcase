import { InsightCardDetails } from "@/components/insight-card-details";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { cn } from "@/lib/utils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Mic, Sparkles } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SUGGESTION_TAGS = [
  "What to do about my day",
  "Plan my daily tasks",
  "What to do about fun",
  "Career road map",
  "Planning Q1 for work",
];

export default function HomeScreen() {
  const [prompt, setPrompt] = useState("");
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const hasText = prompt.trim().length > 0;

  const handleTagPress = (text: string) => {
    setPrompt(text);
  };

  const handleGenerate = () => {
    if (!hasText) return;
    console.log("Generate insight:", prompt);
  };

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* <View className="flex-row items-center justify-between px-5 py-3">
          <Pressable
            onPress={openDrawer}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
          >
            <Menu
              size={24}
              color={colorScheme === "dark" ? "#fff" : "#1a1a1a"}
            />
          </Pressable>
          <Text className="text-lg font-bold text-foreground">
            Insight Card
          </Text>
          <Avatar alt="User avatar" className="size-10">
            <AvatarImage
              source={{ uri: "https://github.com/mrzachnugent.png" }}
            />
            <AvatarFallback>
              <Text className="text-muted-foreground">IV</Text>
            </AvatarFallback>
          </Avatar>
        </View> */}

        {/* <ScrollView
          className="flex-1 px-5"
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
                onPress={() => handleTagPress(tag)}
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
        </ScrollView> */}
        <InsightCardDetails />
        <View
          className={cn("px-5 pt-3 pb-5 rounded-t-2xl bg-white")}
          style={styles.shadow}
        >
          <View className="relative mb-3">
            <Textarea
              value={prompt}
              onChangeText={setPrompt}
              placeholder="Enter text here"
              numberOfLines={1}
              className={cn(
                "pr-12 min-h-12 rounded-xl border-0 outline-none shadow-transparent tracking-widest",
                colorScheme === "dark" ? "bg-zinc-800/50" : "bg-white",
              )}
              style={{ fontFamily: "Urbanist_400Regular" }}
            />
            <Pressable
              className="absolute right-3 top-3"
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Voice input"
            >
              <Mic
                size={22}
                color={colorScheme === "dark" ? "#a1a1a1" : "#9ca3af"}
              />
            </Pressable>
          </View>
          <Button
            onPress={handleGenerate}
            disabled={!hasText}
            accessibilityLabel="Generate Insight"
            className={cn(
              "w-full rounded-full h-14",
              hasText
                ? "bg-primary active:bg-primary/90"
                : colorScheme === "dark"
                  ? "bg-zinc-800"
                  : "bg-gray-100",
            )}
          >
            <Sparkles
              size={20}
              color={
                hasText
                  ? "#fff"
                  : colorScheme === "dark"
                    ? "#a1a1a1"
                    : "#9ca3af"
              }
            />
            <Text
              className={cn(
                "text-lg font-semibold ml-1 tracking-wide",
                hasText
                  ? "text-primary-foreground"
                  : colorScheme === "dark"
                    ? "text-zinc-400"
                    : "text-gray-400",
              )}
            >
              Generate Insight
            </Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
});
