"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Soundyfy Pro Headphones", description: "a premium product", price: 12999, badge: "NEW" },
  { id: 2, img: "/product-2.jpg", name: "Soundyfy Studio Monitor", description: "a premium product", price: 24999, badge: "" },
  { id: 3, img: "/product-3.jpg", name: "Soundyfy Wireless Earbuds", description: "a premium product", price: 8999, badge: "" },
  { id: 4, img: "/product-4.jpg", name: "Soundyfy Audio Interface", description: "a premium product", price: 34999, badge: "" }
];

const filters = ["All", "Earphones", "Wireless", "Studio", "Sport"];

export default function ShopPage() {
  const { addItem } = useCart() ?? { addItem: () => {} };
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All");
  const [addedId, setAddedId] = useState<number | null>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Raleway:wght@300;400;500;600;700&display=swap');
      :root {
        --bg: #0E0B16;
        --surface: #2A1F3D;
        --primary: #E8E0F0;
        --accent: #00C9A7;
        --text: #F0EAF8;
        --muted: #7A6E8A;
        --font-heading: 'Outfit', sans-serif;
        --font-body: 'Raleway', sans-serif;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
      .reveal { opacity: 1; transform: translateY(0); transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
      .will-reveal { opacity: 0; transform: translateY(28px); }
      .visible { opacity: 1 !important; transform: translateY(0) !important; }
      .shop-card { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1); }
      .shop-card:hover { transform: translateY(-6px); box-shadow: 0 24px 56px -12px #00C9A740; }
      .filter-pill { transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease; }
      .add-btn { transition: transform 0.15s ease, background 0.2s ease; }
      .add-btn:hover { transform: scale(1.02); }
      .add-btn:active { transform: scale(0.97); }
      .img-zoom { transition: transform 0.6s ease; }
      .img-zoom:hover { transform: scale(1.06); }
      @media (max-width: 640px) {
        .masonry-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; }
        .card-stagger { margin-top: 0 !important; }
        .shop-header { padding: 56px 24px 40px !important; }
        .trust-bar { flex-direction: column; gap: 12px; text-align: center; }
      }
      @media (max-width: 400px) {
        .masonry-grid { grid-template-columns: 1fr !important; }
      }
      :focus-visible { outline: 2px solid #00C9A7; outline-offset: 3px; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach(el => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver((entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.remove("will-reveal");
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }), { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  const handleAddToCart = (p: typeof products[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id: crypto.randomUUID(), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const staggerOffsets = [0, 40, 16, 56];
  const aspectRatios = ["4/5", "3/4", "4/5", "3/4"];

  return (
    <div style={{ backgroundColor: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />

      {/* Trust bar */}
      <div
        className="reveal"
        style={{
          backgroundColor: "var(--surface)",
          borderBottom: "1px solid rgba(0,201,167,0.15)",
        }}
      >
        <div
          className="trust-bar"
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "14px 48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "48px",
            fontFamily: "var(--font-body)",
            fontSize: "0.8rem",
            color: "var(--muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Free delivery above ₹999
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            1-Year Warranty
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            4.9 ★ — 12,000+ happy ears
          </span>
        </div>
      </div>

      {/* Shop Header */}
      <header
        className="reveal shop-header"
        style={{
          textAlign: "center",
          padding: "80px 48px 56px",
          maxWidth: "860px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <span
          style={{
            display: "inline-block",
            fontSize: "0.7rem",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            fontWeight: 700,
            color: "var(--accent)",
            fontFamily: "var(--font-heading)",
            marginBottom: "16px",
          }}
        >
          The Full Collection
        </span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            color: "var(--text)",
            marginBottom: "20px",
          }}
        >
          Sound Built for
          <br />
          <span style={{ color: "var(--accent)" }}>Every Moment</span>
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1.0625rem",
            lineHeight: 1.75,
            color: "var(--muted)",
            maxWidth: "520px",
            margin: "0 auto 40px",
          }}
        >
          Precision-engineered earphones for the way you actually live. Each model in the Soundyfy line is tuned, tested, and obsessed over.
        </p>

        {/* Filter Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {filters.map(f => (
            <button
              key={f}
              className="filter-pill"
              onClick={() => setActiveFilter(f)}
              style={{
                padding: "9px 22px",
                borderRadius: "9999px",
                border: activeFilter === f
                  ? "1.5px solid var(--accent)"
                  : "1.5px solid rgba(122,110,138,0.35)",
                background: activeFilter === f
                  ? "var(--accent)"
                  : "transparent",
                color: activeFilter === f ? "#0E0B16" : "var(--muted)",
                fontFamily: "var(--font-body)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Masonry-staggered Product Grid */}
      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 48px 120px",
          width: "100%",
          flex: 1,
        }}
      >
        <div
          className="masonry-grid reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {products.map((p, i) => (
            <article
              key={p.id}
              className="shop-card card-stagger"
              onClick={() =>
                router.push(
                  `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                )
              }
              style={{
                backgroundColor: "var(--surface)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                marginTop: `${staggerOffsets[i]}px`,
                boxShadow: "0 8px 30px -10px rgba(0,201,167,0.18)",
                border: "1px solid rgba(122,110,138,0.18)",
              }}
            >
              {/* Image wrapper */}
              <div style={{ position: "relative", overflow: "hidden" }}>
                <img
                  src={p.img}
                  alt={`Soundyfy ${p.name} — premium earphone`}
                  className="img-zoom"
                  style={{
                    width: "100%",
                    aspectRatio: aspectRatios[i],
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                {/* Badge */}
                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    backgroundColor: "var(--accent)",
                    color: "#0E0B16",
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    padding: "4px 10px",
                    borderRadius: "9999px",
                  }}
                >
                  {p.badge}
                </span>
                {/* Quick action overlay on hover — subtle gradient */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40%",
                    background:
                      "linear-gradient(to top, rgba(14,11,22,0.7) 0%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Card content */}
              <div style={{ padding: "20px 22px 22px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginBottom: "6px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "1.0625rem",
                      fontWeight: 700,
                      color: "var(--text)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {p.name}
                  </h3>
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      color: "var(--accent)",
                      whiteSpace: "nowrap",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    ₹{p.price.toLocaleString("en-IN")}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    lineHeight: 1.6,
                    marginBottom: "18px",
                    textTransform: "capitalize",
                  }}
                >
                  {p.description}
                </p>

                {/* Star rating */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    marginBottom: "18px",
                  }}
                >
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#00C9A7" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--muted)",
                    }}
                  >
                    (4.9)
                  </span>
                </div>

                {/* Action row */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="add-btn"
                    onClick={(e) => handleAddToCart(p, e)}
                    style={{
                      flex: 1,
                      padding: "11px 16px",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                      background: addedId === p.id ? "rgba(0,201,167,0.2)" : "var(--accent)",
                      color: addedId === p.id ? "var(--accent)" : "#0E0B16",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "0.8125rem",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {addedId === p.id ? "Added ✓" : "Add to Cart"}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(
                        `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                      );
                    }}
                    style={{
                      padding: "11px 14px",
                      borderRadius: "12px",
                      border: "1.5px solid rgba(122,110,138,0.35)",
                      cursor: "pointer",
                      background: "transparent",
                      color: "var(--muted)",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 600,
                      fontSize: "0.8125rem",
                      transition: "border-color 0.2s ease, color 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--accent)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(122,110,138,0.35)";
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--muted)";
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom feature highlight strip */}
        <div
          className="reveal"
          style={{
            marginTop: "96px",
            background: "var(--surface)",
            borderRadius: "20px",
            padding: "48px 56px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            alignItems: "center",
            border: "1px solid rgba(0,201,167,0.12)",
            boxShadow: "0 0 80px -20px rgba(0,201,167,0.1)",
          }}
        >
          {[
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                </svg>
              ),
              label: "Studio-Grade Audio",
              sub: "Tuned by audiophiles",
            },
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 11v2" /><path d="M7 11l3 3 5-6" />
                </svg>
              ),
              label: "36-Hr Battery",
              sub: "Fast-charge in 20 min",
            },
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              label: "1-Year Warranty",
              sub: "No questions asked",
            },
            {
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                </svg>
              ),
              label: "Free Returns",
              sub: "30-day trial, risk-free",
            },
          ].map((feat, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  background: "rgba(0,201,167,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {feat.icon}
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "0.9375rem",
                    color: "var(--text)",
                    marginBottom: "3px",
                  }}
                >
                  {feat.label}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8125rem",
                    color: "var(--muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {feat.sub}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}