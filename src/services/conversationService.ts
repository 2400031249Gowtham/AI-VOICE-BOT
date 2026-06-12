import { API_BASE } from "@/lib/config";

export async function getConversations() {
  const response = await fetch(
    API_BASE + "/api/conversations"
  );

  if (!response.ok) {
    throw new Error("Failed to load conversations");
  }

  return response.json();
}
