import { useEffect, useRef, useState } from "react";

const ANIMATION_DURATION = 1000; // must match the CSS transition duration below

export default function CommonModal({
  open,
  onClose,
  title = "",
  height = "70vh",
  children,
  footer,
}) {
  const [isMounted, setIsMounted] = useState(open);
  const [isVisible, setIsVisible] = useState(false);

  const closeTimeoutRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previouslyFocusedRef = useRef(null);

  useEffect(() => {
    if (open) {
      // Cancel pending close
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }

      previouslyFocusedRef.current = document.activeElement;

      setIsMounted(true);
      document.body.style.overflow = "hidden";

      // Start animation after mount
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      // Start closing animation
      setIsVisible(false);

      closeTimeoutRef.current = setTimeout(() => {
        setIsMounted(false);
        document.body.style.overflow = "";
        closeTimeoutRef.current = null;
      }, ANIMATION_DURATION);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, [open]);

  // Cleanup
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";

      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Focus
  useEffect(() => {
    if (isVisible) {
      closeButtonRef.current?.focus();
    }

    if (!open && !isMounted) {
      previouslyFocusedRef.current?.focus?.();
    }
  }, [isVisible, open, isMounted]);

  // Escape
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMounted, onClose]);

  if (!isMounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`
          fixed inset-0 z-40
          transition-opacity
          duration-[1000ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        style={{
          background: "rgba(0, 0, 0, 0.55)",
        }}
      />

      {/* Modal wrapper */}
      <div
        className={`
          pointer-events-none
          fixed inset-x-0 bottom-0 z-50
          md:inset-0
          md:flex
          md:items-center
          md:justify-center
          md:p-4
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "popup-title" : undefined}
      >
        <div className="relative w-full md:w-auto md:max-w-lg">
          {/* Floating close button */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close popup"
            className={`
              pointer-events-auto
              absolute
              -top-12 left-[92%] z-10
              flex h-10 w-10
              -translate-x-1/2
              items-center justify-center
              rounded-full
              transition-all
              duration-[1000ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              md:-right-3 md:-top-3 md:left-auto md:translate-x-0
              ${isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0"}
            `}
            style={{
              background: "var(--card)",
              color: "var(--muted)",
              boxShadow: "var(--shadow)",
            }}
          >
            ✕
          </button>

          {/* Modal */}
          <div
            className={`
              pointer-events-auto
              flex w-full flex-col
              rounded-t-2xl
              md:rounded-2xl
              transition-all
              duration-[1000ms]
              ease-[cubic-bezier(0.22,1,0.36,1)]
              ${isVisible
                ? "translate-y-0 opacity-100 md:scale-100"
                : "translate-y-full opacity-0 md:translate-y-8 md:scale-[0.97]"}
            `}
            style={{
              height,
              maxHeight: "77vh",
              background: "var(--card)",
              boxShadow: "var(--shadow-lg)",
              willChange: "transform, opacity",
            }}
          >
            {/* Header */}
            {title && (
              <div
                className="
                  flex shrink-0
                  items-center justify-between
                  border-b
                "
                style={{
                  borderColor: "var(--border)",
                }}
              >
                <h2
                  id="popup-title"
                  className="text-base font-semibold"
                  style={{
                    color: "var(--ink)",
                  }}
                >
                  {title}
                </h2>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-full
                    text-sm
                    transition-colors
                  "
                  style={{
                    color: "var(--muted)",
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {/* Body */}
            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
              "
              style={{
                color: "var(--ink2)",
              }}
            >
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div
                className="
                  flex shrink-0
                  justify-end
                  gap-3
                  border-t
                "
                style={{
                  borderColor: "var(--border)",
                }}
              >
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}