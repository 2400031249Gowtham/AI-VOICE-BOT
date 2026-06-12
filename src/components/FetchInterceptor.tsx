"use client";

import { useEffect } from "react";

export function FetchInterceptor() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.hasOwnProperty("__fetchIntercepted")) {
      Object.defineProperty(window, "__fetchIntercepted", { value: true, writable: false });
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        let [resource, config] = args;
        
        // Convert Request object to URL string if needed
        let url = "";
        if (typeof resource === "string") {
            url = resource;
        } else if (resource instanceof URL) {
            url = resource.toString();
        } else if (resource instanceof Request) {
            url = resource.url;
        }

        let newConfig: RequestInit = config || {};
        
        // Only attach to our backend
        if (url.includes("/api/") || url.includes("8080")) {
            newConfig.headers = newConfig.headers ? new Headers(newConfig.headers) : new Headers();
            
            const userStr = localStorage.getItem("voxai_auth_user");
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user && user.email) {
                        (newConfig.headers as Headers).set("X-User-Email", user.email);
                    }
                } catch (e) {}
            }
        }
        
        return originalFetch(resource, newConfig);
      };
    }
  }, []);
  return null;
}
