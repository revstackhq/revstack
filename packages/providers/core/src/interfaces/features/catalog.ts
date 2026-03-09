import { ProviderContext } from "@/context";
import {
  Product,
  Price,
  GetProductInput,
  ListProductsOptions,
  UpdateProductInput,
  DeleteProductInput,
  GetPriceInput,
  ListPricesOptions,
  CreateProductInput,
  CreatePriceInput,
} from "@/types/catalog";
import { AsyncActionResult, PaginatedResult } from "@/types/shared";

/**
 * Interface for Product & Price Catalog Management.
 *
 * Required for providers with `catalog.strategy: "pre_created"`.
 * For `inline` providers (e.g., Stripe), these are optional convenience methods.
 */
export interface ICatalogFeature {
  /**
   * Creates a product in the provider's catalog.
   */
  createProduct?(
    ctx: ProviderContext,
    input: CreateProductInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Retrieves a product by its external ID.
   */
  getProduct?(
    ctx: ProviderContext,
    input: GetProductInput,
  ): Promise<AsyncActionResult<Product>>;

  /**
   * Lists products with pagination.
   */
  listProducts?(
    ctx: ProviderContext,
    options: ListProductsOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Product>>>;

  /**
   * Updates an existing product.
   */
  updateProduct?(
    ctx: ProviderContext,
    input: UpdateProductInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Deletes (deactivates) a product.
   */
  deleteProduct?(
    ctx: ProviderContext,
    input: DeleteProductInput,
  ): Promise<AsyncActionResult<boolean>>;

  /**
   * Creates a price for a product.
   */
  createPrice?(
    ctx: ProviderContext,
    input: CreatePriceInput,
  ): Promise<AsyncActionResult<string>>;

  /**
   * Retrieves a price by its external ID.
   */
  getPrice?(
    ctx: ProviderContext,
    input: GetPriceInput,
  ): Promise<AsyncActionResult<Price>>;

  /**
   * Lists prices for a product.
   */
  listPrices?(
    ctx: ProviderContext,
    options: ListPricesOptions,
  ): Promise<AsyncActionResult<PaginatedResult<Price>>>;
}
