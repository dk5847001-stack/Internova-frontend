import API from "./api";

export async function sendAiMessage(payload, signal) {
  const response = await API.post("/ai/chat", payload, { signal });
  return response.data;
}
