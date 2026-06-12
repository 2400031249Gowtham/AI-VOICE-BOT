"use client";
import { useState } from "react";
import { authService } from "@/services/authService";

export function useAuth() {
    const [user, setUser] = useState<any>(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("voxai_auth_user");
            return stored ? JSON.parse(stored) : null;
        }
        return null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const login = async (credentials: any) => {
        setLoading(true);
        try {
            const data = await authService.login(credentials);
            setUser(data);
            if (typeof window !== "undefined") {
                localStorage.setItem("voxai_auth_user", JSON.stringify(data));
            }
            setError("");
            return true;
        } catch (err) {
            setError("Invalid credentials");
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        if (typeof window !== "undefined") {
            localStorage.removeItem("voxai_auth_user");
            window.location.href = "/login";
        }
    };

    return { user, loading, error, login, logout };
}
