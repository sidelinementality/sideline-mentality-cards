type PricingSectionProps = {
    purchasePrice: string;
    shippingCost: string;
    salesTax: string;
    purchaseFees: string;
    quantity: string;
    marketValue: string;
    websitePrice: string;
    minimumPrice: string;
    onMarketValueChange: (value: string) => void;
    onWebsitePriceChange: (value: string) => void;
    onMinimumPriceChange: (value: string) => void;
  };
  
  export default function PricingSection({
    purchasePrice,
    shippingCost,
    salesTax,
    purchaseFees,
    quantity,
    marketValue,
    websitePrice,
    minimumPrice,
    onMarketValueChange,
    onWebsitePriceChange,
    onMinimumPriceChange,
  }: PricingSectionProps) {
    const totalPurchaseCost =
      Number(purchasePrice || 0) +
      Number(shippingCost || 0) +
      Number(salesTax || 0) +
      Number(purchaseFees || 0);
  
    const quantityNumber = Math.max(Number(quantity || 1), 1);
    const costPerCard = totalPurchaseCost / quantityNumber;
    const listingPrice = Number(websitePrice || 0);
    const projectedProfit = listingPrice - costPerCard;
  
    const projectedRoi =
      costPerCard > 0 ? (projectedProfit / costPerCard) * 100 : 0;
  
    const margin =
      listingPrice > 0 ? (projectedProfit / listingPrice) * 100 : 0;
  
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
            Step 4
          </p>
  
          <h2 className="mt-2 text-3xl font-black text-white">
            Pricing
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Set your market estimate, website price, and minimum acceptable
            price.
          </p>
        </div>
  
        <div className="grid gap-6 md:grid-cols-3">
          <CurrencyField
            id="marketValue"
            label="Estimated Market Value"
            value={marketValue}
            onChange={onMarketValueChange}
            placeholder="250.00"
          />
  
          <CurrencyField
            id="websitePrice"
            label="Website Price"
            value={websitePrice}
            onChange={onWebsitePriceChange}
            placeholder="274.99"
            required
          />
  
          <CurrencyField
            id="minimumPrice"
            label="Minimum Acceptable Price"
            value={minimumPrice}
            onChange={onMinimumPriceChange}
            placeholder="225.00"
          />
        </div>
  
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <PricingSummaryCard
            label="Cost Per Card"
            value={formatCurrency(costPerCard)}
          />
  
          <PricingSummaryCard
            label="Projected Profit"
            value={formatCurrency(projectedProfit)}
            positive={projectedProfit >= 0}
          />
  
          <PricingSummaryCard
            label="Projected ROI"
            value={formatPercent(projectedRoi)}
            positive={projectedRoi >= 0}
          />
  
          <PricingSummaryCard
            label="Profit Margin"
            value={formatPercent(margin)}
            positive={margin >= 0}
          />
        </div>
  
        {listingPrice > 0 && listingPrice < costPerCard && (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
            <p className="font-bold text-red-300">
              Warning: the website price is below your calculated cost per card.
            </p>
          </div>
        )}
  
        {Number(minimumPrice || 0) > listingPrice && listingPrice > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
            <p className="font-bold text-amber-300">
              The minimum acceptable price is higher than the website price.
            </p>
          </div>
        )}
      </section>
    );
  }
  
  type CurrencyFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    required?: boolean;
  };
  
  function CurrencyField({
    id,
    label,
    value,
    onChange,
    placeholder,
    required = false,
  }: CurrencyFieldProps) {
    return (
      <div>
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-semibold text-white"
        >
          {label}
        </label>
  
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-zinc-500">
            $
          </span>
  
          <input
            id={id}
            name={id}
            type="number"
            min="0"
            step="0.01"
            required={required}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-8 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
          />
        </div>
      </div>
    );
  }
  
  type PricingSummaryCardProps = {
    label: string;
    value: string;
    positive?: boolean;
  };
  
  function PricingSummaryCard({
    label,
    value,
    positive = true,
  }: PricingSummaryCardProps) {
    return (
      <div
        className={`rounded-2xl border p-5 ${
          positive
            ? "border-green-500/20 bg-green-500/10"
            : "border-red-500/20 bg-red-500/10"
        }`}
      >
        <p
          className={`text-xs font-bold uppercase tracking-[0.2em] ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {label}
        </p>
  
        <p className="mt-2 text-2xl font-black text-white">{value}</p>
      </div>
    );
  }
  
  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number.isFinite(value) ? value : 0);
  }
  
  function formatPercent(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      maximumFractionDigits: 1,
    }).format(Number.isFinite(value) ? value / 100 : 0);
  }