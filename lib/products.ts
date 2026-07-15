export type ProductKey =
  | "beginner"
  | "workshop"
  | "bootcamp"
  | "membership";

export type BookableProductKey = Exclude<ProductKey, "membership">;

export type ProductConfig = {
  key: ProductKey;
  name: string;
  shortName: string;
  displayPrice: string;
  expectedAmount: number;
  currency: "usd";
  duration: string;
  delivery: string;
  mode: "payment" | "subscription";
  priceEnvironmentVariables: readonly [string, string];
};

export const products: Record<ProductKey, ProductConfig> = {
  beginner: {
    key: "beginner",
    name: "AI Clarity Beginner Session",
    shortName: "Beginner Session",
    displayPrice: "$49",
    expectedAmount: 4_900,
    currency: "usd",
    duration: "2 hours",
    delivery: "Online or an agreed local venue",
    mode: "payment",
    priceEnvironmentVariables: [
      "STRIPE_BEGINNER_PRICE_ID",
      "NEXT_PUBLIC_BEGINNER_PRICE_ID",
    ],
  },
  workshop: {
    key: "workshop",
    name: "AI Practical Workshop",
    shortName: "Practical Workshop",
    displayPrice: "$99",
    expectedAmount: 9_900,
    currency: "usd",
    duration: "Half day",
    delivery: "Online or an agreed local venue",
    mode: "payment",
    priceEnvironmentVariables: [
      "STRIPE_WORKSHOP_PRICE_ID",
      "NEXT_PUBLIC_WORKSHOP_PRICE_ID",
    ],
  },
  bootcamp: {
    key: "bootcamp",
    name: "AI Clarity Bootcamp",
    shortName: "AI Clarity Bootcamp",
    displayPrice: "$199",
    expectedAmount: 19_900,
    currency: "usd",
    duration: "Full day",
    delivery: "Online or an agreed local venue",
    mode: "payment",
    priceEnvironmentVariables: [
      "STRIPE_BOOTCAMP_PRICE_ID",
      "NEXT_PUBLIC_BOOTCAMP_PRICE_ID",
    ],
  },
  membership: {
    key: "membership",
    name: "AI Clarity Daily Access Membership",
    shortName: "Daily Access Membership",
    displayPrice: "$0.90/month",
    expectedAmount: 90,
    currency: "usd",
    duration: "Monthly",
    delivery: "Online",
    mode: "subscription",
    priceEnvironmentVariables: [
      "STRIPE_MEMBERSHIP_PRICE_ID",
      "NEXT_PUBLIC_MEMBERSHIP_PRICE_ID",
    ],
  },
};

export function isProductKey(value: unknown): value is ProductKey {
  return typeof value === "string" && value in products;
}

export function isBookableProductKey(
  value: unknown,
): value is BookableProductKey {
  return (
    isProductKey(value) &&
    value !== "membership"
  );
}

export function getStripePriceId(product: ProductConfig): string | null {
  for (const variableName of product.priceEnvironmentVariables) {
    const value = process.env[variableName];

    if (value?.startsWith("price_")) {
      return value;
    }
  }

  return null;
}
