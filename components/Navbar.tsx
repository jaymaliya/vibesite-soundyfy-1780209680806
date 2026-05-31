"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";

export default function Navbar() {
  const router = useRouter();
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [badgePulse, setBadgePulse] = useState(false);
  const prevTotalItems = useRef(totalItems);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (totalItems !== prevTotalItems.current) {
      setBadgePulse(true);
      const t = setTimeout(() => setBadgePulse(false), 600);
      prevTotalItems.current = totalItems;
      return () => clearTimeout(t);
    }
  }, [totalItems]);

  function scrollToAbout() {
    setMenuOpen(false);
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  }

  const navLinks = (
    <>
      <button
        onClick={() => { router.push("/shop"); setMenuOpen(false); }}
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--text)",
          fontSize: "0.9375rem",
          fontWeight: 500,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 4px",
          letterSpacing: "0.02em",
          transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
        onFocus={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.color = "var(--text)")}
      >
        Shop
      </button>
      <button
        onClick={scrollToAbout}
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--text)",
          fontSize: "0.9375rem",
          fontWeight: 500,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "8px 4px",
          letterSpacing: "0.02em",
          transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
        onFocus={(e) => (e.currentTarget.style.color = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.color = "var(--text)")}
      >
        About
      </button>
    </>
  );

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "var(--bg)",
          borderBottom: scrolled
            ? "1px solid rgba(232,224,240,0.08)"
            : "1px solid transparent",
          boxShadow: scrolled
            ? "0 4px 32px 0 rgba(232,224,240,0.06)"
            : "none",
          transition:
            "box-shadow 0.3s cubic-bezier(0.4,0,0.2,1), border-color 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <nav
          aria-label="Main navigation"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          {/* Left links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              flex: 1,
            }}
            className="hidden-mobile-flex"
          >
            <button
              onClick={() => { router.push("/shop"); }}
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 4px",
                letterSpacing: "0.02em",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
              onFocus={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.color = "var(--text)")}
            >
              Shop
            </button>
            <button
              onClick={scrollToAbout}
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--text)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px 4px",
                letterSpacing: "0.02em",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
              onFocus={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.color = "var(--text)")}
            >
              About
            </button>
          </div>

          {/* Center logo */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="soundyfy logo"
              style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push("/")}
            />
          </div>

          {/* Right: desktop nav links + cart */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "32px",
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            {/* Desktop extra right links */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "32px" }}
              className="hidden-mobile-flex"
            >
              <button
                onClick={scrollToAbout}
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--text)",
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px 4px",
                  letterSpacing: "0.02em",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
                onFocus={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.color = "var(--text)")}
              >
                Contact
              </button>
            </div>

            {/* Cart button */}
            <button
              onClick={() => router.push("/checkout")}
              aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
              style={{
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "12px",
                transition:
                  "background 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(232,224,240,0.08)";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "none";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              }}
              onMouseDown={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")
              }
              onMouseUp={(e) =>
                ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")
              }
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              {/* Cart SVG */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>

              {/* Badge */}
              {totalItems > 0 && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "9999px",
                    backgroundColor: "#E53E3E",
                    color: "#fff",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    padding: "0 4px",
                    boxShadow: "0 0 0 2px var(--bg)",
                    transform: badgePulse ? "scale(1.3)" : "scale(1)",
                    transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
                    pointerEvents: "none",
                  }}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>

            {/* Hamburger (mobile only) */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="show-mobile"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              {menuOpen ? (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay menu */}
      {menuOpen && (
        <div
          role="dialog"
          aria-label="Mobile navigation menu"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
            backgroundColor: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            padding: "80px 32px 48px",
            gap: "8px",
          }}
        >
          <button
            onClick={() => { router.push("/"); setMenuOpen(false); }}
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
              fontSize: "1.75rem",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "16px 0",
              borderBottom: "1px solid rgba(232,224,240,0.08)",
              letterSpacing: "-0.01em",
              transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
          >
            Home
          </button>
          <button
            onClick={() => { router.push("/shop"); setMenuOpen(false); }}
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
              fontSize: "1.75rem",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "16px 0",
              borderBottom: "1px solid rgba(232,224,240,0.08)",
              letterSpacing: "-0.01em",
              transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
          >
            Shop
          </button>
          <button
            onClick={scrollToAbout}
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
              fontSize: "1.75rem",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "16px 0",
              borderBottom: "1px solid rgba(232,224,240,0.08)",
              letterSpacing: "-0.01em",
              transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
          >
            About
          </button>
          <button
            onClick={scrollToAbout}
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--text)",
              fontSize: "1.75rem",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              padding: "16px 0",
              borderBottom: "1px solid rgba(232,224,240,0.08)",
              letterSpacing: "-0.01em",
              transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text)")}
          >
            Contact
          </button>

          {/* Mobile cart button */}
          <button
            onClick={() => { router.push("/checkout"); setMenuOpen(false); }}
            style={{
              marginTop: "32px",
              backgroundColor: "var(--accent)",
              color: "#0E0B16",
              fontFamily: "var(--font-heading)",
              fontSize: "1rem",
              fontWeight: 700,
              border: "none",
              borderRadius: "12px",
              padding: "16px 24px",
              cursor: "pointer",
              letterSpacing: "0.02em",
              transition:
                "transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1)")
            }
            onMouseDown={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)")
            }
            onMouseUp={(e) =>
              ((e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)")
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            View Cart
            {totalItems > 0 && (
              <span
                style={{
                  backgroundColor: "#E53E3E",
                  color: "#fff",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "1px 8px",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Responsive styles injected via Tailwind-compatible approach */}
      <ResponsiveNavStyles />
    </>
  );
}

function ResponsiveNavStyles() {
  // We use a tiny server-safe component to emit media query classes
  // Because we cannot use <style> tags in client components, we rely on globals.css
  // This component renders nothing — responsive visibility is handled via className
  return null;
}