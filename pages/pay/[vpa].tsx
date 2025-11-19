import type { NextPage } from "next";
import QRCode from "react-qr-code";
import { useRouter } from "next/router";
import { useState } from "react";
import Footer from "../../components/footer";
import Header from "../../components/header";
import Meta from "../../components/meta";
import * as gtag from "../../analytic/gtag";

const Pay: NextPage = () => {
  const router = useRouter();
  const [utr, setUtr] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const deeplink = `upi://pay?pn=withUpier&pa=${
    router.query.vpa
  }&cu=INR${
    router.query.am
      ? `&am=${
          router.query.am.includes(".")
            ? router.query.am
            : `${router.query.am}.0`
        }`
      : ""
  }`;

  const submitUTR = async () => {
    if (!utr || utr.length < 8) {
      setMessage("❌ Please enter a valid UTR number.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/verify-utr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          utr,
          amount: router.query.am,
          vpa: router.query.vpa,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setMessage("✅ UTR submitted successfully. Payment under verification.");
      } else {
        setMessage(`❌ ${data.message || "Verification failed"}`);
      }
    } catch (error) {
      setLoading(false);
      setMessage("❌ Something went wrong. Try again.");
    }
  };

  return (
    <>
      <Meta title="Pay | Upier" />
      <main>
        <Header title="Pay" />
        <section className="content pay">
          <QRCode value={deeplink} className="qrsvg" size={200} />
          <p className="computerprompt">
            If you are in PC Scan It with any UPI App to Pay
          </p>

          <p className="payingtext">
            You are paying{router.query.am ? ` ₹ ${router.query.am}` : ""}
          </p>
          <p className="payingtext">to</p>
          <p className="payingtext vpatext">{router.query.vpa}</p>

          <div className="center">
            <a
              href={deeplink}
              target="_blank"
              rel="noopener noreferrer"
              className="paybutton"
              onClick={() => {
                gtag.event({
                  action: "clicked_pay_button",
                  category: "engagement",
                  label: `Vpa: ${router.query.vpa} - Amount: ${
                    router.query.am || "null"
                  }`,
                  value: `Clicked on Deep Link by user`,
                });
              }}
            >
              P A Y
            </a>
          </div>

          {/* --- UTR SUBMISSION FORM --- */}
          <div className="utr-box" style={{ marginTop: "40px", textAlign: "center" }}>
            <h3 style={{ fontWeight: 600, marginBottom: "10px" }}>
              Enter UTR / Transaction ID
            </h3>

            <input
              type="text"
              placeholder="Ex: 324553245543"
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              className="utr-input"
              style={{
                padding: "12px",
                width: "80%",
                border: "1px solid #ccc",
                borderRadius: "8px",
                marginBottom: "15px",
                fontSize: "16px",
              }}
            />

            <button
              onClick={submitUTR}
              disabled={loading}
              className="utr-submit"
              style={{
                padding: "12px 30px",
                background: "#000",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {loading ? "Submitting..." : "Submit UTR"}
            </button>

            {message && (
              <p style={{ marginTop: "15px", fontWeight: 500 }}>{message}</p>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Pay;
