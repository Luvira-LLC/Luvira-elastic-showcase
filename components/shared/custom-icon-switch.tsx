import { AudioLines, ListMusic } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";
import { Icon } from "../ui/icon";

type TAudioView = "waveform" | "transcription";

interface CustomIconSwitchProps {
  value: TAudioView;
  onValueChange: (value: TAudioView) => void;
  className?: string;
}

export function CustomIconSwitch({
  value,
  onValueChange,
  className,
}: CustomIconSwitchProps) {
  const colorScheme = useColorScheme();
  const progress = useSharedValue(value === "waveform" ? 0 : 1);

  React.useEffect(() => {
    progress.value = withTiming(value === "waveform" ? 0 : 1, {
      duration: 200,
    });
  }, [value, progress]);

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const translateX = progress.value * 44; // Width of one side (88/2)

    return {
      transform: [{ translateX }],
    };
  });

  const handlePress = (newValue: TAudioView) => {
    if (newValue !== value) {
      onValueChange(newValue);
    }
  };

  return (
    <View className={cn("flex-row items-center", className)}>
      <View
        className="relative flex-row items-center rounded-full p-1 bg-gray-200"
        style={{ width: 96, height: 45 }}
      >
        {/* Animated indicator */}
        <Animated.View
          className="absolute bg-primary rounded-full"
          style={[
            {
              width: 44,
              height: 40,
              left: 4,
            },
            animatedIndicatorStyle,
          ]}
        />

        {/* Audio Lines Button */}
        <TouchableOpacity
          onPress={() => handlePress("waveform")}
          className="flex-1 items-center justify-center z-10"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Audio Waveform view"
          accessibilityHint="Switch to audio waveform view"
          accessibilityState={{ selected: value === "waveform" }}
        >
          <Icon
            as={AudioLines}
            size={24}
            className={cn("text-gray-600", {
              "text-[#1F2937]": colorScheme === "dark",
              "text-white": value === "waveform",
            })}
          />
        </TouchableOpacity>

        {/* List Music Button */}
        <TouchableOpacity
          onPress={() => handlePress("transcription")}
          className="flex-1 items-center justify-center z-10"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Audio transcription view"
          accessibilityHint="Switch to transcription view"
          accessibilityState={{ selected: value === "transcription" }}
        >
          <Icon
            as={ListMusic}
            size={24}
            className={cn("text-gray-600", {
              "text-[#1F2937]": colorScheme === "dark",
              "text-white": value === "transcription",
            })}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
