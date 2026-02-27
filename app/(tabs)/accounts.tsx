import { Text } from "@/components/ui/text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-4">
        <Text variant="h3">Accounts</Text>
        <Text className="text-muted-foreground mt-2">
          Your accounts will appear here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
