"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// In the browser, always talk to the same origin the app is served from.
// This prevents a deployed site from ever calling localhost.
const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:3000");

export const authClient = createAuthClient({
  baseURL,
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;