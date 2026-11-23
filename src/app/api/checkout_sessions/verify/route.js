import { NextResponse } from "next/server";
import { auth, db } from "@/lib/auth";
import { headers } from "next/headers";

// This endpoint only REPORTS premium status. Activation happens exclusively
// in the server's signature-verified Stripe webhook
// (pizzahub-server/src/routes/payments.routes.js). The browser cannot grant
// premium by calling this route.
export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ premium: false });
    }

    const userId = session.user.id;
    const { ObjectId } = await import("mongodb");

    const filters = [{ id: userId }];

    if (ObjectId.isValid(userId)) {
      filters.push({ _id: new ObjectId(userId) });
    }

    const user = await db.collection("user").findOne({
      $or: filters,
    });

    const isPremium =
      user?.subscriptionPlan === "premium" &&
      user?.subscriptionExpiresAt &&
      new Date(user.subscriptionExpiresAt) > new Date();

    return NextResponse.json({ premium: Boolean(isPremium) });
  } catch (error) {
    console.error("Verify premium error:", error?.message || error);

    return NextResponse.json({ premium: false });
  }
}