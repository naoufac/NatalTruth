import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No /chart/public/* on api.nataltruth.com — zero HTTP. */
export default function PublicChartPage() {
  return (
    <FeatureUnavailable
      title="Public chart link"
      description={UNAVAILABLE_FEATURES.publicChart}
      backTo="/chart"
      backLabel="Open my chart"
    />
  );
}
