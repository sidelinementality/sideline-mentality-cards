"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function OrdersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(
    searchParams.get("search") ?? "",
  );

  const currentStatus = searchParams.get("status") ?? "all";

  function updateFilters({
    searchValue,
    statusValue,
  }: {
    searchValue?: string;
    statusValue?: string;
  }) {
    const params = new URLSearchParams(searchParams.toString());

    const nextSearch =
      searchValue !== undefined ? searchValue : search;

    const nextStatus =
      statusValue !== undefined ? statusValue : currentStatus;

    if (nextSearch.trim()) {
      params.set("search", nextSearch.trim());
    } else {
      params.delete("search");
    }

    if (nextStatus && nextStatus !== "all") {
      params.set("status", nextStatus);
    } else {
      params.delete("status");
    }

    const queryString = params.toString();

    router.push(
      queryString
        ? `/dashboard/orders?${queryString}`
        : "/dashboard/orders",
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    updateFilters({
      searchValue: search,
    });
  }

  function handleClear() {
    setSearch("");
    router.push("/dashboard/orders");
  }

  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 lg:flex-row lg:items-end"
      >
        <div className="flex-1">
          <label
            htmlFor="order-search"
            className="mb-2 block text-sm font-bold text-neutral-300"
          >
            Search Orders
          </label>

          <input
            id="order-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Customer name, email, or order ID"
            className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-green-500"
          />
        </div>

        <div className="w-full lg:w-56">
          <label
            htmlFor="order-status"
            className="mb-2 block text-sm font-bold text-neutral-300"
          >
            Fulfillment Status
          </label>

          <select
            id="order-status"
            value={currentStatus}
            onChange={(event) =>
              updateFilters({
                statusValue: event.target.value,
              })
            }
            className="w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-white outline-none transition focus:border-green-500"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-green-500 px-6 py-3 font-black text-black transition hover:bg-green-400"
        >
          Search
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="rounded-xl border border-white/15 px-6 py-3 font-bold text-white transition hover:bg-white/10"
        >
          Clear
        </button>
      </form>
    </section>
  );
}