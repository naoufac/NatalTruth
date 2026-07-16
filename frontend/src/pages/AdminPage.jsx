import FeatureUnavailable from "@/components/FeatureUnavailable";

/**
 * Admin product UI belongs on nao.nataltruth.com (not dead /admin/* on calc API).
 * Zero HTTP from this shell page.
 */
export default function AdminPage() {
  return (
    <FeatureUnavailable
      title="Admin"
      description="Product admin is not served from this SPA. When ready, use https://nao.nataltruth.com with admin APIs on api.nataltruth.com. No admin request was sent from here."
      backTo="/dashboard"
      liveAlternatives={[
        { to: "/chart", label: "Chart" },
        { to: "/chat", label: "Chat" },
      ]}
    />
  );
}
