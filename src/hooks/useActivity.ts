"use client";
import { useState, useEffect } from "react";
import { activityService } from "@/services/activityService";

export function useActivity() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchActivities = async () => {
        try {
            const data = await activityService.getRecentActivities();
            setActivities(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
        const interval = setInterval(fetchActivities, 5000); // Live reload every 5s
        return () => clearInterval(interval);
    }, []);

    return { activities, loading, refresh: fetchActivities };
}
