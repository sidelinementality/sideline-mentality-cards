type InventoryCard = {
    player_name: string | null;
    stock: number | null;
  };
  
  export type InventoryQuantityMap = Map<string, number>;
  
  export function normalizeTargetName(
    value: string | null | undefined,
  ) {
    return (value ?? "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }
  
  export function createInventoryQuantityMap(
    cards: InventoryCard[],
  ): InventoryQuantityMap {
    const quantityMap = new Map<string, number>();
  
    cards.forEach((card) => {
      const normalizedName = normalizeTargetName(
        card.player_name,
      );
  
      if (!normalizedName) {
        return;
      }
  
      const stock = Number(card.stock ?? 0);
  
      if (!Number.isFinite(stock) || stock <= 0) {
        return;
      }
  
      const existingQuantity =
        quantityMap.get(normalizedName) ?? 0;
  
      quantityMap.set(
        normalizedName,
        existingQuantity + stock,
      );
    });
  
    return quantityMap;
  }
  
  export function getOwnedQuantity(
    playerName: string,
    quantityMap: InventoryQuantityMap,
  ) {
    return quantityMap.get(
      normalizeTargetName(playerName),
    ) ?? 0;
  }