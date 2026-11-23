export default function OrderTimeline({ status }) {
  const steps = [
    { key: "pending", label: "Order placed", hint: "We got your order" },
    { key: "accepted", label: "Accepted", hint: "The pizzeria is on it" },
    { key: "preparing", label: "Preparing", hint: "Fresh from the oven" },
    { key: "ready", label: "Ready", hint: "Packed and on the way" },
    { key: "delivered", label: "Delivered", hint: "Enjoy your pizza!" },
  ];

  const current = String(status || "pending").toLowerCase();

  const currentIndex =
    current === "cancelled" || current === "rejected"
      ? 0
      : steps.findIndex((step) => step.key === current);

  const isProblem =
    current === "cancelled" || current === "rejected";

  return (
    <div className="mt-4 border-t border-[#efe7dd] pt-4">
      <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a8f84]">
        {isProblem
          ? current === "cancelled"
            ? "Order cancelled"
            : "Order rejected"
          : "Order status"}
      </p>

      <div className="space-y-0">
        {steps.map((step, index) => {
          const done = !isProblem && index <= currentIndex;
          const active = !isProblem && index === currentIndex;

          return (
            <div key={step.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                    done
                      ? "border-[#b83227] bg-[#b83227] text-white"
                      : "border-[#e3d7c8] bg-white"
                  }`}
                >
                  {done && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`h-6 w-0.5 ${
                      !isProblem && index < currentIndex
                        ? "bg-[#b83227]"
                        : "bg-[#e3d7c8]"
                    }`}
                  />
                )}
              </div>

              <div className="pb-3">
                <p
                  className={`text-[11px] font-semibold ${
                    active
                      ? "text-[#b83227]"
                      : done
                      ? "text-[#332c27]"
                      : "text-[#b4a89c]"
                  }`}
                >
                  {step.label}
                </p>

                <p className="text-[9px] text-[#9a8f84]">
                  {step.hint}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}