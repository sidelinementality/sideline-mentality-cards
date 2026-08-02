type PurchaseSectionProps = {
    purchasePrice: string;
    shippingCost: string;
    salesTax: string;
    purchaseFees: string;
    quantity: string;
    onPurchasePriceChange: (value: string) => void;
    onShippingCostChange: (value: string) => void;
    onSalesTaxChange: (value: string) => void;
    onPurchaseFeesChange: (value: string) => void;
    onQuantityChange: (value: string) => void;
  };
  
  export default function PurchaseSection({
    purchasePrice,
    shippingCost,
    salesTax,
    purchaseFees,
    quantity,
    onPurchasePriceChange,
    onShippingCostChange,
    onSalesTaxChange,
    onPurchaseFeesChange,
    onQuantityChange,
  }: PurchaseSectionProps) {
    const totalCost =
      Number(purchasePrice || 0) +
      Number(shippingCost || 0) +
      Number(salesTax || 0) +
      Number(purchaseFees || 0);
  
    const costPerCard =
      Number(quantity || 0) > 0 ? totalCost / Number(quantity) : totalCost;
  
    return (
      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-green-500">
            Step 3
          </p>
  
          <h2 className="mt-2 text-3xl font-black text-white">
            Purchase Details
          </h2>
  
          <p className="mt-2 text-zinc-400">
            Record what you paid so Dealer OS can calculate the true cost and
            potential profit.
          </p>
        </div>
  
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="purchaseDate"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Purchase Date
            </label>
  
            <input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
            />
          </div>
  
          <div>
            <label
              htmlFor="purchaseSource"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Purchase Source
            </label>
  
            <select
              id="purchaseSource"
              name="purchaseSource"
              defaultValue=""
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
            >
              <option value="">Select source</option>
              <option value="Card Show">Card Show</option>
              <option value="eBay">eBay</option>
              <option value="Facebook Marketplace">
                Facebook Marketplace
              </option>
              <option value="Whatnot">Whatnot</option>
              <option value="Local Collection">Local Collection</option>
              <option value="Online Store">Online Store</option>
              <option value="Break">Break</option>
              <option value="Trade">Trade</option>
              <option value="Personal Collection">Personal Collection</option>
              <option value="Other">Other</option>
            </select>
          </div>
  
          <div>
            <label
              htmlFor="seller"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Seller or Vendor
            </label>
  
            <input
              id="seller"
              name="seller"
              type="text"
              placeholder="Example: Midwest Sports Cards"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
          </div>
  
          <div>
            <label
              htmlFor="purchaseSession"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Purchase Session
            </label>
  
            <input
              id="purchaseSession"
              name="purchaseSession"
              type="text"
              placeholder="Example: KC Card Show - August 2026"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-green-500"
            />
  
            <p className="mt-2 text-xs text-zinc-500">
              This will become a searchable purchase-session selector later.
            </p>
          </div>
  
          <CurrencyField
            id="purchasePrice"
            label="Purchase Price"
            value={purchasePrice}
            onChange={onPurchasePriceChange}
            required
          />
  
          <CurrencyField
            id="shippingCost"
            label="Shipping Cost"
            value={shippingCost}
            onChange={onShippingCostChange}
          />
  
          <CurrencyField
            id="salesTax"
            label="Sales Tax"
            value={salesTax}
            onChange={onSalesTaxChange}
          />
  
          <CurrencyField
            id="purchaseFees"
            label="Purchase Fees"
            value={purchaseFees}
            onChange={onPurchaseFeesChange}
          />
  
          <div>
            <label
              htmlFor="quantity"
              className="mb-2 block text-sm font-semibold text-white"
            >
              Quantity
            </label>
  
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              step="1"
              required
              value={quantity}
              onChange={(event) => onQuantityChange(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-green-500"
            />
          </div>
        </div>
  
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <SummaryCard
            label="Total Purchase Cost"
            value={formatCurrency(totalCost)}
          />
  
          <SummaryCard
            label="Cost Per Card"
            value={formatCurrency(costPerCard)}
          />
        </div>
      </section>
    );
  }
  
  type CurrencyFieldProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
  };
  
  function CurrencyField({
    id,
    label,
    value,
    onChange,
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
            className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-8 pr-4 text-white outline-none transition focus:border-green-500"
          />
        </div>
      </div>
    );
  }
  
  type SummaryCardProps = {
    label: string;
    value: string;
  };
  
  function SummaryCard({ label, value }: SummaryCardProps) {
    return (
      <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-400">
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