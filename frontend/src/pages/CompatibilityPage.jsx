import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No /compatibility/* on api.nataltruth.com — zero HTTP. */
export default function CompatibilityPage() {
  return (
    <FeatureUnavailable
      title="Compatibility"
      description={UNAVAILABLE_FEATURES.compatibility}
    />
  );
}
