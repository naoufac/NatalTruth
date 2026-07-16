import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No /horoscope/* on api.nataltruth.com — zero HTTP. */
export default function HoroscopeTodayPage() {
  return (
    <FeatureUnavailable
      title="Daily horoscope"
      description={UNAVAILABLE_FEATURES.horoscope}
      backTo="/"
      backLabel="Back home"
    />
  );
}
