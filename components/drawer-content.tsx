import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { cn } from "@/lib/utils";
import {
  DrawerContentScrollView,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { LogOut, Settings, User } from "lucide-react-native";
import { Pressable, View } from "react-native";

const MENU_ITEMS = [
  { label: "Profile", icon: User },
  { label: "Settings", icon: Settings },
];

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === "dark" ? "#e4e4e7" : "#27272a";

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1 }}
    >
      <View className="flex-1 px-4">
        {/* User Info */}
        <View className="flex-row items-center gap-3 py-6 mb-2">
          <Avatar alt="User avatar" className="size-14">
            <AvatarImage
              source={{
                uri: "https://i.pravatar.cc/100",
              }}
            />
            <AvatarFallback>
              <Text className="text-muted-foreground text-lg">IV</Text>
            </AvatarFallback>
          </Avatar>
          <View>
            <Text className="text-foreground text-lg font-semibold">Ivan</Text>
            <Text className="text-muted-foreground text-sm">
              ivan@example.com
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View
          className={cn(
            "h-px mb-2",
            colorScheme === "dark" ? "bg-zinc-800" : "bg-gray-200"
          )}
        />

        {/* Menu Items */}
        {MENU_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            className={cn(
              "flex-row items-center gap-3 px-3 py-4 rounded-lg",
              colorScheme === "dark"
                ? "active:bg-zinc-800"
                : "active:bg-gray-100"
            )}
            onPress={() => props.navigation.closeDrawer()}
          >
            <item.icon size={22} color={iconColor} />
            <Text className="text-foreground text-base">{item.label}</Text>
          </Pressable>
        ))}

        {/* Spacer */}
        <View className="flex-1" />

        {/* Divider */}
        <View
          className={cn(
            "h-px mb-2",
            colorScheme === "dark" ? "bg-zinc-800" : "bg-gray-200"
          )}
        />

        {/* Logout */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Logout"
          className={cn(
            "flex-row items-center gap-3 px-3 py-4 rounded-lg mb-4",
            colorScheme === "dark"
              ? "active:bg-zinc-800"
              : "active:bg-gray-100"
          )}
          onPress={() => props.navigation.closeDrawer()}
        >
          <LogOut size={22} color="#ef4444" />
          <Text className="text-destructive text-base">Logout</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}
