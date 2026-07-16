import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No /orders/* on api.nataltruth.com — zero HTTP. */
export default function ReadingThanksPage() {
  return (
    <FeatureUnavailable
      title="Reading order"
      description={UNAVAILABLE_FEATURES.orders}
      backTo="/pricing"
      backLabel="View plans"
    />
  );
}
