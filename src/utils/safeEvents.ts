/**
 * In-memory + DOM safe event dispatcher across iframe environments, sandboxes, and WebKit views.
 * Completely eliminates any invocation of `new CustomEvent` or `new Event`.
 */

type Listener = (detail?: any) => void;
const internalRegistry: Record<string, Set<Listener>> = {};

export function registerSafeListener(eventName: string, listener: Listener): () => void {
  if (!internalRegistry[eventName]) {
    internalRegistry[eventName] = new Set();
  }
  internalRegistry[eventName].add(listener);
  return () => {
    try {
      internalRegistry[eventName]?.delete(listener);
    } catch (_) {}
  };
}

export function safeDispatchEvent(eventName: string, detail?: any): void {
  // 1. In-memory listeners (100% safe in any environment)
  try {
    if (internalRegistry[eventName]) {
      internalRegistry[eventName].forEach((fn) => {
        try {
          fn(detail);
        } catch (_) {}
      });
    }
  } catch (_) {}

  // 2. DOM-based dispatch with document.createEvent only
  if (typeof window === "undefined" || !window.dispatchEvent) return;

  try {
    if (typeof document !== "undefined" && typeof document.createEvent === "function") {
      try {
        const evt = document.createEvent("CustomEvent");
        if (typeof evt.initCustomEvent === "function") {
          evt.initCustomEvent(eventName, false, false, detail !== undefined ? detail : null);
          window.dispatchEvent(evt);
          return;
        }
      } catch (_) {}

      try {
        const evt = document.createEvent("Event");
        if (typeof evt.initEvent === "function") {
          evt.initEvent(eventName, false, false);
          if (detail !== undefined) {
            try {
              (evt as any).detail = detail;
            } catch (_) {}
          }
          window.dispatchEvent(evt);
          return;
        }
      } catch (_) {}

      try {
        const evt = document.createEvent("HTMLEvents");
        if (typeof evt.initEvent === "function") {
          evt.initEvent(eventName, false, false);
          if (detail !== undefined) {
            try {
              (evt as any).detail = detail;
            } catch (_) {}
          }
          window.dispatchEvent(evt);
          return;
        }
      } catch (_) {}
    }
  } catch (_) {}
}

export function safeDispatchStorageEvent(): void {
  safeDispatchEvent("storage");
}
