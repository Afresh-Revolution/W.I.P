import { tiers } from "./data";
import type { MembershipPlan, Submission } from "./site-types";

export function defaultPlans(): MembershipPlan[] {
  return tiers.map((tier) => ({
    id: tier.name.toLowerCase(),
    name: tier.name,
    price: tier.price,
    text: tier.text,
    featured: tier.featured
  }));
}

export function planAmount(price: string) {
  const digits = price.replace(/[^\d.]/g, "");
  const amount = Number(digits);
  return Number.isFinite(amount) ? amount : 0;
}

export function formatNaira(amount: number) {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function isFreePlan(price: string) {
  return planAmount(price) === 0;
}

export function tierRequiresPayment(tier: string, plans: MembershipPlan[]) {
  const plan = plans.find((item) => item.name === tier);
  if (plan) return !isFreePlan(plan.price);
  return Boolean(tier) && tier !== "Community";
}

export function membershipRevenue(submissions: Submission[], plans: MembershipPlan[]) {
  const confirmed = submissions.filter((item) => item.type === "membership" && item.paymentConfirmed);
  const total = confirmed.reduce((sum, item) => {
    const price = item.data.price || plans.find((plan) => plan.name === item.data.tier)?.price || "";
    return sum + planAmount(price);
  }, 0);
  return { total, count: confirmed.length };
}
