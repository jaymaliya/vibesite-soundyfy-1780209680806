"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CheckoutPage() {
  const router = useRouter();
  const { items = [], clearCart } = useCart() ?? {};

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 99;
  const total = subtotal + shipping;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [payData, setPayData] = useState<any>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [upiTxnId, setUpiTxnId] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [paymentLaunched, setPaymentLaunched] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/Android|iPhone|iPad/i.test(navigator.userAgent));

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
      body { background: var(--bg); color: var(--text); font-family: var(--font-body), sans-serif; }
      .reveal { opacity: 1; }
      .will-reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
      .visible { opacity: 1 !important; transform: translateY(0) !important; }
      input:focus { outline: none; border-color: var(--accent) !important; box-shadow: 0 0 0 3px rgba(0,201,167,0.18); }
      ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--surface); border-radius: 3px; }
    `;
    document.head.appendChild(style);

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

  function validate() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!phone.trim() || !/^\d{10}$/.test(phone)) errs.phone = "Enter a valid 10-digit phone number";
    if (!address.trim()) errs.address = "Address is required";
    if (!city.trim()) errs.city = "City is required";
    if (!state.trim()) errs.state = "State is required";
    if (!pin.trim() || !/^\d{6}$/.test(pin)) errs.pin = "Enter a valid 6-digit PIN code";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function payNow() {
    if (typeof (window as any).PaymentRequest !== 'undefined') {
      try {
        const req = new (window as any).PaymentRequest(
          [{ supportedMethods: 'https://tez.google.com/pay', data: { pa: payData.upiId, tr: payData.orderId, am: String(payData.amount), cu: 'INR' } }],
          { total: { label: 'Total', amount: { currency: 'INR', value: String(payData.amount) } } }
        );
        const canPay = await req.canMakePayment();
        if (canPay) {
          const response = await req.show();
          await response.complete('success');
          setPaymentLaunched(true);
          return;
        }
      } catch (_e) {}
    }
    window.location.href = `upi://pay?pa=${encodeURIComponent(payData.upiId)}&am=${payData.amount}&cu=INR`;
    setTimeout(() => setPaymentLaunched(true), 4000);
  }

  async function handleCheckout() {
    if (!validate()) return;
    setPaying(true);
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          customerName: name,
          customerPhone: phone,
          customerAddress: address + " " + city + " " + state + " " + pin,
          items: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price })))
        })
      });
      const data = await res.json();
      setPayData(data);
    } catch (e) {
      setPaying(false);
    }
  }

  async function handleConfirmOrder() {
    setConfirming(true);
    try {
      await fetch('/api/upi-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: payData.orderId,
          customerName: name,
          customerPhone: phone,
          customerAddress: address + " " + city + " " + state + " " + pin,
          items: JSON.stringify(items.map(i => ({ name: i.name, qty: i.quantity, price: i.price }))),
          brandName: 'soundyfy',
          amount: payData.amount,
          upiTxnId
        })
      });
      setPaid(true);
      clearCart?.();
    } catch (e) {
      setConfirming(false);
    }
  }

  const inputStyle = (field: string) => ({
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: `1.5px solid ${errors[field] ? '#ff6b6b' : 'rgba(232,224,240,0.12)'}`,
    background: "rgba(42,31,61,0.6)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  });

  if (items.length === 0 && !paid) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
        <Navbar />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", gap: "24px", padding: "48px 24px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </div>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 700, color: "var(--text)", textAlign: "center" }}>Your cart is empty</h2>
          <p style={{ color: "var(--muted)", fontSize: "16px", textAlign: "center", maxWidth: "320px", lineHeight: 1.7 }}>Add some earphones to your cart before checking out.</p>
          <button
            onClick={() => router.push('/shop')}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
            onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
            style={{ padding: "14px 40px", borderRadius: "12px", border: "none", background: "var(--accent)", color: "#0E0B16", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "15px", cursor: "pointer", transition: "transform 0.15s ease", letterSpacing: "0.02em" }}
          >
            Start Shopping
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", fontFamily: "var(--font-body)" }}>
      <Navbar />

      {/* Page Header */}
      <div className="reveal" style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px 32px" }}>
        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 600, color: "var(--accent)", fontFamily: "var(--font-heading)" }}>Checkout</span>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 700, color: "var(--text)", marginTop: "8px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>
          Complete Your Order
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "15px", marginTop: "8px", lineHeight: 1.7 }}>Fill in your delivery details and pay securely via UPI.</p>
      </div>

      {/* Main Grid */}
      <div className="reveal" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 96px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))", gap: "40px", alignItems: "start" }}>

        {/* LEFT — Delivery Form */}
        <div style={{ background: "var(--surface)", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)", boxShadow: "0 20px 60px -20px rgba(0,201,167,0.12)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", marginBottom: "28px", letterSpacing: "-0.01em" }}>
            Delivery Details
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Full Name */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "8px" }}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                placeholder="Arjun Mehta"
                style={inputStyle("name")}
              />
              {errors.name && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "6px" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "8px" }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                placeholder="arjun@email.com"
                style={inputStyle("email")}
              />
              {errors.email && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "6px" }}>{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "8px" }}>Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(p => ({ ...p, phone: "" })); }}
                placeholder="9876543210"
                style={inputStyle("phone")}
              />
              {errors.phone && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "6px" }}>{errors.phone}</p>}
            </div>

            {/* Address */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "8px" }}>Address</label>
              <textarea
                value={address}
                onChange={e => { setAddress(e.target.value); setErrors(p => ({ ...p, address: "" })); }}
                placeholder="Flat 4B, 12 MG Road"
                rows={2}
                style={{ ...inputStyle("address"), resize: "none", lineHeight: 1.6 }}
              />
              {errors.address && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "6px" }}>{errors.address}</p>}
            </div>

            {/* City + State */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "8px" }}>City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => { setCity(e.target.value); setErrors(p => ({ ...p, city: "" })); }}
                  placeholder="Mumbai"
                  style={inputStyle("city")}
                />
                {errors.city && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "6px" }}>{errors.city}</p>}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "8px" }}>State</label>
                <input
                  type="text"
                  value={state}
                  onChange={e => { setState(e.target.value); setErrors(p => ({ ...p, state: "" })); }}
                  placeholder="Maharashtra"
                  style={inputStyle("state")}
                />
                {errors.state && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "6px" }}>{errors.state}</p>}
              </div>
            </div>

            {/* PIN */}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", marginBottom: "8px" }}>PIN Code</label>
              <input
                type="text"
                value={pin}
                onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 6)); setErrors(p => ({ ...p, pin: "" })); }}
                placeholder="400001"
                style={inputStyle("pin")}
              />
              {errors.pin && <p style={{ color: "#ff6b6b", fontSize: "12px", marginTop: "6px" }}>{errors.pin}</p>}
            </div>
          </div>

          {/* UPI Logos */}
          <div style={{ marginTop: "28px", padding: "16px", background: "rgba(0,201,167,0.06)", borderRadius: "12px", border: "1px solid rgba(0,201,167,0.14)", display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>Secure UPI Payment</p>
              <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "2px" }}>Google Pay · PhonePe · Paytm · BHIM</p>
            </div>
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div style={{ position: "sticky", top: "100px" }}>
          <div style={{ background: "var(--surface)", borderRadius: "20px", padding: "clamp(24px, 4vw, 40px)", boxShadow: "0 20px 60px -20px rgba(0,201,167,0.12)" }}>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.3rem", fontWeight: 700, color: "var(--text)", marginBottom: "24px", letterSpacing: "-0.01em" }}>
              Order Summary
            </h2>

            {/* Cart Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "rgba(232,224,240,0.06)" }}>
                    <img
                      src={item.image || "/product-1.jpg"}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</p>
                    <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--accent)", flexShrink: 0 }}>
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(232,224,240,0.1)", marginBottom: "20px" }} />

            {/* Pricing Breakdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "var(--muted)" }}>Subtotal</span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", color: "var(--muted)" }}>Shipping</span>
                {shipping === 0 ? (
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--accent)" }}>FREE</span>
                ) : (
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>₹{shipping}</span>
                )}
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: "12px", color: "var(--muted)", background: "rgba(232,224,240,0.05)", padding: "8px 10px", borderRadius: "8px" }}>
                  Add ₹{(500 - subtotal).toLocaleString("en-IN")} more for free shipping
                </p>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(232,224,240,0.1)", marginBottom: "20px" }} />

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700, color: "var(--text)" }}>Total</span>
              <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", fontWeight: 800, color: "var(--accent)" }}>₹{total.toLocaleString("en-IN")}</span>
            </div>

            {/* Pay Button */}
            <button
              onClick={handleCheckout}
              disabled={paying}
              onMouseEnter={e => { if (!paying) e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{
                width: "100%",
                padding: "16px",
                borderRadius: "12px",
                border: "none",
                background: paying ? "rgba(0,201,167,0.5)" : "var(--accent)",
                color: "#0E0B16",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: "16px",
                cursor: paying ? "not-allowed" : "pointer",
                letterSpacing: "0.02em",
                transition: "transform 0.15s ease",
                boxShadow: "0 10px 30px -10px rgba(0,201,167,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}
            >
              {paying ? (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" style={{ animation: "spin 1s linear infinite" }} />
                  </svg>
                  Preparing Payment…
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Pay via UPI
                </>
              )}
            </button>

            <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center", marginTop: "12px", lineHeight: 1.6 }}>
              256-bit SSL encrypted · 100% secure checkout
            </p>
          </div>

          {/* Trust signals */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginTop: "20px", flexWrap: "wrap" }}>
            {[
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, text: "Secure & Safe" },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>, text: "Fast Delivery" },
              { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>, text: "Easy Returns" }
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "12px" }}>
                {t.icon}
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />

      {/* ── PAYMENT OVERLAY ── */}
      {payData && !paid && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(14,11,22,0.92)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "var(--surface)", borderRadius: "20px", padding: "28px", width: "100%", maxWidth: "400px", boxShadow: "0 40px 80px -20px rgba(0,201,167,0.25)", border: "1px solid rgba(232,224,240,0.08)" }}>

            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img src="/logo.png" alt="soundyfy logo" style={{ height: "28px", objectFit: "contain" }} />
                <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, color: "var(--text)", fontSize: "16px" }}>soundyfy</span>
              </div>
              <button
                onClick={() => { setPayData(null); setPaying(false); setPaymentLaunched(false); }}
                style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1px solid rgba(232,224,240,0.12)", background: "rgba(232,224,240,0.05)", color: "var(--muted)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>

            {/* Amount */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--muted)", marginBottom: "8px", fontFamily: "var(--font-heading)" }}>Amount Due</p>
              <p style={{ fontFamily: "var(--font-heading)", fontSize: "2.5rem", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.02em" }}>₹{payData.amount.toLocaleString("en-IN")}</p>
            </div>

            {/* MOBILE: Deep-link button */}
            {isMobile ? (
              <div style={{ marginBottom: "20px" }}>
                <button
                  onClick={payNow}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                  onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                  style={{ width: "100%", padding: "16px", borderRadius: "12px", border: "none", background: "var(--accent)", color: "#0E0B16", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "16px", cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "0 10px 30px -10px rgba(0,201,167,0.5)", marginBottom: "8px" }}
                >
                  Pay ₹{payData.amount.toLocaleString("en-IN")} Now
                </button>
                <p style={{ fontSize: "12px", color: "var(--muted)", textAlign: "center" }}>Opens Google Pay · PhonePe · Paytm</p>
                {paymentLaunched && (
                  <div style={{ marginTop: "12px", padding: "12px", background: "rgba(0,201,167,0.1)", borderRadius: "10px", border: "1px solid rgba(0,201,167,0.2)", textAlign: "center" }}>
                    <p style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 600 }}>Payment app opened — confirm below</p>
                  </div>
                )}
              </div>
            ) : (
              /* DESKTOP: QR Code */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                {payData.qrBase64 ? (
                  <>
                    <div style={{ padding: "12px", background: "#fff", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
                      <img src={`data:image/png;base64,${payData.qrBase64}`} width={180} height={180} alt="UPI QR Code" style={{ display: "block" }} />
                    </div>
                    <p style={{ fontSize: "13px", color: "var(--muted)", textAlign: "center" }}>Scan with any UPI app</p>
                  </>
                ) : (
                  <div style={{ padding: "20px", background: "rgba(232,224,240,0.05)", borderRadius: "12px", textAlign: "center" }}>
                    <p style={{ fontSize: "13px", color: "var(--muted)" }}>UPI ID: <strong style={{ color: "var(--text)" }}>{payData.upiId}</strong></p>
                    <p style={{ fontSize: "12px", color: "var(--muted)", marginTop: "6px" }}>Pay ₹{payData.amount} to this UPI ID</p>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div style={{ height: "1px", background: "rgba(232,224,240,0.08)", marginBottom: "20px" }} />

            {/* Confirm Section */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--muted)", fontFamily: "var(--font-heading)" }}>Confirm Payment</p>
              <input
                type="text"
                placeholder="UPI Transaction ID (optional)"
                value={upiTxnId}
                onChange={e => setUpiTxnId(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1.5px solid rgba(232,224,240,0.12)", background: "rgba(14,11,22,0.6)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: "14px" }}
              />
              <button
                onClick={handleConfirmOrder}
                disabled={confirming}
                onMouseEnter={e => { if (!confirming) e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
                onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "1.5px solid var(--accent)",
                  background: "transparent",
                  color: "var(--accent)",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  fontSize: "15px",
                  cursor: confirming ? "not-allowed" : "pointer",
                  transition: "transform 0.15s ease",
                  opacity: confirming ? 0.6 : 1
                }}
              >
                {confirming ? "Confirming…" : "I've Paid — Confirm Order"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS OVERLAY ── */}
      {paid && payData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(14,11,22,0.95)", backdropFilter: "blur(10px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
          <div style={{ background: "var(--surface)", borderRadius: "24px", padding: "48px 36px", width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 40px 80px -20px rgba(0,201,167,0.3)", border: "1px solid rgba(0,201,167,0.15)" }}>

            {/* Success icon */}
            <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(0,201,167,0.12)", border: "2px solid rgba(0,201,167,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.8rem", fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em", marginBottom: "8px" }}>Order Confirmed!</h2>
            <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "16px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-heading)" }}>
              Order #{payData.orderId.slice(-8)}
            </p>
            <p style={{ color: "var(--muted)", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
              We'll ship your earphones soon! Check your email for tracking details.
            </p>

            <div style={{ padding: "16px", background: "rgba(0,201,167,0.06)", borderRadius: "12px", border: "1px solid rgba(0,201,167,0.12)", marginBottom: "28px" }}>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginBottom: "4px" }}>Delivering to</p>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)" }}>{name}</p>
              <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>{city}, {state} — {pin}</p>
            </div>

            <button
              onClick={() => router.push('/')}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
              onMouseDown={e => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={e => (e.currentTarget.style.transform = "scale(1.02)")}
              style={{ padding: "14px 40px", borderRadius: "12px", border: "none", background: "var(--accent)", color: "#0E0B16", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "15px", cursor: "pointer", transition: "transform 0.15s ease", letterSpacing: "0.02em", boxShadow: "0 10px 30px -10px rgba(0,201,167,0.5)" }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}