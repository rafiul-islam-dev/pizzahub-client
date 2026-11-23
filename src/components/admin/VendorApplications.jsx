
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Store,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Loader2,
  MapPin,
  Phone,
  User,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  getVendorApplications,
  reviewVendorApplication,
} from "@/services/admin.service";

const FILTERS = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

export default function VendorApplications() {
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");

  const fetchApplications = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");

        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const data = await getVendorApplications(status);

        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load applications");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [status]
  );

  useEffect(() => {
    queueMicrotask(() => fetchApplications());
  }, [fetchApplications]);

  const handleReview = async (applicationId, newStatus) => {
    const action = newStatus === "approved" ? "approve" : "reject";

    try {
      setProcessingId(applicationId);

      await reviewVendorApplication(applicationId, newStatus);

      toast.success(
        newStatus === "approved"
          ? "Vendor application approved!"
          : "Vendor application rejected!"
      );

      await fetchApplications(true);
    } catch (err) {
      toast.error(err.message || `Failed to ${action} application`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRefresh = () => {
    fetchApplications(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
            Vendor Applications
          </h1>

          <p className="mt-2 text-sm text-[#78716c]">
            Review and manage vendor registration requests.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#eaded1] bg-white px-4 py-2.5 text-sm font-semibold text-[#27231f] transition hover:bg-[#f2e8dc] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatus(filter.value)}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              status === filter.value
                ? "bg-[#b83227] text-white"
                : "border border-[#eaded1] bg-white text-[#78716c] hover:bg-[#f2e8dc]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 shrink-0 text-red-600" size={20} />

            <p className="text-sm text-red-700">{error}</p>
          </div>

          <button
            onClick={handleRefresh}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex min-h-60 items-center justify-center">
          <div className="text-center">
            <Loader2
              size={32}
              className="mx-auto animate-spin text-[#b83227]"
            />

            <p className="mt-3 text-sm text-[#78716c]">
              Loading applications...
            </p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && applications.length === 0 && (
        <div className="rounded-2xl border border-[#eaded1] bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f2e8dc]">
            {status === "pending" ? (
              <Clock size={28} className="text-[#b83227]" />
            ) : status === "approved" ? (
              <CheckCircle2 size={28} className="text-green-600" />
            ) : (
              <XCircle size={28} className="text-red-500" />
            )}
          </div>

          <h3 className="mt-4 text-lg font-bold text-[#27231f]">
            No {status} applications
          </h3>

          <p className="mt-2 text-sm text-[#78716c]">
            There are currently no applications in this category.
          </p>
        </div>
      )}

      {/* Applications */}
      {!loading && !error && applications.length > 0 && (
        <div className="grid gap-5">
          {applications.map((application) => {
            const isProcessing = processingId === application._id;

            return (
              <div
                key={application._id}
                className="overflow-hidden rounded-2xl border border-[#eaded1] bg-white shadow-sm"
              >
                {/* Card header */}
                <div className="flex flex-col gap-4 border-b border-[#f2e8dc] p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff0e5]">
                      <Store className="text-[#b83227]" size={24} />
                    </div>

                    <div>
                      <h2 className="text-lg font-bold text-[#27231f]">
                        {application.businessName}
                      </h2>

                      <p className="mt-1 text-sm text-[#78716c]">
                        Submitted{" "}
                        {application.createdAt
                          ? new Date(application.createdAt).toLocaleDateString()
                          : "recently"}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      application.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : application.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {application.status}
                  </span>
                </div>

                {/* Application details */}
                <div className="grid gap-4 p-5 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <User
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b83227]"
                    />

                    <div>
                      <p className="text-xs font-medium text-[#78716c]">
                        Applicant
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#27231f]">
                        {application.name || "Not provided"}
                      </p>

                      <p className="text-sm text-[#78716c]">
                        {application.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b83227]"
                    />

                    <div>
                      <p className="text-xs font-medium text-[#78716c]">
                        Phone
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#27231f]">
                        {application.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#b83227]"
                    />

                    <div>
                      <p className="text-xs font-medium text-[#78716c]">
                        Business Address
                      </p>

                      <p className="mt-1 text-sm text-[#27231f]">
                        {application.address || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-[#78716c]">
                      Business Description
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#57534e]">
                      {application.description || "No description provided"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {application.status === "pending" && (
                  <div className="flex flex-col gap-3 border-t border-[#f2e8dc] bg-[#fffaf5] p-5 sm:flex-row sm:justify-end">
                    <button
                      onClick={() =>
                        handleReview(application._id, "rejected")
                      }
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <XCircle size={16} />
                      )}

                      Reject
                    </button>

                    <button
                      onClick={() =>
                        handleReview(application._id, "approved")
                      }
                      disabled={isProcessing}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isProcessing ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}

                      Approve
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
