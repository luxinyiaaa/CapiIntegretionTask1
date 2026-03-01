import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type LazyImageProps = {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  rootMargin?: string;
  aspectRatio?: string;
};

export function LazyImage({
  src,
  alt = "",
  className,
  style,
  rootMargin = "300px",
  aspectRatio = "16 / 9",
}: LazyImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", aspectRatio, ...style }}
    >
      {isVisible ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      ) : (
        <div style={{ width: "100%", aspectRatio }} />
      )}
    </div>
  );
}
