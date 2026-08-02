type StorageMapCard = {
    id: string;
    playerName: string;
    stock: number;
    storageArea: string | null;
    cabinet: string | null;
    shelf: string | null;
    box: string | null;
  };
  
  type StorageMapProps = {
    cards: StorageMapCard[];
  };
  
  type BoxGroup = {
    boxName: string;
    listings: number;
    quantity: number;
  };
  
  type ShelfGroup = {
    shelfName: string;
    boxes: BoxGroup[];
    listings: number;
    quantity: number;
  };
  
  type CabinetGroup = {
    cabinetName: string;
    shelves: ShelfGroup[];
    listings: number;
    quantity: number;
  };
  
  type AreaGroup = {
    areaName: string;
    cabinets: CabinetGroup[];
    listings: number;
    quantity: number;
  };
  
  export default function StorageMap({ cards }: StorageMapProps) {
    const assignedCards = cards.filter(
      (card) =>
        card.storageArea ||
        card.cabinet ||
        card.shelf ||
        card.box,
    );
  
    const storageAreas = createStorageMap(assignedCards);
  
    return (
      <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-6 py-6 sm:px-8">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-green-400">
            Visual Storage
          </p>
  
          <h2 className="mt-2 text-2xl font-black text-white sm:text-3xl">
            Storage Map
          </h2>
  
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Browse your inventory by storage area, cabinet, shelf, and box.
          </p>
        </div>
  
        {storageAreas.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-xl font-black text-white">
              No mapped storage locations
            </h3>
  
            <p className="mt-2 text-zinc-400">
              Add a storage area, cabinet, shelf, or box to a card to begin
              building the visual map.
            </p>
          </div>
        ) : (
          <div className="space-y-8 p-6 sm:p-8">
            {storageAreas.map((area) => (
              <StorageAreaPanel key={area.areaName} area={area} />
            ))}
          </div>
        )}
      </section>
    );
  }
  
  function StorageAreaPanel({ area }: { area: AreaGroup }) {
    return (
      <section className="overflow-hidden rounded-3xl border border-green-500/20 bg-green-500/[0.04]">
        <div className="border-b border-green-500/15 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">
                Storage Area
              </p>
  
              <h3 className="mt-2 text-2xl font-black text-white">
                {area.areaName}
              </h3>
            </div>
  
            <div className="flex flex-wrap gap-3">
              <CountBadge label="Listings" value={area.listings} />
              <CountBadge label="Quantity" value={area.quantity} />
              <CountBadge
                label="Cabinets"
                value={area.cabinets.length}
              />
            </div>
          </div>
        </div>
  
        <div className="space-y-6 p-5 sm:p-6">
          {area.cabinets.map((cabinet) => (
            <CabinetPanel
              key={`${area.areaName}-${cabinet.cabinetName}`}
              cabinet={cabinet}
            />
          ))}
        </div>
      </section>
    );
  }
  
  function CabinetPanel({
    cabinet,
  }: {
    cabinet: CabinetGroup;
  }) {
    return (
      <section className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
              Cabinet
            </p>
  
            <h4 className="mt-1 text-xl font-black text-white">
              {cabinet.cabinetName}
            </h4>
          </div>
  
          <p className="text-sm font-semibold text-zinc-400">
            {cabinet.listings} listings · {cabinet.quantity} cards
          </p>
        </div>
  
        <div className="mt-5 space-y-5">
          {cabinet.shelves.map((shelf) => (
            <ShelfPanel
              key={`${cabinet.cabinetName}-${shelf.shelfName}`}
              shelf={shelf}
            />
          ))}
        </div>
      </section>
    );
  }
  
  function ShelfPanel({ shelf }: { shelf: ShelfGroup }) {
    return (
      <div>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="font-black text-white">
            {shelf.shelfName}
          </h5>
  
          <p className="text-xs font-semibold text-zinc-500">
            {shelf.listings} listings · {shelf.quantity} cards
          </p>
        </div>
  
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shelf.boxes.map((box) => (
            <BoxCard
              key={`${shelf.shelfName}-${box.boxName}`}
              box={box}
            />
          ))}
        </div>
      </div>
    );
  }
  
  function BoxCard({ box }: { box: BoxGroup }) {
    const capacityStatus = getCapacityStatus(box.quantity);
  
    return (
      <div
        className={`rounded-2xl border p-4 transition hover:-translate-y-0.5 ${capacityStatus.container}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-zinc-500">
              Box
            </p>
  
            <p className="mt-1 font-black text-white">
              {box.boxName}
            </p>
          </div>
  
          <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wide ${capacityStatus.badge}`}
          >
            {capacityStatus.label}
          </span>
        </div>
  
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-zinc-500">Listings</p>
            <p className="mt-1 text-xl font-black text-white">
              {box.listings}
            </p>
          </div>
  
          <div className="rounded-xl bg-black/20 p-3">
            <p className="text-xs text-zinc-500">Cards</p>
            <p className="mt-1 text-xl font-black text-white">
              {box.quantity}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  function CountBadge({
    label,
    value,
  }: {
    label: string;
    value: number;
  }) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-zinc-500">
          {label}
        </p>
  
        <p className="mt-1 text-lg font-black text-white">
          {value}
        </p>
      </div>
    );
  }
  
  function createStorageMap(
    cards: StorageMapCard[],
  ): AreaGroup[] {
    const areas = new Map<
      string,
      Map<string, Map<string, Map<string, StorageMapCard[]>>>
    >();
  
    cards.forEach((card) => {
      const areaName = card.storageArea?.trim() || "Unassigned Area";
      const cabinetName = card.cabinet?.trim() || "No Cabinet";
      const shelfName = card.shelf?.trim() || "No Shelf";
      const boxName = card.box?.trim() || "No Box";
  
      if (!areas.has(areaName)) {
        areas.set(areaName, new Map());
      }
  
      const cabinets = areas.get(areaName)!;
  
      if (!cabinets.has(cabinetName)) {
        cabinets.set(cabinetName, new Map());
      }
  
      const shelves = cabinets.get(cabinetName)!;
  
      if (!shelves.has(shelfName)) {
        shelves.set(shelfName, new Map());
      }
  
      const boxes = shelves.get(shelfName)!;
      const currentCards = boxes.get(boxName) ?? [];
  
      boxes.set(boxName, [...currentCards, card]);
    });
  
    return Array.from(areas.entries())
      .map(([areaName, cabinets]) => {
        const cabinetGroups = Array.from(cabinets.entries())
          .map(([cabinetName, shelves]) => {
            const shelfGroups = Array.from(shelves.entries())
              .map(([shelfName, boxes]) => {
                const boxGroups = Array.from(boxes.entries())
                  .map(([boxName, boxCards]) => ({
                    boxName,
                    listings: boxCards.length,
                    quantity: boxCards.reduce(
                      (total, card) => total + card.stock,
                      0,
                    ),
                  }))
                  .sort((a, b) =>
                    a.boxName.localeCompare(b.boxName),
                  );
  
                return {
                  shelfName,
                  boxes: boxGroups,
                  listings: boxGroups.reduce(
                    (total, box) => total + box.listings,
                    0,
                  ),
                  quantity: boxGroups.reduce(
                    (total, box) => total + box.quantity,
                    0,
                  ),
                };
              })
              .sort((a, b) =>
                a.shelfName.localeCompare(b.shelfName),
              );
  
            return {
              cabinetName,
              shelves: shelfGroups,
              listings: shelfGroups.reduce(
                (total, shelf) => total + shelf.listings,
                0,
              ),
              quantity: shelfGroups.reduce(
                (total, shelf) => total + shelf.quantity,
                0,
              ),
            };
          })
          .sort((a, b) =>
            a.cabinetName.localeCompare(b.cabinetName),
          );
  
        return {
          areaName,
          cabinets: cabinetGroups,
          listings: cabinetGroups.reduce(
            (total, cabinet) => total + cabinet.listings,
            0,
          ),
          quantity: cabinetGroups.reduce(
            (total, cabinet) => total + cabinet.quantity,
            0,
          ),
        };
      })
      .sort((a, b) => a.areaName.localeCompare(b.areaName));
  }
  
  function getCapacityStatus(quantity: number) {
    if (quantity === 0) {
      return {
        label: "Empty",
        container:
          "border-zinc-500/20 bg-zinc-500/[0.05]",
        badge:
          "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
      };
    }
  
    if (quantity >= 100) {
      return {
        label: "Full",
        container:
          "border-red-500/30 bg-red-500/[0.06]",
        badge:
          "border-red-500/30 bg-red-500/10 text-red-300",
      };
    }
  
    if (quantity >= 75) {
      return {
        label: "Nearly Full",
        container:
          "border-amber-500/30 bg-amber-500/[0.06]",
        badge:
          "border-amber-500/30 bg-amber-500/10 text-amber-300",
      };
    }
  
    return {
      label: "Available",
      container:
        "border-green-500/20 bg-green-500/[0.04]",
      badge:
        "border-green-500/30 bg-green-500/10 text-green-300",
    };
  }