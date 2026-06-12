import { API_BASE } from "@/lib/config";
const API_URL = API_BASE;

const BASE_URL = `${API_URL}/api/auth`;

async function login(credentials: any) {

    const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(credentials)
    });

    if (!res.ok)
        throw new Error("Login failed");

    return res.json();
}

async function signup(user: any) {

    const res = await fetch(`${BASE_URL}/signup`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(user)
    });

    if (!res.ok)
        throw new Error("Signup failed");

    return res.json();
}

export const authService = {
    login,
    signup
};