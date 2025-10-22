/**
 * Product
 * --------
 * Describes the shape of a product entity as returned by the FakeStore API.
 *
 * Notes:
 * - Fields like `category` and `rating` may be missing or undefined,
 *   depending on the API response.
 * - Used throughout the app (Redux state, screens, and components)
 *   as the canonical type for product data.
 */
export interface Product {
  /** Unique numeric identifier for the product. */
  id: number;

  /** Product title or name displayed in lists and details. */
  title: string;

  /** Price in USD. Formatted on display with two decimal places. */
  price: number;

  /** Longer text describing the product. */
  description: string;

  /** Optional product category (e.g. "electronics", "clothing"). */
  category?: string;

  /** URL to the product image (remote). */
  image: string;

  /** Optional nested object describing rating metrics. */
  rating?: {
    /** Average rating score (0–5). */
    rate: number;
    /** Total number of user ratings. */
    count: number;
  };
}
