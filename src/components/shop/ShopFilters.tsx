"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function ShopFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }

    router.push(`/shop?${params.toString()}`);
  }

  return (
    <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 md:grid-cols-4">
      <select
        className="rounded-lg bg-neutral-900 p-3"
        defaultValue={searchParams.get("grade") ?? ""}
        onChange={(e) =>
          updateParam("grade", e.target.value)
        }
      >
        <option value="">All Grades</option>
        <option>PSA</option>
        <option>BGS</option>
        <option>SGC</option>
        <option>RAW</option>
      </select>

      <select
        className="rounded-lg bg-neutral-900 p-3"
        defaultValue={searchParams.get("rookie") ?? ""}
        onChange={(e) =>
          updateParam("rookie", e.target.value)
        }
      >
        <option value="">All Cards</option>
        <option value="true">Rookie Cards</option>
      </select>

      <select
        className="rounded-lg bg-neutral-900 p-3"
        defaultValue={searchParams.get("auto") ?? ""}
        onChange={(e) =>
          updateParam("auto", e.target.value)
        }
      >
        <option value="">All Cards</option>
        <option value="true">Autographs</option>
      </select>

      <select
        className="rounded-lg bg-neutral-900 p-3"
        defaultValue={searchParams.get("sort") ?? ""}
        onChange={(e) =>
          updateParam("sort", e.target.value)
        }
      >
        <option value="">Newest</option>
        <option value="price-low">
          Price: Low → High
        </option>
        <option value="price-high">
          Price: High → Low
        </option>
      </select>
    </div>
  );
}