"use client";

import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  getAdminTransactionSummary,
  getAdminTransactions,
} from "@/services/admin.service";

const statusStyles = {
  completed: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const formatCurrency = (amount = 0) => {
  return `৳${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)}`;
};

const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AdminTransactions() {
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  const fetchSummary = async () => {
    try {
      const result = await getAdminTransactionSummary();

      setSummary(result.data);
    } catch (error) {
      console.error("Summary error:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminTransactions({
        page,
        limit: 10,
        search,
        status,
      });

      setTransactions(result.data || []);

      setPagination(
        result.pagination || {
          page: 1,
          totalPages: 1,
          total: 0,
        }
      );
    } catch (error) {
      console.error("Transactions error:", error);

      setError(
        error.message || "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => fetchSummary());
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchTransactions());
  }, [page, search, status]);

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  const handleRefresh = () => {
    fetchSummary();
    fetchTransactions();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
            Transactions
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monitor payments and transaction activity.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eaded1] bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-[#fff8ef]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Transactions"
          value={summary?.totalTransactions ?? 0}
          icon={CreditCard}
          iconColor="bg-blue-100 text-blue-600"
        />

        <SummaryCard
          title="Total Revenue"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          icon={TrendingUp}
          iconColor="bg-green-100 text-green-600"
        />

        <SummaryCard
          title="Completed"
          value={summary?.completedTransactions ?? 0}
          icon={CheckCircle2}
          iconColor="bg-emerald-100 text-emerald-600"
        />

        <SummaryCard
          title="Pending"
          value={summary?.pendingTransactions ?? 0}
          icon={Clock}
          iconColor="bg-yellow-100 text-yellow-600"
        />
      </div>

      {/* Failed Summary */}
      <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="rounded-lg bg-red-100 p-2 text-red-600">
          <XCircle size={20} />
        </div>

        <div>
          <p className="text-sm text-red-600">
            Failed Transactions
          </p>

          <p className="text-xl font-bold text-red-700">
            {summary?.failedTransactions ?? 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#eaded1] bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search transaction ID or email..."
            className="w-full rounded-lg border border-[#eaded1] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#b83227]"
          />
        </div>

        <select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="rounded-lg border border-[#eaded1] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#b83227]"
        >
          <option value="all">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-xl border border-[#eaded1] bg-white">
        <div className="border-b border-[#eaded1] p-4">
          <h2 className="font-semibold text-[#27231f]">
            Transaction History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {pagination.total || 0} transactions found
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eaded1] border-t-[#b83227]" />
          </div>
        ) : error ? (
          <div className="p-10 text-center">
            <p className="text-red-600">{error}</p>

            <button
              onClick={fetchTransactions}
              className="mt-4 rounded-lg bg-[#b83227] px-4 py-2 text-sm text-white hover:bg-[#98291f]"
            >
              Try Again
            </button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <CreditCard
              size={40}
              className="mx-auto text-gray-300"
            />

            <p className="mt-3 font-medium text-gray-600">
              No transactions found
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Transactions will appear here when available.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#fff8ef] text-gray-600">
                  <tr>
                    <th className="px-5 py-4 font-medium">
                      Transaction
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Vendor
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Plan
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#eaded1]">
                  {transactions.map((transaction, index) => (
                    <TransactionRow
                      key={
                        transaction._id ||
                        transaction.transactionId ||
                        index
                      }
                      transaction={transaction}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-[#eaded1] md:hidden">
              {transactions.map((transaction, index) => (
                <TransactionMobileCard
                  key={
                    transaction._id ||
                    transaction.transactionId ||
                    index
                  }
                  transaction={transaction}
                />
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading &&
          !error &&
          transactions.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-[#eaded1] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Page {pagination.page || page} of{" "}
                {pagination.totalPages || 1}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-1 rounded-lg border border-[#eaded1] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page >= pagination.totalPages}
                  className="flex items-center gap-1 rounded-lg border border-[#eaded1] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

/* Summary Card */

function SummaryCard({
  title,
  value,
  icon: Icon,
  iconColor,
}) {
  return (
    <div className="rounded-xl border border-[#eaded1] bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <p className="mt-2 text-2xl font-bold text-[#27231f]">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconColor}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

/* Desktop Row */

function TransactionRow({ transaction }) {
  const id =
    transaction.transactionId ||
    transaction._id ||
    transaction.stripeSessionId ||
    "N/A";

  const vendor = transaction.vendorName || "Unknown vendor";

  const plan = transaction.plan || "n/a";

  const status = transaction.status || "unknown";

  return (
    <tr className="transition hover:bg-[#fffaf5]">
      <td className="px-5 py-4">
        <p className="max-w-52 truncate font-medium text-[#27231f]">
          {id}
        </p>
      </td>

      <td className="px-5 py-4 text-gray-600">
        <div className="font-medium text-[#27231f]">
          {vendor}
        </div>

        <div className="text-xs text-gray-500">
          {transaction.vendorEmail || transaction.userEmail || "—"}
        </div>
      </td>

      <td className="px-5 py-4 text-gray-600 capitalize">
        {plan}
      </td>

      <td className="px-5 py-4 font-semibold text-[#27231f]">
        {formatCurrency(
          transaction.amount,
          transaction.currency
        )}
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={status} />
      </td>

      <td className="px-5 py-4 text-gray-500">
        {formatDate(transaction.createdAt)}
      </td>
    </tr>
  );
}

/* Mobile Card */

function TransactionMobileCard({ transaction }) {
  const id =
    transaction.transactionId ||
    transaction._id ||
    transaction.stripeSessionId ||
    "N/A";

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#27231f]">
            {id}
          </p>

          <p className="mt-1 break-all text-xs text-gray-500">
            {transaction.userEmail || "Unknown user"}
          </p>
        </div>

        <StatusBadge status={transaction.status || "unknown"} />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          {formatDate(transaction.createdAt)}
        </p>

        <p className="text-lg font-bold text-[#27231f]">
          {formatCurrency(
            transaction.amount,
            transaction.currency
          )}
        </p>
      </div>
    </div>
  );
}

/* Status Badge */

function StatusBadge({ status }) {
  const normalizedStatus = String(status).toLowerCase();

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
        statusStyles[normalizedStatus] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {normalizedStatus}
    </span>
  );
}