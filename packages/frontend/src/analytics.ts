// analyticsTracker.ts
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";

export function trackPageViews(router: any) {
  router.subscribe((state) => {
    console.log(`Tracking page view: ${state.location.pathname}`);
    const location = state.location;

    logEvent(analytics, "page_view", {
      page_path: location.pathname,
      page_location: window.location.href,
    });
  });
}
