"use client";

import { use } from "react";
import DiscussDetailScreen from "../screens/DiscussDetailScreen";

export default function DiscussDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return <DiscussDetailScreen id={id} />;
}