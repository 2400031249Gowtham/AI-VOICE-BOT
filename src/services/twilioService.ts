import { API_BASE } from "@/lib/config";
const API_URL = API_BASE;

async function makeCall(phoneNumber: string) {

    const response = await fetch(
        `${API_URL}/api/twilio/call?phoneNumber=${phoneNumber}`
    );

    return response.text();
}

export const twilioService = {
    makeCall
};