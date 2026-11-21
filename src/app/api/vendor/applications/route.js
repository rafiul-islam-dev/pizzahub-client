
import { auth } from "@/lib/auth";
import { db } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Verify current user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // Only customers can apply
    if (session.user.role !== "customer") {
      return NextResponse.json(
        { message: "Only customers can apply to become vendors." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const businessName = body.businessName?.trim();
    const phone = body.phone?.trim();
    const address = body.address?.trim();
    const description = body.description?.trim();

    // Validate required fields
    if (!businessName || !phone || !address || !description) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    // Prevent duplicate pending application
    const existingApplication = await db
      .collection("vendorApplications")
      .findOne({
        userId: session.user.id,
        status: "pending",
      });

    if (existingApplication) {
      return NextResponse.json(
        { message: "You already have a pending application." },
        { status: 409 }
      );
    }

    const application = {
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,

      businessName,
      phone,
      address,
      description,

      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db
      .collection("vendorApplications")
      .insertOne(application);

    return NextResponse.json(
      {
        message: "Vendor application submitted successfully.",
        data: {
          ...application,
          _id: result.insertedId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Vendor application error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const application = await db
      .collection("vendorApplications")
      .findOne(
        { userId: session.user.id },
        { sort: { createdAt: -1 } }
      );

    return NextResponse.json({
      data: application,
    });
  } catch (error) {
    console.error("Fetch vendor application error:", error);

    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
