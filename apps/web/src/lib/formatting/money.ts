export const fmtUSD = (n: number | string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(
    typeof n === "string" ? Number(n) : n
  );
