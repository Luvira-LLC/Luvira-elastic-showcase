import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { cn } from "@/lib/utils";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { CalendarDays, Menu, Mic } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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
  const router = useRouter();
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  const handleTagPress = (text: string) => {
    setPrompt(text);
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
        <View className="flex-row items-center justify-between px-5 py-3">
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
        </View>

        <ScrollView
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
        </ScrollView>
        <View
          className={cn("px-5 pt-3 pb-12 rounded-t-2xl bg-white items-end")}
          // style={styles.shadow}
        >
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
