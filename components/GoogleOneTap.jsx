"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function GoogleOneTap({ onSuccess, onError, disabled = false }) {
  const supabase = createClient();
  const router = useRouter();
  const oneTapRef = useRef(false);

  useEffect(() => {
    if (disabled || oneTapRef.current) return;

    const initializeOneTap = async () => {
      // Check if user is already logged in
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) return;

      // Wait for Google One Tap to be available
      if (typeof window !== "undefined" && window.google) {
        oneTapRef.current = true;

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: async (response) => {
            try {
              const { data, error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
              });

              if (error) {
                console.error("One Tap sign in error:", error);
                onError?.(error);
                return;
              }

              if (data.user) {
                onSuccess?.(data.user);
                router.refresh();
              }
            } catch (err) {
              console.error("One Tap error:", err);
              onError?.(err);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.log(
              "One Tap not displayed:",
              notification.getNotDisplayedReason()
            );
          }
        });
      }
    };

    // Initialize immediately if Google is already loaded
    if (window.google?.accounts?.id) {
      initializeOneTap();
    } else {
      // Wait for Google One Tap script to load
      const checkGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkGoogle);
          initializeOneTap();
        }
      }, 100);

      return () => clearInterval(checkGoogle);
    }
  }, [disabled, onSuccess, onError, supabase, router]);

  return null; // This component doesn't render anything visible
}
