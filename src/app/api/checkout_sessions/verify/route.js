import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

function userFilter(userId) {
  const filter = [{ id: userId }];

  if (/^[a-f\d]{24}$/i.test(userId)) {
    // ObjectId is applied by the caller via the mongodb driver.
    filter.push({ _id: userId });
  }

  return filter;
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const sessionId = body?.sessionId;

    if (!sessionId) {
      return NextResponse.json({ premium: false });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ premium: false });
    }

    const userId = session.user.id;

    // First check the database – if already premium we are done.
    const { ObjectId } = await import("mongodb");
    const filters = [{ id: userId }];

    if (ObjectId.isValid(userId)) {
      filters.push({ _id: new ObjectId(userId) });
    }

    const user = await db.collection("user").findOne({
      $or: filters,
    });

    if (user?.subscriptionPlan === "premium") {
      return NextResponse.json({ premium: true });
    }

    if (!stripe) {
      return NextResponse.json({ premium: false });
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(
      sessionId
    );

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json({ premium: false });
    }

    const sessionUserId =
      stripeSession.metadata?.userId ||
      stripeSession.client_reference_id;

    if (!sessionUserId || sessionUserId !== userId) {
      return NextResponse.json({ premium: false });
    }

    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await db.collection("user").updateOne(
      { $or: filters },
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
    console.error("Verify session error:", error?.message || error);

    // Never return a 500 here – the success page polls this endpoint and
    // a 500 just spams the browser console.
    return NextResponse.json({ premium: false });
  }
}