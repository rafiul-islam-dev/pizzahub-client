import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

/* =========================================
   MongoDB Connection (Singleton)
========================================= */

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

const dbName = process.env.DB_NAME || "pizzahub";

const globalForMongo = globalThis;

const client =
  globalForMongo.mongoClient ||
  new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
  });

if (!globalForMongo.mongoClient) {
  globalForMongo.mongoClient = client;
}

export const db = client.db(dbName);

/* =========================================
   Better Auth URL Configuration
========================================= */

const APP_URL =
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null) ||
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  "http://localhost:3000";

// Stable identity used as the JWT issuer/audience. NEXT_PUBLIC_APP_URL is
// baked at build time and points to the production URL, so every deployment
// signs tokens with the same iss/aud the server expects.
const JWT_IDENTITY =
  process.env.AUTH_ISSUER ||
  process.env.NEXT_PUBLIC_APP_URL ||
  APP_URL;

/* =========================================
   Better Auth Configuration
========================================= */

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: APP_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  /* Email & Password */
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  /* Google Authentication */
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  /* User Fields */
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },

      businessName: {
        type: "string",
        required: false,
        input: false,
      },

      phone: {
        type: "string",
        required: false,
        input: false,
      },

      address: {
        type: "string",
        required: false,
        input: false,
      },

      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },

      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },

      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  /* JWT Plugin – pin issuer/audience to a stable value so tokens signed by
     any deployment are accepted by the Express server's fixed AUTH_ISSUER
     and AUTH_AUDIENCE env vars. */
  plugins: [
    jwt({
      issuer: JWT_IDENTITY,
      audience: JWT_IDENTITY,
    }),
  ],

  /* Trusted Origins – allow localhost, the configured app URL, and any
     Vercel deployment domain (production + preview). */
  trustedOrigins: async (request) => {
    const origins = [APP_URL];

    if (process.env.VERCEL_URL) {
      origins.push(`https://${process.env.VERCEL_URL}`);
    }

    const origin = request?.headers.get("origin");

    if (origin) {
      try {
        const hostname = new URL(origin).hostname;

        if (
          hostname === "localhost" ||
          hostname === "127.0.0.1" ||
          hostname.endsWith(".vercel.app") ||
          hostname === new URL(APP_URL).hostname
        ) {
          origins.push(origin);
        }
      } catch {
        // ignored
      }
    }

    return [...new Set(origins)].filter(Boolean);
  },

  /* Database Hooks */
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const userId = String(session.userId || "");

          if (!userId) {
            return false;
          }

          const user = await db.collection("user").findOne({
            $or: [
              {
                _id: userId,
              },
              {
                id: userId,
              },
            ],
          });

          if (user?.banned === true || user?.isActive === false) {
            return false;
          }

          return;
        },
      },
    },
  },
});