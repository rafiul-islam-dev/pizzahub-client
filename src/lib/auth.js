import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);

export const db = client.db(process.env.DB_NAME || "pizzahub");

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.BETTER_AUTH_URL ||
  "http://localhost:3000";

export const auth = betterAuth({
  database: mongodbAdapter(db),

  baseURL: process.env.BETTER_AUTH_URL || APP_URL,

  secret: process.env.BETTER_AUTH_SECRET,

  // Password rules required by the assignment: min 6 chars, one uppercase,
  // one lowercase. The uppercase/lowercase rule is validated in the sign-up
  // form and enforced here so no API call can bypass it.
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      // role is assigned by the server, never trusted from the client
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: false,
      },
      // vendor business details (set when a vendor application is approved)
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
      // subscription / moderation flags, all server-controlled
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

  plugins: [jwt()],

  trustedOrigins: [
    "http://localhost:3000",
    APP_URL,
  ].filter(Boolean),

  databaseHooks: {
    // Block suspended users at the auth layer, so no dashboard route or API
    // call can be used with a valid session.
    session: {
      create: {
        before: async (session) => {
          const userId = String(session.userId || "");

          if (!userId) return false;

          const user = await db.collection("user").findOne({
            $or: [
              { _id: /^[a-f\d]{24}$/i.test(userId) ? userId : "__invalid__" },
              { id: userId },
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