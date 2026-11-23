
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Pizza,
  Loader2,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  getMyMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from "@/services/vendor.service";
import { uploadImage } from "@/services/profile.service";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "Classic",
  image: "",
  location: "",
  ingredients: "",
};

const categories = [
  "Classic",
  "Premium",
  "Vegetarian",
  "Spicy",
  "Chicken",
  "Seafood",
];

export default function VendorMenuManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState(initialForm);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getMyMenuItems();
      setItems(data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load menu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchItems());
  }, [fetchItems]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageFile = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setImageUploading(true);

      const result = await uploadImage(file);
      const url = result?.data?.url;

      if (!url) throw new Error("Image upload failed");

      setForm((prev) => ({ ...prev, image: url }));
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setImageUploading(false);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name || "",
      description: item.description || "",
      price: String(item.price || ""),
      category: item.category || "Classic",
      image: item.image || "",
      location: item.location || "",
      ingredients: Array.isArray(item.ingredients)
        ? item.ingredients.join(", ")
        : "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      await deleteMenuItem(id);
      toast.success("Menu item deleted");
      await fetchItems();
    } catch (error) {
      toast.error(error?.message || "Failed to delete menu item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.price ||
      !form.category ||
      !form.image.trim()
    ) {
      toast.error("Please fill in all required fields including an image");
      return;
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    const ingredients = form.ingredients
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      image: form.image.trim(),
      location: form.location.trim(),
      ingredients,
    };

    try {
      setSubmitting(true);

      if (editingId) {
        await updateMenuItem(editingId, payload);
        toast.success("Menu item updated!");
      } else {
        await createMenuItem(payload);
        toast.success("Menu item submitted for admin approval!");
      }

      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);

      await fetchItems();
    } catch (error) {
      toast.error(error.message || "Failed to save menu item");
    } finally {
      setSubmitting(false);
    }
  };

  const activeItems = items.filter((item) => item.isAvailable);

  return (
    <div className="min-h-screen bg-[#fff8ef]">
      <div className="container-custom space-y-6 py-8">

        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard/vendor"
              className="mb-3 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#b83227]"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold text-[#27231f] md:text-3xl">
              Menu Management
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your pizza menu and add new items.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchItems}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
                setShowForm((prev) => !prev);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#b83227] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#98291f]"
            >
              <Plus size={17} />
              Add Pizza
            </button>
          </div>
        </div>

        {/* Limit Information */}
        <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm text-orange-800">
            <strong>Free Plan:</strong> You can have up to 3 active menu items.
            Items must be approved by Admin before appearing publicly.
          </p>

          <p className="mt-1 text-xs text-orange-700">
            Active items: {activeItems.length} / 3
          </p>
        </div>

        {/* Add Form */}
        {showForm && (
          <section className="rounded-2xl border border-[#eaded1] bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-5 text-xl font-bold text-[#27231f]">
              {editingId ? "Edit Pizza" : "Add New Pizza"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Pizza Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Chicken Supreme"
                    maxLength={100}
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b83227]"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Price (৳) *
                  </label>

                  <input
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="750"
                    required
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b83227]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Category *
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#b83227]"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Item Image *
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFile}
                    disabled={imageUploading}
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b83227]"
                  />

                  {imageUploading && (
                    <p className="mt-1 text-xs text-gray-500">
                      Uploading image...
                    </p>
                  )}

                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="mt-3 h-32 w-full rounded-lg object-cover"
                    />
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Location
                  </label>

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Area / city"
                    className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b83227]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your pizza..."
                  rows={4}
                  maxLength={1000}
                  required
                  className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b83227]"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Ingredients
                </label>

                <input
                  name="ingredients"
                  value={form.ingredients}
                  onChange={handleChange}
                  placeholder="Chicken, Cheese, Onion, Capsicum"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#b83227]"
                />

                <p className="mt-1 text-xs text-gray-400">
                  Separate ingredients with commas.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#b83227] px-5 py-3 text-sm font-semibold text-white hover:bg-[#98291f] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Plus size={17} />
                  )}

                  {submitting ? "Saving..." : editingId ? "Update Pizza" : "Submit Pizza"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(initialForm);
                  }}
                  disabled={submitting}
                  className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Menu Items */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[#27231f]">
            Your Menu ({items.length})
          </h2>

          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <Loader2
                size={32}
                className="animate-spin text-[#b83227]"
              />
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <Pizza size={45} className="mx-auto text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-700">
                Your menu is empty
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first pizza to get started.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#b83227] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#98291f]"
              >
                <Plus size={16} />
                Add Your First Pizza
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item._id}
                  className="overflow-hidden rounded-xl border border-[#eaded1] bg-white shadow-sm"
                >
                  {/* Image */}
                  <div className="flex h-48 items-center justify-center bg-orange-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Pizza size={60} className="text-orange-200" />
                    )}
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-[#27231f]">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-xs text-gray-500">
                          {item.category}
                        </p>
                      </div>

                      <p className="shrink-0 font-bold text-[#b83227]">
                        ৳{item.price}
                      </p>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-gray-500">
                      {item.description}
                    </p>

                    {/* Approval Status */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.isApproved ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                          <CheckCircle2 size={13} />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                          <Clock size={13} />
                          Pending Approval
                        </span>
                      )}

                      {item.isAvailable ? (
                        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                          <XCircle size={13} />
                          Unavailable
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 border-t border-gray-100 pt-3">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="rounded-lg border border-[#eaded1] px-3 py-1.5 text-xs font-medium text-[#51483f] hover:bg-[#fff8ef]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                      {item.ingredients?.length > 0 && (
                      <div className="border-t border-gray-100 pt-3">
                        <p className="text-xs text-gray-400">
                          Ingredients
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {item.ingredients.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
