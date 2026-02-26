import { InsightCardDetails } from "@/components/insight-card-details";
import ScreenLayout from "@/components/layouts/screen-layout";
import React from "react";

export default function InsightCardDetailsScreen() {
  return (
    <ScreenLayout edges={["top", "left", "right", "bottom"]} showHeader={false}>
      <InsightCardDetails />
    </ScreenLayout>
  );
}
