export default function BrowseLoading() {
  return (
    <main className="min-h-screen">
      <section className="animate-pulse bg-[#f2e8dc] py-16">
        <div className="container-custom">
          <div className="h-4 w-32 rounded bg-[#dfcbbb]" />

          <div className="mt-5 h-10 max-w-lg rounded bg-[#dfcbbb]" />

          <div className="mt-4 h-4 max-w-2xl rounded bg-[#dfcbbb]" />
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-8 h-12 rounded-xl bg-[#eaded1] animate-pulse" />

          <div className="mb-8 flex gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-10 w-24 rounded-full bg-[#eaded1] animate-pulse"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white"
              >
                <div className="h-56 animate-pulse bg-[#eaded1]" />
                <div className="space-y-3 p-5">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-[#eaded1]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#eaded1]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#eaded1]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}