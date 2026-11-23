"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, UserRound } from "lucide-react";
import { getProfile, updateProfile, uploadImage } from "@/services/profile.service";

export default function ProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    image: "",
    role: "customer",
    businessName: "",
    phone: "",
    address: "",
    subscriptionPlan: "free",
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await getProfile();
        const user = result.data || {};

        if (cancelled) return;

        setForm({
          name: user.name || "",
          email: user.email || "",
          image: user.image || "",
          role: user.role || "customer",
          businessName: user.businessName || "",
          phone: user.phone || "",
          address: user.address || "",
          subscriptionPlan: user.subscriptionPlan || "free",
        });
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load profile"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const result = await uploadImage(file);
      const url = result?.data?.url;

      if (!url) {
        throw new Error("Image upload failed");
      }

      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);

      await updateProfile({
        name: form.name.trim(),
        image: form.image.trim(),
        businessName: form.businessName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-60 items-center justify-center">
        <Loader2
          size={32}
          className="animate-spin text-[#b83227]"
        />
      </div>
    );
  }

  const isVendor = form.role === "vendor";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
          Profile Settings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Update your name, profile image and other details.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#eaded1] bg-white p-5 sm:p-6"
      >
        <div className="flex items-center gap-4">
          {form.image ? (
            <img
              src={form.image}
              alt={form.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f2e8dc] text-[#b83227]">
              <UserRound size={28} />
            </div>
          )}

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#eaded1] px-4 py-2.5 text-sm font-medium hover:bg-[#fff8ef]">
            <Upload size={16} />
            {uploading ? "Uploading..." : "Upload Image"}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[#eaded1] bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Role
            </label>

            <input
              type="text"
              value={form.role}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[#eaded1] bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Subscription
            </label>

            <input
              type="text"
              value={form.subscriptionPlan}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-[#eaded1] bg-gray-50 px-4 py-3 text-gray-500"
            />
          </div>
        </div>

        {isVendor && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Business Name
              </label>

              <input
                type="text"
                value={form.businessName}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    businessName: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <input
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Address
              </label>

              <input
                type="text"
                value={form.address}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    address: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-[#eaded1] px-4 py-3 outline-none transition focus:border-[#b83227] focus:ring-2 focus:ring-[#b83227]/10"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#b83227] py-3.5 font-semibold text-white transition hover:bg-[#98291f] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {saving ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </form>
    </div>
  );
}