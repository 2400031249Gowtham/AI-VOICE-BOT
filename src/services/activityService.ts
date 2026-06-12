import { API_BASE } from "@/lib/config";
const API_URL = API_BASE;

const BASE_URL = `${API_URL}/api/activity`;

async function getRecentActivities() {

    const res = await fetch(BASE_URL);

    if (!res.ok)
        throw new Error("Failed to fetch activities");

    return res.json();
}

export const activityService = {
    getRecentActivities
};