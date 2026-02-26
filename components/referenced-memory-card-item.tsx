import { Star } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { TInsight } from "../services/stream/type";
import { Badge } from "./ui/badge";
import { Text } from "./ui/text";

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

type ReferencedMemoryCardItemProps = {
  hit: {
    insight: TInsight;
    similarity_score: number;
  };
  index: number;
};

export default function ReferencedMemoryCardItem({
  hit,
  index,
}: ReferencedMemoryCardItemProps) {
  return (
    <View
      className="rounded-2xl p-5 mb-4"
      style={{
        backgroundColor: index === 0 ? "#3bcaca" : "#3b82c8",
      }}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`Memory ${index + 1}. ${hit.insight.anchor_text}. Similarity ${hit.similarity_score.toFixed(2)}`}
    >
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center gap-2">
          <View className="size-8 rounded-full bg-white/20 items-center justify-center">
            <Star size={16} color="#fff" fill="#fff" />
          </View>
          <Text
            className="text-base font-semibold"
            style={{
              fontFamily: "Urbanist_600SemiBold",
              color: "#fff",
            }}
          >
            Memory {index + 1}
          </Text>
        </View>
        <Text
          className="text-sm"
          style={{
            fontFamily: "Urbanist_400Regular",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {formatDate(hit.insight.timestamp)}
        </Text>
      </View>

      <Text
        className="text-xl font-bold mb-3"
        style={{ fontFamily: "Urbanist_700Bold", color: "#fff" }}
      >
        {hit.insight.anchor_text}
      </Text>

      {hit.insight.themes_array.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mb-4">
          {hit.insight.themes_array.map((tag, i) => (
            <Badge key={tag + i} className="bg-amber-100">
              <Text
                className="text-amber-900 text-sm tracking-wide"
                style={{ fontFamily: "Urbanist_400Regular" }}
              >
                {tag}
              </Text>
            </Badge>
          ))}
        </View>
      )}

      <View className="flex-row items-center justify-between">
        <Text
          className="text-sm"
          style={{
            fontFamily: "Urbanist_400Regular",
            color: "rgba(255,255,255,0.8)",
          }}
        >
          Similarity
        </Text>
        <Text
          className="text-base font-bold"
          style={{ fontFamily: "Urbanist_700Bold", color: "#fff" }}
        >
          {hit.similarity_score.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}
