import { ProductCategory } from "@revstackhq/providers-core";

export function mapCategoryToStripeTaxCode(category?: ProductCategory): string {
  switch (category) {
    case "saas":
      return "txcd_10000000"; // General SaaS
    case "digital_goods":
      return "txcd_10000000"; // Digital goods (Stripe groups this with SaaS often, or txcd_10502000)
    case "physical":
      return "txcd_99999999"; // General Tangible Goods
    case "consulting":
      return "txcd_20030000"; // Services
    case "education":
      return "txcd_10502000"; // Educational digital goods
    case "donations":
      return "txcd_00000000"; // Nontaxable
    default:
      return "txcd_10000000"; // Fallback to General Software/SaaS
  }
}
