"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

import { getAdminMonthlyAnalytics } from "@/services/admin.service";
import { RefreshCw, TrendingUp, CreditCard } from "lucide-react";

export default function AdminAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getAdminMonthlyAnalytics();

      setData(result.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    queueMicrotask(() => fetchAnalytics());
  }, []);

  const totalRevenue = data.reduce(
    (total, item) => total + (item.revenue || 0),
    0
  );

  const totalTransactions = data.reduce(
    (total, item) => total + (item.transactions || 0),
    0
  );

  const averageRevenue =
    totalTransactions > 0
      ? totalRevenue / totalTransactions
      : 0;

  const formatCurrency = (value) =>
    `৳${new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(value || 0)}`;

  if (loading) {
    return (
      <div className="flex min-h-80 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#eaded1] border-t-[#b83227]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#27231f] sm:text-3xl">
            Sales Analytics
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Monthly revenue and payment performance.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#eaded1] bg-white px-4 py-2.5 text-sm hover:bg-[#fff8ef]"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnalyticsCard
          title="6-Month Revenue"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          color="text-green-600"
          bg="bg-green-100"
        />

        <AnalyticsCard
          title="Total Transactions"
          value={totalTransactions.toLocaleString()}
          icon={CreditCard}
          color="text-blue-600"
          bg="bg-blue-100"
        />

        <AnalyticsCard
          title="Average Transaction"
          value={formatCurrency(averageRevenue)}
          icon={TrendingUp}
          color="text-orange-600"
          bg="bg-orange-100"
        />
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-[#eaded1] bg-white p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#27231f]">
            Monthly Revenue
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Completed transaction revenue over the last six months
          </p>
        </div>

        {data.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-72 w-full sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  tick={{ fontSize: 12 }}
                  width={60}
                />

                <Tooltip
                  formatter={(value) => [
                    formatCurrency(value),
                    "Revenue",
                  ]}
                />

                <Bar
                  dataKey="revenue"
                  fill="#b83227"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Transaction Chart */}
      <div className="rounded-xl border border-[#eaded1] bg-white p-4 sm:p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-[#27231f]">
            Transaction Trend
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Completed transactions per month
          </p>
        </div>

        {data.length === 0 ? (
          <EmptyChart />
        ) : (
          <div className="h-72 w-full sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12 }}
                />

                <Tooltip
                  formatter={(value) => [
                    value,
                    "Transactions",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#e77a3c"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Monthly Breakdown */}
      <div className="overflow-hidden rounded-xl border border-[#eaded1] bg-white">
        <div className="border-b border-[#eaded1] p-4">
          <h2 className="font-semibold text-[#27231f]">
            Monthly Breakdown
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#fff8ef]">
              <tr>
                <th className="px-4 py-3 font-medium">
                  Month
                </th>

                <th className="px-4 py-3 font-medium">
                  Transactions
                </th>

                <th className="px-4 py-3 font-medium">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#eaded1]">
              {data.map((item, index) => (
                <tr
                  key={`${item.year}-${item.month}-${index}`}
                  className="hover:bg-[#fffaf5]"
                >
                  <td className="px-4 py-4 font-medium">
                    {item.month} {item.year}
                  </td>

                  <td className="px-4 py-4">
                    {item.transactions}
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {formatCurrency(item.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AnalyticsCard({
  title,
  value,
  icon: Icon,
  color,
  bg,
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

        <div className={`rounded-xl p-3 ${bg} ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-72 flex-col items-center justify-center text-center">
      <TrendingUp size={40} className="text-gray-300" />

      <p className="mt-3 font-medium text-gray-500">
        No analytics data available
      </p>

      <p className="mt-1 text-sm text-gray-400">
        Completed transactions will appear here.
      </p>
    </div>
  );
}