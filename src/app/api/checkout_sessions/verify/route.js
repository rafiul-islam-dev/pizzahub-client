import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth, db } from "@/lib/auth";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function POST(request) {
  if (!stripe) {
    return NextResponse.json(
      { premium: false, error: "Stripe not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const sessionId = body?.sessionId;

    if (!sessionId) {
      return NextResponse.json(
        { premium: false, error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { premium: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json({ premium: false });
    }

    const userId =
      stripeSession.metadata?.userId ||
      stripeSession.client_reference_id;

    if (!userId || userId !== session.user.id) {
      return NextResponse.json(
        { premium: false, error: "Session does not belong to this user" },
        { status: 403 }
      );
    }

    // Activate premium in the database (idempotent).
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await db.collection("user").updateOne(
      {
        $or: [
          { id: userId },
          {
            _id: /^[a-f\d]{24}$/i.test(userId)
              ? userId
              : "__invalid__",
          },
        ],
      },
      {
        $set: {
          subscriptionPlan: "premium",
          subscriptionExpiresAt: expiresAt,
          stripeCustomerId: stripeSession.customer || "",
          stripeSubscriptionId: stripeSession.subscription || "",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ premium: true });
  } catch (error) {
    console.error("Verify session error:", error);

    return NextResponse.json(
      { premium: false, error: error.message },
      { status: 500 }
    );
  }
}