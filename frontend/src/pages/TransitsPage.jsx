import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No /transits/* on api.nataltruth.com — zero HTTP. */
export default function TransitsPage() {
  return (
    <FeatureUnavailable
      title="Transits"
      description={UNAVAILABLE_FEATURES.transits}
    />
  );
}
