import FeatureUnavailable from "@/components/FeatureUnavailable";
import { UNAVAILABLE_FEATURES } from "@/lib/liveApis";

/** No server password reset API. */
export default function ResetPasswordPage() {
  return (
    <FeatureUnavailable
      title="Password reset"
      description={UNAVAILABLE_FEATURES.authServer}
      backTo="/auth"
      backLabel="Sign in / register"
    />
  );
}
