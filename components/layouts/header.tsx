import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react-native";
import React from "react";
import { Text, useColorScheme, View } from "react-native";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";

export default function Header() {
  const colorScheme = useColorScheme();

  return (
    <View className="w-full min-h-12 flex flex-row justify-between items-center px-3 bg-white">
      <Button
        variant="outline"
        size="icon"
        className="bg-transparent border-0"
        accessibilityLabel="Open menu"
        accessibilityHint="Opens the navigation menu"
      >
        <Icon
          as={Menu}
          size={24}
          className={cn("text-black", {
            "text-white": colorScheme === "dark",
          })}
        />
      </Button>
      {/* <Button
        variant="ghost"
        onPress={() => router.navigate("/(root)")}
        accessibilityLabel="Luvira home"
        accessibilityHint="Returns to the home screen"
      >
        <Text className="text-xl font-semibold tracking-wide">Luvira</Text>
      </Button> */}
      <Text className="text-lg font-bold text-foreground">Insight Card</Text>
      <Button
        variant="ghost"
        accessibilityLabel="User profile"
        accessibilityHint="Opens your profile settings"
      >
        <Avatar
          alt="@mrzachnugent"
          className="border-background web:border-0 web:ring-2 web:ring-background border-2 w-9 h-9"
        >
          <AvatarImage
            source={{ uri: "https://github.com/mrzachnugent.png" }}
          />
          <AvatarFallback>
            <Text>ZN</Text>
          </AvatarFallback>
        </Avatar>
      </Button>
    </View>
  );
}
