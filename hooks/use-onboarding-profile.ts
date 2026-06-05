"use client";

import { useEffect, useState } from "react";
import {
  defaultOnboardingState,
  onboardingStorageKey,
  safeParseOnboardingState,
  type OnboardingState,
} from "@/data/onboarding";

export function useOnboardingProfile() {
  const [onboarding, setOnboarding] = useState<OnboardingState>(
    defaultOnboardingState,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    function readOnboarding() {
      setOnboarding(
        safeParseOnboardingState(
          window.localStorage.getItem(onboardingStorageKey),
        ),
      );
      setHydrated(true);
    }

    readOnboarding();
    window.addEventListener("storage", readOnboarding);

    return () => {
      window.removeEventListener("storage", readOnboarding);
    };
  }, []);

  return { hydrated, onboarding };
}
