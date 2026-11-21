
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Store,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

const initialForm = {
  businessName: "",
  phone: "",
  address: "",
  description: "",
};

export default function BecomeVendorForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [application, setApplication] = useState(null);

  // Fetch existing application
  useEffect(() => {
    async function fetchApplication() {
      try {
        const response = await fetch("/api/vendor/applications");

        if (!response.ok) {
          throw new Error("Failed to fetch application");
        }

        const result = await response.json();
        setApplication(result.data);
      } catch (error) {
        toast.error("Could not load application status");
      } finally {
        setChecking(false);
      }
    }

    fetchApplication();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.businessName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.description.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (form.phone.trim().length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (form.description.trim().length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/vendor/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Application failed");
      }

      setApplication(result.data);
      setForm(initialForm);

      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#fff8ef]">
        <Loader2 className="animate-spin text-[#b83227]" size={32} />
      </main>
    );
  }

  // Pending application
  if (application?.status === "pending") {
    return (
      <main className="min-h-screen bg-[#fff8ef] px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#eaded1] bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Clock size={36} className="text-amber-600" />
          </div>

          <h1 className="text-3xl font-bold text-[#27231f]">
            Application Under Review
          </h1>

          <p className="mt-4 text-gray-500">
            Your vendor application has been submitted successfully.
            It is currently waiting for admin review.
          </p>

          <div className="mt-6 rounded-xl bg-[#fff8ef] p-5 text-left">
            <p className="text-sm text-gray-500">Business Name</p>

            <p className="mt-1 font-semibold text-[#27231f]">
              {application.businessName}
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Application Status
            </p>

            <span className="mt-2 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
              Pending Review
            </span>
          </div>

          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-xl bg-[#b83227] px-6 py-3 font-semibold text-white hover:bg-[#98291f]"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Approved application
  if (application?.status === "approved") {
    return (
      <main className="min-h-screen bg-[#fff8ef] px-4 py-12">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
          <CheckCircle2
            size={64}
            className="mx-auto mb-5 text-green-600"
          />

          <h1 className="text-3xl font-bold text-[#27231f]">
            Application Approved!
          </h1>

          <p className="mt-4 text-gray-500">
            Your vendor application has been approved.
          </p>

          <Link
            href="/dashboard"
            className="mt-7 inline-flex rounded-xl bg-[#b83227] px-6 py-3 font-semibold text-white hover:bg-[#98291f]"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // Rejected application or no application
  return (
    <main className="min-h-screen bg-[#fff8ef] px-4 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b83227] text-white">
            <Store size={30} />
          </div>

          <h1 className="text-3xl font-bold text-[#27231f] sm:text-4xl">
            Become a PizzaHub Vendor
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Share your delicious pizzas with PizzaHub customers.
            Complete the application below to get started.
          </p>
        </div>

        {/* Rejected notice */}
        {application?.status === "rejected" && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-2 font-semibold text-red-700">
              <XCircle size={20} />
              Previous Application Rejected
            </div>

            <p className="mt-2 text-sm text-red-600">
              You may submit a new application with updated information.
            </p>
          </div>
        )}

        {/* Form */}
        <div className="rounded-3xl border border-[#eaded1] bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Business Name */}
            <div>
              <label
                htmlFor="businessName"
                className="mb-2 block text-sm font-semibold text-[#27231f]"
              >
                Business Name
              </label>

              <input
                id="businessName"
                name="businessName"
                type="text"
                placeholder="Enter your restaurant name"
                value={form.businessName}
                onChange={handleChange}
                maxLength={100}
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-[#27231f]"
              >
                Contact Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter contact number"
                value={form.phone}
                onChange={handleChange}
                maxLength={20}
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-[#27231f]"
              >
                Business Address
              </label>

              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter restaurant address"
                value={form.address}
                onChange={handleChange}
                maxLength={200}
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-[#27231f]"
              >
                Business Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={5}
                placeholder="Tell us about your restaurant and the pizzas you offer..."
                value={form.description}
                onChange={handleChange}
                maxLength={1000}
                className="w-full resize-none rounded-xl border border-[#eaded1] px-4 py-3 outline-none focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {form.description.length}/1000
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b83227] py-3.5 font-semibold text-white transition hover:bg-[#98291f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Submitting Application...
                </>
              ) : (
                "Submit Vendor Application"
              )}
            </button>

          </form>
        </div>

        {/* Information */}
        <div className="mt-6 rounded-2xl border border-[#eaded1] bg-[#f2e8dc] p-5">
          <h2 className="font-semibold text-[#27231f]">
            What happens next?
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>• Your application will be submitted for review.</li>
            <li>• An admin will review your business information.</li>
            <li>• Once approved, you can access vendor features.</li>
          </ul>
        </div>

      </div>
    </main>
  );
}
