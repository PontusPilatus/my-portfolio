import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Safety check for server-side rendering
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Set initial value
    checkMobile();

    // Use a safer event listener approach
    try {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

      // Modern API (addEventListener)
      if (mql.addEventListener) {
        mql.addEventListener("change", checkMobile);
        return () => mql.removeEventListener("change", checkMobile);
      }
      // Legacy API (addListener)
      else if (mql.addListener) {
        mql.addListener(checkMobile);
        return () => mql.removeListener(checkMobile);
      }
      // Fallback to window resize
      else {
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
      }
    } catch (e) {
      // Ultimate fallback if matchMedia fails
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [])

  return isMobile
}
