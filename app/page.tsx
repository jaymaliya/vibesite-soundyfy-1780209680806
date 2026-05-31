"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../components/CartContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
  { id: 1, img: "/product-1.jpg", name: "Premium Product", description: "a premium product", price: 249 },
  { id: 2, img: "/product-2.jpg", name: "Premium Product", description: "a premium product", price: 300 },
  { id: 3, img: "/product-3.jpg", name: "Premium Product", description: "a premium product", price: 400 },
  { id: 4, img: "/product-4.jpg", name: "Premium Product", description: "a premium product", price: 500 },
];

const reviews = [
  { name: "Arjun Mehta", location: "Mumbai", rating: 5, text: "Absolutely transformed my listening experience. The bass is tight, treble is crystal clear — nothing at this price comes close.", avatar: "AM" },
  { name: "Priya Sharma", location: "Bangalore", rating: 5, text: "Wore them for a 6-hour flight and forgot I had them on. Comfort and sound in one sleek package. Zero regrets.", avatar: "PS" },
  { name: "Rohit Nair", location: "Delhi", rating: 5, text: "Soundyfy is in a different league. My old earphones feel like toys now. The noise isolation alone is worth every rupee.", avatar: "RN" },
];

const benefits = [
  {
    label: "Studio-Grade Sound",
    desc: "40mm drivers tuned for audiophile precision",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    label: "36-Hour Battery",
    desc: "All-day listening with fast-charge support",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 11v2" /><path d="M7 11l3 3 5-6" />
      </svg>
    ),
  },
  {
    label: "Active Noise Cancel",
    desc: "Intelligent ANC adapts to your environment",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 0 20" /><path d="M12 8a4 4 0 0 1 0 8" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [subStatus, setSubStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

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
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.7s cubic-bezier(0.4,0,0.2,1); }
      .visible { opacity: 1 !important; transform: translateY(0) !important; }
      .reveal { }
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

  function handleAddToCart(p: typeof products[0]) {
    addItem({ id: String(p.id), name: p.name, price: p.price, quantity: 1, image: p.img });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1500);
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubStatus("loading");
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubStatus("done");
      setEmail("");
    } catch {
      setSubStatus("error");
    }
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* ─── HERO ─── */}
      <section
        className="reveal"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle radial glow */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Trust pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 18px",
            borderRadius: "9999px",
            background: "rgba(0,201,167,0.1)",
            border: "1px solid rgba(0,201,167,0.3)",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--accent)",
            marginBottom: "32px",
            fontFamily: "var(--font-heading)",
          }}
        >
          <span style={{ display: "inline-flex" }}>
            {[1,2,3,4,5].map(s => (
              <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill="#00C9A7" style={{ marginRight: "1px" }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </span>
          4.9 · 12,000+ Happy Ears · Free Shipping above ₹499
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(3rem,7vw,6.5rem)",
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: "-0.03em",
            color: "var(--text)",
            maxWidth: "900px",
            marginBottom: "24px",
          }}
        >
          Hear Everything.{" "}
          <span style={{ color: "var(--accent)" }}>Feel More.</span>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem,2vw,1.2rem)",
            lineHeight: 1.75,
            color: "var(--muted)",
            maxWidth: "520px",
            marginBottom: "40px",
            fontWeight: 400,
          }}
        >
          Premium earphones engineered for those who refuse to compromise. Studio-grade sound. All-day comfort. Made for India.
        </p>

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "72px" }}>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              padding: "16px 40px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: "var(--accent)",
              color: "#0E0B16",
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "1rem",
              letterSpacing: "0.02em",
              boxShadow: "0 10px 40px -10px rgba(0,201,167,0.55)",
              transition: "transform 0.15s ease",
            }}
          >
            Shop Now
          </button>
          <button
            onClick={() => document.getElementById("bestsellers")?.scrollIntoView({ behavior: "smooth" })}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              padding: "16px 40px",
              borderRadius: "12px",
              border: "1px solid rgba(232,224,240,0.2)",
              cursor: "pointer",
              background: "transparent",
              color: "var(--primary)",
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "transform 0.15s ease",
            }}
          >
            Explore Range
          </button>
        </div>

        {/* Hero product image */}
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 40px 100px -20px rgba(0,201,167,0.25)",
            border: "1px solid rgba(232,224,240,0.08)",
          }}
        >
          <img
            src="/product-1.jpg"
            alt="Soundyfy premium earphones hero"
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            style={{
              width: "100%",
              aspectRatio: "16/9",
              objectFit: "cover",
              display: "block",
              transition: "transform 0.7s ease",
            }}
          />
        </div>

        {/* Trust signals row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            justifyContent: "center",
            marginTop: "40px",
            fontSize: "0.8rem",
            color: "var(--muted)",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span>✦ Made in India</span>
          <span>✦ 1-Year Warranty</span>
          <span>✦ Free Delivery above ₹499</span>
          <span>✦ 12,000+ Reviews</span>
        </div>
      </section>

      {/* ─── BESTSELLERS ─── */}
      <section
        id="bestsellers"
        className="reveal"
        style={{ padding: "96px 24px", maxWidth: "1280px", margin: "0 auto" }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Bestsellers
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem,4vw,3.5rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginTop: "12px",
            }}
          >
            The Soundyfy Lineup
          </h2>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "1rem", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>
            Four models. One obsession — perfect sound.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "32px",
          }}
        >
          {products.map((p, i) => {
            const badges = ["Bestseller", "New Arrival", "Staff Pick", "Limited"];
            return (
              <article
                key={p.id}
                className="reveal"
                style={{
                  background: "var(--surface)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid rgba(232,224,240,0.06)",
                  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                  boxShadow: "0 8px 30px -10px rgba(0,201,167,0.15)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(0,201,167,0.30)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 30px -10px rgba(0,201,167,0.15)";
                }}
                onClick={() => router.push(`/product?name=${encodeURIComponent(p.name)}&price=${p.price}&img=${encodeURIComponent(p.img)}`)}
              >
                {/* image */}
                <div style={{ overflow: "hidden", position: "relative" }}>
                  <img
                    src={p.img}
                    alt={`Soundyfy ${p.name} - earphones`}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    style={{
                      width: "100%",
                      aspectRatio: "4/3",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s ease",
                    }}
                  />
                  {/* badge */}
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      padding: "4px 12px",
                      borderRadius: "9999px",
                      background: "var(--accent)",
                      color: "#0E0B16",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {badges[i]}
                  </span>
                </div>

                {/* card body */}
                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      color: "var(--text)",
                      marginBottom: "4px",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "16px", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                    {p.description}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "1.2rem",
                        color: "var(--accent)",
                      }}
                    >
                      ₹{p.price.toLocaleString("en-IN")}
                    </span>
                    <button
                      onClick={ev => {
                        ev.stopPropagation();
                        handleAddToCart(p);
                      }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                      onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "9999px",
                        border: addedId === p.id ? "none" : "1px solid rgba(0,201,167,0.5)",
                        background: addedId === p.id ? "var(--accent)" : "transparent",
                        color: addedId === p.id ? "#0E0B16" : "var(--accent)",
                        fontFamily: "var(--font-heading)",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        transition: "transform 0.15s ease",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {addedId === p.id ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <button
            onClick={() => router.push("/shop")}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{
              padding: "14px 36px",
              borderRadius: "12px",
              border: "1px solid rgba(232,224,240,0.2)",
              background: "transparent",
              color: "var(--primary)",
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
          >
            View All Products
          </button>
        </div>
      </section>

      {/* ─── FEATURE HIGHLIGHT (SIGNATURE ELEMENT) ─── */}
      <section
        className="reveal"
        style={{
          padding: "0 24px 96px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            borderRadius: "24px",
            background: "var(--surface)",
            border: "1px solid rgba(232,224,240,0.08)",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
          }}
        >
          {/* left — image */}
          <div style={{ overflow: "hidden", minHeight: "400px" }}>
            <img
              src="/product-2.jpg"
              alt="Soundyfy feature earphones close-up"
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
            />
          </div>

          {/* right — copy */}
          <div
            style={{
              padding: "clamp(40px,5vw,72px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "24px",
            }}
          >
            <span
              style={{
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                fontWeight: 700,
                color: "var(--accent)",
                fontFamily: "var(--font-heading)",
              }}
            >
              Feature Highlight
            </span>
            <h2
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.8rem,3vw,3rem)",
                fontWeight: 800,
                letterSpacing: "-0.025em",
                lineHeight: 1.1,
                color: "var(--text)",
              }}
            >
              Sound That{" "}
              <span style={{ color: "var(--accent)" }}>Adapts to You</span>
            </h2>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
                fontFamily: "var(--font-body)",
                maxWidth: "400px",
              }}
            >
              Soundyfy's Adaptive EQ technology analyses your ear canal in real time, delivering a personalised soundstage every single time you wear them. No two ears are the same — now no two listening sessions are either.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {["Real-time Adaptive EQ", "Dual-mic transparency mode", "IPX5 sweat resistance", "Graphene-tuned 10mm drivers"].map(f => (
                <li
                  key={f}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "var(--text)",
                    fontSize: "0.95rem",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00C9A7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.push("/shop")}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                alignSelf: "flex-start",
                padding: "14px 32px",
                borderRadius: "12px",
                border: "none",
                cursor: "pointer",
                background: "var(--accent)",
                color: "#0E0B16",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 8px 30px -8px rgba(0,201,167,0.4)",
                transition: "transform 0.15s ease",
              }}
            >
              Discover the Tech
            </button>
          </div>
        </div>

        {/* Mobile stack override */}
        <style>{`
          @media (max-width: 767px) {
            .feature-split { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* ─── BENEFITS ROW ─── */}
      <section
        className="reveal"
        style={{
          padding: "0 24px 96px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Why Soundyfy
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem,3.5vw,3rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginTop: "12px",
            }}
          >
            Engineered to Be Different
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "32px",
          }}
        >
          {benefits.map((b, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                background: "var(--surface)",
                borderRadius: "16px",
                padding: "40px 32px",
                border: "1px solid rgba(232,224,240,0.06)",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "16px",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 8px 30px -10px rgba(0,201,167,0.12)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(0,201,167,0.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px -10px rgba(0,201,167,0.12)";
              }}
            >
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "12px",
                  background: "rgba(0,201,167,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                }}
              >
                {b.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "var(--text)",
                }}
              >
                {b.label}
              </h3>
              <p
                style={{
                  color: "var(--muted)",
                  fontSize: "0.9rem",
                  lineHeight: 1.7,
                  fontFamily: "var(--font-body)",
                }}
              >
                {b.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── REVIEWS ─── */}
      <section
        className="reveal"
        style={{
          padding: "0 24px 96px",
          maxWidth: "1280px",
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "56px" }}>
          <span
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Real Talk
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(2rem,3.5vw,3rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginTop: "12px",
            }}
          >
            12,000+ Ears Can't Be Wrong
          </h2>
          <p style={{ color: "var(--muted)", marginTop: "12px", fontSize: "1rem", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>
            Unfiltered opinions from our community.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "32px",
          }}
        >
          {reviews.map((r, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                background: "var(--surface)",
                borderRadius: "16px",
                padding: "32px",
                border: "1px solid rgba(232,224,240,0.06)",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)",
                boxShadow: "0 8px 30px -10px rgba(0,201,167,0.12)",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 50px -12px rgba(0,201,167,0.25)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 30px -10px rgba(0,201,167,0.12)";
              }}
            >
              {/* stars */}
              <div style={{ display: "flex", gap: "2px" }}>
                {Array.from({ length: r.rating }).map((_, s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#00C9A7">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* quote */}
              <p
                style={{
                  color: "var(--text)",
                  fontSize: "0.95rem",
                  lineHeight: 1.75,
                  fontFamily: "var(--font-body)",
                  fontStyle: "italic",
                  flex: 1,
                }}
              >
                "{r.text}"
              </p>

              {/* reviewer */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "4px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9999px",
                    background: "rgba(0,201,167,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    flexShrink: 0,
                  }}
                >
                  {r.avatar}
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "0.9rem", color: "var(--text)" }}>
                    {r.name}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--muted)" }}>
                    {r.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── NEWSLETTER ─── */}
      <section
        className="reveal"
        style={{
          padding: "0 24px 96px",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "24px",
            padding: "clamp(48px,6vw,80px) clamp(32px,5vw,64px)",
            textAlign: "center",
            border: "1px solid rgba(0,201,167,0.15)",
            boxShadow: "0 30px 80px -20px rgba(0,201,167,0.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* glow */}
          <div
            style={{
              position: "absolute",
              bottom: "-40%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "500px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(0,201,167,0.06) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <span
            style={{
              fontSize: "0.72rem",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 700,
              color: "var(--accent)",
              fontFamily: "var(--font-heading)",
              display: "block",
              marginBottom: "16px",
            }}
          >
            Stay in the Loop
          </span>
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.8rem,3.5vw,2.8rem)",
              fontWeight: 800,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              color: "var(--text)",
              marginBottom: "12px",
            }}
          >
            New drops. Exclusive offers.{" "}
            <span style={{ color: "var(--accent)" }}>First access.</span>
          </h2>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.95rem",
              lineHeight: 1.7,
              fontFamily: "var(--font-body)",
              marginBottom: "36px",
              maxWidth: "420px",
              margin: "0 auto 36px",
            }}
          >
            Join 8,000+ audiophiles getting early access to launches, tips, and member-only deals.
          </p>

          {subStatus === "done" ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 32px",
                borderRadius: "12px",
                background: "rgba(0,201,167,0.12)",
                border: "1px solid rgba(0,201,167,0.3)",
                color: "var(--accent)",
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              You're in! Welcome to Soundyfy.
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              style={{
                display: "flex",
                gap: "12px",
                maxWidth: "480px",
                margin: "0 auto",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{
                  flex: "1 1 240px",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "1px solid rgba(232,224,240,0.15)",
                  background: "rgba(14,11,22,0.6)",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={subStatus === "loading"}
                onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  padding: "14px 32px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: subStatus === "loading" ? "wait" : "pointer",
                  background: "var(--accent)",
                  color: "#0E0B16",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  boxShadow: "0 8px 25px -8px rgba(0,201,167,0.45)",
                  transition: "transform 0.15s ease",
                  opacity: subStatus === "loading" ? 0.7 : 1,
                }}
              >
                {subStatus === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
              {subStatus === "error" && (
                <p style={{ width: "100%", textAlign: "center", color: "#ff6b6b", fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}