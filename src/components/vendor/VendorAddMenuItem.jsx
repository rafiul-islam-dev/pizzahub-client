"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import VendorHeader from "@/components/vendor/VendorHeader";
import { createMenuItem } from "@/services/vendor.service";
import { uploadImage } from "@/services/profile.service";

const categories = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Specialty / Gourmet",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

const inputClass =
  "w-full rounded-md border border-[#e3d7c8] bg-white px-3 py-2.5 text-[12px] text-[#332c27] outline-none transition placeholder:text-[#c2b7ab] focus:border-[#b83227]";

const labelClass =
  "mb-1.5 block text-[11px] font-medium text-[#6c6359]";

export default function VendorAddMenuItem() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    category: "Classic Pizzas",
    description: "",
    price: "",
    location: "",
    image: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleImage(file) {
    if (!file) return;

    try {
      setUploading(true);
      const result = await uploadImage(file);
      const url = result?.data?.url;

      if (!url) throw new Error("Upload failed");

      setField("image", url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.price ||
      !form.image.trim()
    ) {
      toast.error(
        "Please fill in name, description, price and image"
      );
      return;
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setSubmitting(true);

      await createMenuItem({
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        price,
        location: form.location.trim(),
        image: form.image.trim(),
      });

      toast.success("Menu item submitted for review");
      router.push("/dashboard/vendor/menu");
      router.refresh();
    } catch (error) {
      toast.error(error.message || "Failed to submit item");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <VendorHeader title="Add Menu Item" />

      <section className="max-w-[720px] rounded-lg border border-[#ece2d6] bg-white p-5 sm:p-6">
        <h2 className="font-serif text-xl font-semibold text-[#332c27]">
          Add something delicious
        </h2>

        <p className="mt-1 text-[11px] text-[#9a8f84]">
          Your menu item will be reviewed before it appears to
          customers.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Item name</label>

              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="NEW pizza"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>

              <select
                value={form.category}
                onChange={(e) =>
                  setField("category", e.target.value)
                }
                className={inputClass}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Description</label>

            <textarea
              value={form.description}
              onChange={(e) =>
                setField("description", e.target.value)
              }
              rows={4}
              placeholder="Tell customers about your item..."
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Price ($)</label>

              <input
                type="number"
                min="1"
                step="0.01"
                value={form.price}
                onChange={(e) => setField("price", e.target.value)}
                placeholder="400"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Location</label>

              <input
                value={form.location}
                onChange={(e) =>
                  setField("location", e.target.value)
                }
                placeholder="Brooklyn, NY"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Images</label>

            <div className="mb-2 flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#e3d7c8] bg-white px-3 py-2 text-[11px] font-medium text-[#6c6359] transition hover:border-[#b83227] hover:text-[#b83227]">
                <Upload size={13} />
                {uploading ? "Uploading..." : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImage(e.target.files?.[0])}
                  disabled={uploading}
                />
              </label>

              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="h-9 w-9 rounded-md border border-[#e3d7c8] object-cover"
                />
              )}
            </div>

            <label className={labelClass}>Image URL</label>

            <input
              value={form.image}
              onChange={(e) => setField("image", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center gap-2 rounded-md bg-[#b83227] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#98291f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit for review
                <span aria-hidden>→</span>
              </>
            )}
          </button>
        </form>
      </section>
    </div>
  );
}