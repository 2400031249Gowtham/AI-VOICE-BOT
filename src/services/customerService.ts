import { API_BASE } from "@/lib/config";
const BASE_URL = API_BASE + "/api/customers";

async function getAllCustomers() {
  const response = await fetch(BASE_URL);
  if (!response.ok) throw new Error("Failed to fetch customers");
  return response.json();
}

async function createCustomer(customer: any) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(customer)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Failed to create customer");
  }

  return response.json();
}

async function updateCustomer(id: string | number, customer: any) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(customer)
  });

  if (!response.ok) throw new Error("Failed to update customer");
  return response.json();
}

async function deleteCustomer(id: string | number) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) throw new Error("Failed to delete customer");
  return response.text();
}

async function getMessages(id: string | number) {
  try {
    const response = await fetch(`${API_BASE}/api/conversations?exporterId=${id}`);
    if (!response.ok) return [];
    const data = await response.json();
    
    const allMessages: any[] = [];
    data.forEach((convo: any) => {
      (convo.messages || []).forEach((msg: any) => {
        allMessages.push({
          id: msg._id || String(msg.time),
          customerId: String(id),
          type: convo.channel === "call" ? "whatsapp" : convo.channel, // fallback to whatsapp/email
          content: msg.text,
          timestamp: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: msg.sender === "AI" ? "Sent" : "Read"
        });
      });
    });
    return allMessages;
  } catch (e) {
    console.error("Error loading messages:", e);
    return [];
  }
}

async function getTimeline(id: string | number) {
  return [];
}

export const customerService = {
  getAllCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getMessages,
  getTimeline
};