import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./header";

interface ScreenLayoutProps {
  children: ReactNode;
  showHeader?: boolean; // Option to hide header on specific screens
  edges?: ("top" | "bottom" | "left" | "right")[]; // Customize which edges to apply safe area
}

export default function ScreenLayout({
  children,
  showHeader = true,
  edges = ["top", "left", "right"],
}: ScreenLayoutProps) {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView
      className={cn("flex-1 bg-white", {
        "text-black": colorScheme === "dark",
      })}
      edges={edges}
    >
      {showHeader && <Header />}
      <View className="flex-1 bg-white">{children}</View>
    </SafeAreaView>
  );
}
