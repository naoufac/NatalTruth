import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No server email verification — profile is local. */
export default function VerifyEmailPage() {
  return (
    <FeatureUnavailable
      title="Email verification"
      description={UNAVAILABLE_FEATURES.authServer}
      backTo="/auth"
      backLabel="Sign in / register"
    />
  );
}
