import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No /friend/* on api.nataltruth.com — zero HTTP. */
export default function FriendPage() {
  return (
    <FeatureUnavailable
      title="Friend chat"
      description={UNAVAILABLE_FEATURES.friend}
    />
  );
}
