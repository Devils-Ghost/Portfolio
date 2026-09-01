"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string; // Allows customizing width/padding/background per use case
  /**
   * Accessible name for the dialog, announced when it opens. Every modal
   * needs one — without it a screen reader reports only "dialog".
   */
  label?: string;
  /**
   * Renders a Back affordance next to Close when set — the modal-to-modal
   * navigation DetailModalHost needs (skill → project → back to skill,
   * PROJECT_PLAN.md §3.5). Omitted entirely when there's nowhere to go back
   * to, rather than shown disabled.
   */
  onBack?: () => void;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/*
 * Scroll lock is ref-counted rather than a straight write to body.overflow.
 * `Modal` is a generic, reusable shell — nothing stops two instances being
 * mounted at once — and with a plain write, closing either one would unlock
 * scrolling for the other. Counting means the lock lifts only when the last
 * open modal closes.
 */
let scrollLockCount = 0;

function lockScroll() {
  if (scrollLockCount === 0) document.body.style.overflow = "hidden";
  scrollLockCount += 1;
}

function releaseScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) document.body.style.overflow = "";
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className = "",
  label,
  onBack,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Kept in a ref rather than state: it's read once on close and must never
  // trigger a re-render.
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Every call site passes an inline arrow for onClose, so its identity
  // changes on every render. Depending on it directly would tear down and
  // re-run the effect below constantly — re-locking scroll and, worse,
  // firing the focus-restore cleanup while the modal is still open. Mirroring
  // it into a ref keeps the effect keyed on isOpen alone.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    lockScroll();

    // Remember where focus came from so it can be handed back on close.
    // Without this, dismissing a modal drops keyboard users at the top of
    // the document rather than back at the card they opened.
    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const panel = panelRef.current;
    // Focus the panel itself rather than its first control: it puts the
    // screen reader at the top of the dialog's content, and the first Tab
    // then moves to the first control as expected.
    panel?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !panel) return;

      // Focus trap: Tab past the last control wraps to the first, and
      // Shift+Tab before the first wraps to the last, so focus can never
      // escape into the inert page behind the backdrop.
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );

      if (focusables.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || active === panel)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      releaseScroll();
      previouslyFocused.current?.focus();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Dark Background Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content Box */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={cn(
              "relative w-full max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-10 focus:outline-none",
              className,
            )}
          >
            {/*
              Header: the accent bar, then Back/Close in a row beneath it —
              all in normal flow. Every kind gets the bar (it used to be each
              body's own first element, which put it at the same absolute
              top-6 row as Back and Close and they overlapped). Its own
              padding, separate from the body's below, so nothing here has to
              reason about how tall Back/Close end up.
            */}
            <div className="px-8 pt-8 pb-6">
              <div className="w-12 h-1 bg-blue-500 rounded-full mb-4" />
              <div className="flex items-center justify-between">
                {onBack ? (
                  <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="px-8 pb-8">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
