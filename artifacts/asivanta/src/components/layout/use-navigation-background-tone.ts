import { useEffect, useState, type RefObject } from "react";

const LIGHT_LUMINANCE_THRESHOLD = 0.58;

function channelLuminance(channel: number) {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function colorLuminance(color: string) {
  const channels = color.match(/[\d.]+/g)?.map(Number);
  if (!channels || channels.length < 3) return null;

  const [red, green, blue, alpha = 1] = channels;
  if (alpha < 0.45) return null;

  return (
    0.2126 * channelLuminance(red) +
    0.7152 * channelLuminance(green) +
    0.0722 * channelLuminance(blue)
  );
}

function backgroundLuminance(element: Element) {
  let current: Element | null = element;

  while (current) {
    const styles = window.getComputedStyle(current);
    const luminance = colorLuminance(styles.backgroundColor);
    if (luminance !== null) return luminance;
    current = current.parentElement;
  }

  return 1;
}

export function useNavigationBackgroundTone(
  headerRef: RefObject<HTMLElement | null>,
) {
  const [isLightBackground, setIsLightBackground] = useState(false);

  useEffect(() => {
    const updateTone = () => {
      const header = headerRef.current;
      if (!header) return;

      const headerRect = header.getBoundingClientRect();
      const sampleY = Math.min(
        window.innerHeight - 1,
        Math.max(1, headerRect.bottom - 2),
      );
      const samplePoints = [0.2, 0.5, 0.8];
      const luminances = samplePoints.flatMap((position) => {
        const sampleX = window.innerWidth * position;
        const pageElement = document
          .elementsFromPoint(sampleX, sampleY)
          .find((element) => element !== header && !header.contains(element));
        const luminance = pageElement ? backgroundLuminance(pageElement) : null;
        return luminance === null ? [] : [luminance];
      });

      if (luminances.length === 0) return;

      const lightSamples = luminances.filter(
        (luminance) => luminance >= LIGHT_LUMINANCE_THRESHOLD,
      ).length;
      setIsLightBackground(lightSamples > luminances.length / 2);
    };

    updateTone();
    window.addEventListener("scroll", updateTone, { passive: true });
    window.addEventListener("resize", updateTone);

    return () => {
      window.removeEventListener("scroll", updateTone);
      window.removeEventListener("resize", updateTone);
    };
  }, [headerRef]);

  return isLightBackground;
}
