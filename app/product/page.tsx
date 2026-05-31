"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Premium Product", description: "a premium product", price: 249 },
  { id: 2, img: "/product-2.jpg", name: "Premium Product", description: "a premium product", price: 300 },
  { id: 3, img: "/product-3.jpg", name: "Premium Product", description: "a premium product", price: 400 },
  { id: 4, img: "/product-4.jpg", name: "Premium Product", description: "a premium product", price: 500 },
];

const reviews = [
  { name: "Arjun Mehta", location: "Mumbai", date: "12 Jan 2025", rating: 5, text: "Absolutely transformed my listening experience. The bass is tight, treble is crystal clear — nothing at this price comes close. Soundyfy is the real deal." },
  { name: "Priya Sharma", location: "Bangalore", date: "3 Feb 2025", rating: 5, text: "Wore them for a 6-hour flight and forgot I had them on. Comfort and sound in one sleek package. Zero regrets — best purchase of the year." },
  { name: "Rohit Nair", location: "Delhi", date: "27 Jan 2025", rating: 5, text: "Soundyfy is in a different league. My old earphones feel like toys now. The noise isolation alone is worth every rupee." },
  { name: "Sneha Iyer", location: "Chennai", date: "15 Feb 2025", rating: 5, text: "Incredible build quality. The carrying case is premium, the sound tuning is perfect, and the ANC just works. Would gift this to anyone." },
];

const colorOptions = ["Midnight Black", "Arctic White", "Deep Teal"];
const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
    label: "Studio-Grade Sound",
    desc: "40mm drivers tuned for audiophile precision — every note, revealed.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 11v2" /><path d="M7 11l3 3 5-6" />
      </svg>
    ),
    label: "36-Hour Battery",
    desc: "All-day listening with fast-charge support. 10 min = 3 hours playback.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 0 20" /><path d="M12 8a4 4 0 0 1 0 8" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
      </svg>
    ),
    label: "Adaptive ANC",
    desc: "Intelligent noise cancellation that reads your environment in real time.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    label: "2-Year Warranty",
    desc: "Every unit is covered — because we stand behind what we build.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px", color: "#00C9A7" }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </span>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCart() ?? { addItem: () => {} };

  const paramImg = searchParams.get("img") ? decodeURIComponent(searchParams.get("img")!) : null;
  const paramName = searchParams.get("name") ? decodeURIComponent(searchParams.get("name")!) : null;
  const paramPrice = searchParams.get("price") ? Number(searchParams.get("price")) : null;

  const displayImg = paramImg ?? "/product-1.jpg";
  const displayName = paramName ?? "Premium Product";
  const displayPrice = paramPrice ?? 249;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
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
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
      .reveal { opacity: 1; transform: none; }
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s cubic-bezier(0.4,0,0.2,1), transform 0.65s cubic-bezier(0.4,0,0.2,1); }
      .will-reveal.visible { opacity: 1; transform: none; }
      :focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
      @media (max-width: 767px) {
        .product-grid { grid-template-columns: 1fr !important; }
        .feature-grid { grid-template-columns: 1fr 1fr !important; }
        .reviews-grid { grid-template-columns: 1fr !important; }
        .recommended-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .desktop-cta { display: none !important; }
        .mobile-sticky { display: flex !important; }
        .hero-price { font-size: 2rem !important; }
      }
      @media (min-width: 768px) {
        .mobile-sticky { display: none !important; }
      }
    `;
    document.head.appendChild(styleEl);

    const els = document.querySelectorAll(".reveal");
    const vp = window.innerHeight;
    els.forEach((el) => {
      if (el.getBoundingClientRect().top > vp) {
        el.classList.add("will-reveal");
      } else {
        el.classList.add("visible");
      }
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.remove("will-reveal");
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      document.head.removeChild(styleEl);
    };
  }, []);

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      name: displayName,
      price: displayPrice,
      quantity,
      image: displayImg,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  const handleBuyNow = () => {
    addItem({
      id: crypto.randomUUID(),
      name: displayName,
      price: displayPrice,
      quantity,
      image: displayImg,
    });
    router.push("/checkout");
  };

  const recommendedProducts = products.filter((p) => p.img !== displayImg).slice(0, 3);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* ── BREADCRUMB ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 32px 0" }}>
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
          <span
            onClick={() => router.push("/")}
            style={{ cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Home
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span
            onClick={() => router.push("/shop")}
            style={{ cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Shop
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span style={{ color: "var(--text)" }}>{displayName}</span>
        </nav>
      </div>

      {/* ── PRODUCT HERO ── */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 32px 80px" }}>
        <div
          className="product-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "55fr 45fr",
            gap: "64px",
            alignItems: "flex-start",
          }}
        >
          {/* LEFT: Product Image */}
          <div>
            {/* Main image */}
            <div
              style={{
                borderRadius: "24px",
                overflow: "hidden",
                background: "var(--surface)",
                boxShadow: "0 40px 80px -20px #00C9A740",
                position: "relative",
              }}
            >
              {/* Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  zIndex: 2,
                  background: "var(--accent)",
                  color: "#0E0B16",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "5px 12px",
                  borderRadius: "9999px",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Bestseller
              </div>
              <img
                src={displayImg}
                alt={`${displayName} — soundyfy premium earphones`}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                style={{
                  width: "100%",
                  aspectRatio: "4/5",
                  objectFit: "cover",
                  display: "block",
                  transition: "transform 0.6s ease",
                }}
              />
            </div>

            {/* Feature highlight strip */}
            <div
              style={{
                marginTop: "24px",
                background: "var(--surface)",
                borderRadius: "16px",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {features.slice(0, 4).map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                      borderRadius: "10px",
                      background: "#00C9A715",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent)",
                    }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                        color: "var(--text)",
                        marginBottom: "2px",
                      }}
                    >
                      {f.label}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.5 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px", paddingTop: "8px" }}>
            {/* Rating row */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <Stars count={5} />
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                4.9 · 1,247 reviews
              </span>
              <span
                style={{
                  background: "#00C9A720",
                  color: "var(--accent)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontFamily: "var(--font-heading)",
                }}
              >
                In Stock
              </span>
            </div>

            {/* Product name */}
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.05,
                  color: "var(--text)",
                  marginBottom: "12px",
                }}
              >
                {displayName}
              </h1>
              <p style={{ fontSize: "1rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                Engineered for those who refuse to compromise. Precision-tuned drivers, ultra-lightweight build, and intelligent ANC that disappears into your day — this is earphone perfection.
              </p>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span
                className="hero-price"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "2.5rem",
                  fontWeight: 900,
                  color: "var(--accent)",
                  letterSpacing: "-0.02em",
                }}
              >
                ₹{displayPrice.toLocaleString("en-IN")}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  color: "var(--muted)",
                  textDecoration: "line-through",
                  fontFamily: "var(--font-body)",
                }}
              >
                ₹{Math.round(displayPrice * 1.3).toLocaleString("en-IN")}
              </span>
              <span
                style={{
                  background: "#00C9A720",
                  color: "var(--accent)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontFamily: "var(--font-heading)",
                }}
              >
                23% OFF
              </span>
            </div>

            {/* Trust signals */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                padding: "16px 20px",
                background: "var(--surface)",
                borderRadius: "12px",
                fontSize: "0.8rem",
                color: "var(--muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                Free delivery above ₹499
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                2-Year Warranty
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
                </svg>
                Made in India
              </span>
            </div>

            {/* Color selector */}
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  color: "var(--muted)",
                  fontFamily: "var(--font-heading)",
                  marginBottom: "12px",
                }}
              >
                Color — <span style={{ color: "var(--text)", textTransform: "none", letterSpacing: 0 }}>{selectedColor}</span>
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "9999px",
                      border: selectedColor === c ? "2px solid var(--accent)" : "2px solid var(--surface)",
                      background: selectedColor === c ? "#00C9A715" : "var(--surface)",
                      color: selectedColor === c ? "var(--accent)" : "var(--muted)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      transition: "border 0.2s, color 0.2s, background 0.2s",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p
                style={{
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  fontWeight: 700,
                  color: "var(--muted)",
                  fontFamily: "var(--font-heading)",
                  marginBottom: "12px",
                }}
              >
                Quantity
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0", width: "fit-content" }}>
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px 0 0 12px",
                    border: "1px solid var(--surface)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  −
                </button>
                <div
                  style={{
                    width: "56px",
                    height: "44px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderTop: "1px solid var(--surface)",
                    borderBottom: "1px solid var(--surface)",
                    background: "#0E0B16",
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "var(--text)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "0 12px 12px 0",
                    border: "1px solid var(--surface)",
                    background: "var(--surface)",
                    color: "var(--text)",
                    fontSize: "1.25rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="desktop-cta" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleBuyNow}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  padding: "18px 40px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: "pointer",
                  background: "var(--accent)",
                  color: "#0E0B16",
                  fontWeight: 800,
                  fontSize: "1rem",
                  letterSpacing: "0.04em",
                  fontFamily: "var(--font-heading)",
                  boxShadow: "0 12px 32px -8px #00C9A760",
                  transition: "transform 0.15s ease",
                  textTransform: "uppercase",
                }}
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  padding: "18px 40px",
                  borderRadius: "12px",
                  border: "2px solid var(--accent)",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--accent)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  letterSpacing: "0.04em",
                  fontFamily: "var(--font-heading)",
                  transition: "transform 0.15s ease",
                  textTransform: "uppercase",
                }}
              >
                {addedToCart ? "Added ✓" : "Add to Cart"}
              </button>
            </div>

            {/* Social proof micro */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.8rem", color: "var(--muted)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>2,300+ happy listeners this month</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE HIGHLIGHT SECTION ── */}
      <section
        className="reveal"
        id="features"
        style={{
          background: "var(--surface)",
          padding: "80px 32px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "56px" }}>
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "var(--font-heading)",
              }}
            >
              What Sets Us Apart
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--text)",
                marginTop: "12px",
              }}
            >
              Built different. Sounds different.
            </h2>
          </div>

          <div
            className="feature-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "24px",
            }}
          >
            {features.map((f, i) => (
              <div
                key={i}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px #00C9A750";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 30px -10px #00C9A730";
                }}
                style={{
                  background: "#0E0B16",
                  borderRadius: "16px",
                  padding: "32px 24px",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 8px 30px -10px #00C9A730",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "#00C9A715",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    marginBottom: "20px",
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    color: "var(--text)",
                    marginBottom: "8px",
                  }}
                >
                  {f.label}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)", lineHeight: 1.65, fontFamily: "var(--font-body)" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section
        className="reveal"
        style={{
          padding: "96px 32px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Real People. Real Sound.
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              color: "var(--text)",
              marginTop: "12px",
            }}
          >
            4.9 stars from 1,247 reviews
          </h2>
        </div>

        <div
          className="reviews-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "24px",
          }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px -12px #00C9A750";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px -10px #00C9A730";
              }}
              style={{
                background: "var(--surface)",
                borderRadius: "16px",
                padding: "32px",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 8px 30px -10px #00C9A730",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "9999px",
                    background: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    color: "#0E0B16",
                    flexShrink: 0,
                  }}
                >
                  {r.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                    {r.location} · {r.date}
                  </div>
                </div>
              </div>
              <Stars count={r.rating} />
              <p style={{ marginTop: "12px", fontSize: "0.9rem", lineHeight: 1.7, color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                "{r.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── YOU MIGHT ALSO LIKE ── */}
      <section
        className="reveal"
        style={{
          background: "var(--surface)",
          padding: "96px 32px",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{ marginBottom: "48px" }}>
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Explore More
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.05,
                color: "var(--text)",
                marginTop: "12px",
              }}
            >
              You Might Also Like
            </h2>
          </div>

          <div
            className="recommended-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "24px",
            }}
          >
            {recommendedProducts.map((p) => (
              <article
                key={p.id}
                onClick={() =>
                  router.push(
                    `/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`
                  )
                }
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px #00C9A750";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 30px -10px #00C9A730";
                }}
                style={{
                  cursor: "pointer",
                  background: "#0E0B16",
                  borderRadius: "16px",
                  overflow: "hidden",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 8px 30px -10px #00C9A730",
                }}
              >
                <div style={{ overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: 2,
                      background: "var(--accent)",
                      color: "#0E0B16",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    New
                  </div>
                  <img
                    src={p.img}
                    alt={`${p.name} — soundyfy earphones`}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    style={{
                      width: "100%",
                      aspectRatio: "4/5",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                  />
                </div>
                <div style={{ padding: "20px 20px 24px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--text)",
                      marginBottom: "6px",
                    }}
                  >
                    {p.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        color: "var(--accent)",
                      }}
                    >
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <Stars count={5} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── STICKY MOBILE BAR ── */}
      <div
        className="mobile-sticky"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 20px",
          background: "var(--surface)",
          borderTop: "1px solid #2A1F3D",
          display: "none",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 100,
          gap: "12px",
          boxShadow: "0 -8px 32px -8px #00C9A740",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 900,
              fontSize: "1.25rem",
              color: "var(--accent)",
            }}
          >
            ₹{displayPrice.toLocaleString("en-IN")}
          </div>
          <div style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            Free delivery above ₹499
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleAddToCart}
            style={{
              padding: "13px 20px",
              borderRadius: "12px",
              border: "2px solid var(--accent)",
              background: "transparent",
              color: "var(--accent)",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {addedToCart ? "Added ✓" : "Add to Cart"}
          </button>
          <button
            onClick={handleBuyNow}
            style={{
              padding: "13px 20px",
              borderRadius: "12px",
              border: "none",
              background: "var(--accent)",
              color: "#0E0B16",
              fontWeight: 800,
              fontSize: "0.85rem",
              cursor: "pointer",
              fontFamily: "var(--font-heading)",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              boxShadow: "0 6px 20px -6px #00C9A760",
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg)" }} />}>
      <ProductContent />
    </Suspense>
  );
}