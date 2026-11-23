"use client";

import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

// Always talk to the current deployment's own origin. This avoids CORS
// errors on Vercel preview deployments (which have different domains than
// production) and prevents any browser call to localhost or a hardcoded URL.
const baseURL =
  (typeof window !== "undefined" ? window.location.origin : null) ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

export const authClient = createAuthClient({
  baseURL,
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut, useSession } = authClient;