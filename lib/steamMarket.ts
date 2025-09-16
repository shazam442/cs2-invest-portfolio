// Lightweight Steam Market client for fetching item prices
// Uses Vite dev proxy (see vite.config.ts) to avoid CORS in development

export type SteamCurrencyCode = 1 | 2 | 3 | 5 | 7 | 8 | 9 | 10 | 12 | 13 | 14 | 15 | 16 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 27 | 28 | 29 | 30 | 31 | 32 | 34 | 35 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 50 | 51 | 52 | 53 | 54 | 55 | 56 | 57 | 58 | 60 | 61 | 62 | 63 | 64 | 65 | 66 | 67 | 68 | 69 | 70 | 71 | 72 | 73 | 74 | 75 | 76 | 77 | 78 | 79 | 80 | 81 | 82 | 83 | 84 | 85 | 86 | 87 | 88 | 89 | 90 | 91 | 92 | 93 | 94 | 95 | 96 | 97 | 98 | 99 | 100 | 101 | 102 | 103 | 104 | 105 | 106 | 107 | 108 | 110 | 111 | 112 | 113 | 114 | 115 | 116 | 117 | 118 | 119 | 120 | 121 | 122 | 123 | 124 | 125 | 126 | 127 | 128 | 129 | 130 | 131 | 132 | 133 | 134 | 135 | 136 | 137 | 138 | 139 | 140 | 141 | 2001;

export interface PriceOverviewResponse {
  success: boolean;
  lowest_price?: string;
  volume?: string;
  median_price?: string;
}

export interface ItemPriceResult {
  success: boolean;
  lowestPrice: number | null; // numeric in selected currency
  medianPrice: number | null; // numeric in selected currency
  raw: PriceOverviewResponse;
}

const DEFAULT_APP_ID = 730; // CS2
const DEFAULT_CURRENCY: SteamCurrencyCode = 3; // EUR

function parseSteamPriceString(input?: string | null): number | null {
  if (!input) return null;
  // Strip currency symbols and non-numeric (keep digits, comma, dot)
  const cleaned = input.replace(/[^0-9.,-]/g, "");
  // Heuristic: if both comma and dot exist, assume dot is thousand sep and comma is decimal
  let normalized = cleaned;
  if (cleaned.includes(",") && cleaned.includes(".")) {
    normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");
  } else if (cleaned.includes(",") && !cleaned.includes(".")) {
    // Only comma present → treat comma as decimal separator
    normalized = cleaned.replace(/,/g, ".");
  }
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : null;
}

export interface GetItemPriceOptions {
  appId?: number;
  currency?: SteamCurrencyCode;
  signal?: AbortSignal;
  retries?: number; // retry on 429/5xx/network errors
  baseDelayMs?: number; // base backoff delay
  maxDelayMs?: number; // max backoff delay
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function backoffDelay(attempt: number, baseMs: number, maxMs: number): number {
  // Exponential backoff with jitter (full jitter)
  const exp = Math.min(maxMs, baseMs * 2 ** (attempt - 1));
  return Math.floor(Math.random() * exp);
}

export async function getItemPrice(
  marketHashName: string,
  options?: GetItemPriceOptions
): Promise<ItemPriceResult> {
  const appId = options?.appId ?? DEFAULT_APP_ID;
  const currency = options?.currency ?? DEFAULT_CURRENCY;
  const retries = options?.retries ?? 3;
  const baseDelayMs = options?.baseDelayMs ?? 800;
  const maxDelayMs = options?.maxDelayMs ?? 5000;

  const endpoint = `/steam/market/priceoverview/?appid=${encodeURIComponent(
    String(appId)
  )}&currency=${encodeURIComponent(String(currency))}&market_hash_name=${encodeURIComponent(
    marketHashName
  )}`;

  let attempt = 0;
  for (;;) {
    try {
      const response = await fetch(endpoint, { method: "GET", signal: options?.signal });
      if (!response.ok) {
        // Retry on rate limit or server errors
        if ((response.status === 429 || response.status >= 500) && attempt < retries) {
          attempt += 1;
          await sleep(backoffDelay(attempt, baseDelayMs, maxDelayMs));
          continue;
        }
        return { success: false, lowestPrice: null, medianPrice: null, raw: { success: false } };
      }
      const data = (await response.json()) as PriceOverviewResponse;
      return {
        success: data.success === true,
        lowestPrice: parseSteamPriceString(data.lowest_price),
        medianPrice: parseSteamPriceString(data.median_price),
        raw: data,
      };
    } catch (_err) {
      if (attempt < retries) {
        attempt += 1;
        await sleep(backoffDelay(attempt, baseDelayMs, maxDelayMs));
        continue;
      }
      return { success: false, lowestPrice: null, medianPrice: null, raw: { success: false } };
    }
  }
}

export default {
  getItemPrice,
  getItemUrl,
};

/**
 * Build the public Steam Market listing URL for a given item.
 * Example: https://steamcommunity.com/market/listings/730/Operation%20Bravo%20Case
 */
export function getItemUrl(
  marketHashName: string,
  options?: { appId?: number }
): string {
  const appId = options?.appId ?? DEFAULT_APP_ID;
  return `https://steamcommunity.com/market/listings/${encodeURIComponent(
    String(appId)
  )}/${encodeURIComponent(marketHashName)}`;
}

