"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  const quickLinks: { label: string; action: () => void }[] = [
    { label: "Home", action: () => router.push("/") },
    { label: "Shop", action: () => router.push("/shop") },
  ];

  return (
    <footer
      style={{
        backgroundColor: "var(--bg)",
        borderTop: "1px solid rgba(232,224,240,0.08)",
        paddingTop: "64px",
        paddingBottom: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "48px 40px",
            marginBottom: "56px",
          }}
        >
          {/* Brand column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <img
              src="/logo.png"
              alt="soundyfy logo"
              style={{ height: "32px", objectFit: "contain", opacity: 0.85, alignSelf: "flex-start" }}
            />
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--muted)",
                fontSize: "0.9rem",
                lineHeight: "1.6",
                maxWidth: "260px",
                margin: 0,
              }}
            >
              Premium earphones crafted for those who refuse to settle for average sound.
              Made in India.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="soundyfy on Instagram"
                style={{
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "rgba(0,201,167,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--surface)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="soundyfy on Twitter"
                style={{
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "rgba(0,201,167,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--surface)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/917700000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with soundyfy on WhatsApp"
                style={{
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface)",
                  transition:
                    "color 0.2s cubic-bezier(0.4,0,0.2,1), background-color 0.2s cubic-bezier(0.4,0,0.2,1), transform 0.2s cubic-bezier(0.4,0,0.2,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "rgba(0,201,167,0.12)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)";
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    "var(--surface)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--primary)",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                margin: "0 0 8px 0",
              }}
            >
              Quick Links
            </h3>
            {quickLinks.map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--muted)",
                  fontSize: "0.9375rem",
                  fontWeight: 400,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  padding: "4px 0",
                  letterSpacing: "0.01em",
                  transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                  width: "fit-content",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "var(--accent)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "var(--muted)")
                }
                onFocus={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "var(--accent)")
                }
                onBlur={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.color = "var(--muted)")
                }
              >
                {label}
              </button>
            ))}
            {/* Contact Us */}
            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--muted)",
                fontSize: "0.9375rem",
                fontWeight: 400,
                textDecoration: "none",
                padding: "4px 0",
                letterSpacing: "0.01em",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
                display: "inline-block",
                width: "fit-content",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)")
              }
              onFocus={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)")
              }
            >
              Contact Us
            </a>
          </div>

          {/* Newsletter */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--primary)",
                fontSize: "1rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                margin: "0 0 8px 0",
              }}
            >
              Stay in the loop
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--muted)",
                fontSize: "0.875rem",
                lineHeight: "1.55",
                margin: 0,
              }}
            >
              New drops, exclusive deals, and no fluff. Unsubscribe anytime.
            </p>

            {status === "success" ? (
              <div
                role="status"
                style={{
                  backgroundColor: "rgba(0,201,167,0.12)",
                  border: "1px solid rgba(0,201,167,0.3)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  fontFamily: "var(--font-body)",
                  color: "var(--accent)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Thanks! We&apos;ll be in touch.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
                noValidate
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  aria-label="Email address for newsletter"
                  style={{
                    fontFamily: "var(--font-body)",
                    backgroundColor: "var(--surface)",
                    color: "var(--text)",
                    border: "1px solid rgba(232,224,240,0.14)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    fontSize: "0.9375rem",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                    transition:
                      "border-color 0.2s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      "var(--accent)";
                    (e.currentTarget as HTMLInputElement).style.boxShadow =
                      "0 0 0 3px rgba(0,201,167,0.15)";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLInputElement).style.borderColor =
                      "rgba(232,224,240,0.14)";
                    (e.currentTarget as HTMLInputElement).style.boxShadow = "none";
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  aria-label="Subscribe to newsletter"
                  style={{
                    fontFamily: "var(--font-heading)",
                    backgroundColor: status === "loading" ? "rgba(0,201,167,0.5)" : "var(--accent)",
                    color: "#0E0B16",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    border: "none",
                    borderRadius: "12px",
                    padding: "12px 24px",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    letterSpacing: "0.02em",
                    transition:
                      "transform 0.2s cubic-bezier(0.4,0,0.2,1), opacity 0.2s cubic-bezier(0.4,0,0.2,1)",
                  }}
                  onMouseEnter={(e) => {
                    if (status !== "loading")
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    if (status !== "loading")
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
                  }}
                  onMouseUp={(e) => {
                    if (status !== "loading")
                      (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.02)";
                  }}
                  onFocus={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline =
                      "2px solid var(--accent)";
                    (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
                  }}
                  onBlur={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.outline = "none";
                  }}
                >
                  {status === "loading" ? "Subscribing…" : "Subscribe"}
                </button>

                {status === "error" && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "#fc8181",
                      fontSize: "0.8125rem",
                      margin: 0,
                    }}
                  >
                    Something went wrong — please try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            backgroundColor: "rgba(232,224,240,0.08)",
            marginBottom: "32px",
          }}
          aria-hidden="true"
        />

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--muted)",
              fontSize: "0.8125rem",
              margin: 0,
            }}
          >
            &copy; {new Date().getFullYear()} soundyfy. All rights reserved.
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Made in India badge */}
            <span
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--muted)",
                fontSize: "0.8125rem",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Made in India
            </span>

            <span
              style={{
                color: "rgba(122,110,138,0.4)",
                fontSize: "0.75rem",
                userSelect: "none",
              }}
              aria-hidden="true"
            >
              ·
            </span>

            <a
              href="mailto:maliyajay77@gmail.com"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--muted)",
                fontSize: "0.8125rem",
                textDecoration: "none",
                transition: "color 0.2s cubic-bezier(0.4,0,0.2,1)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)")
              }
              onFocus={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
              }
              onBlur={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--muted)")
              }
            >
              maliyajay77@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}