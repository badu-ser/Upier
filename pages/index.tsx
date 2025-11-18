import type { NextPage } from "next";
import Link from "next/link";
import { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Meta from "../components/meta";
import * as gtag from "../analytic/gtag";

interface Input {
  vpa: string;
  amount: any;
}

interface Invalid {
  show: boolean;
  text: string;
}

interface Generated {
  show: boolean;
  url: string;
}

const Index: NextPage = () => {
  // -------------------------
  // 🔐 PASSCODE SECURITY
  // -------------------------
  const [auth, setAuth] = useState(false);
  const [code, setCode] = useState("");

  function verify() {
    const PASSCODE = "1234"; // ⬅ change your passcode here

    if (code === PASSCODE) {
      sessionStorage.setItem("upier_access", "granted");
      setAuth(true);
    } else {
      alert("Wrong Passcode!");
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("upier_access") === "granted") {
      setAuth(true);
    }
  }, []);

  // -------------------------
  // ORIGINAL APP LOGIC
  // -------------------------
  const [input, setinput] = useState<Input>({
    vpa: "",
    amount: "",
  });

  const [invalid, setinvalid] = useState<Invalid>({
    show: false,
    text: "",
  });

  const [generated, setgenerated] = useState<Generated>({
    show: false,
    url: "",
  });

  const [copied, setcopied] = useState<boolean>(false);

  function generate() {
    const vpa: string = input.vpa;
    const amount: any = input.amount;

    if (vpa && vpa !== "" && vpa.includes("@")) {
      setgenerated({
        show: true,
        url: `${window.location.protocol}//${
          window.location.hostname
        }/pay/${vpa}${amount && amount > 0 ? "?am=" + amount : ""}`,
      });
      gtag.event({
        action: "create_payment_link",
        category: "engagement",
        label: `Vpa: ${vpa} - Amount: ${amount || "null"}`,
        value: `Created payment Deep Link by user`,
      });
    } else {
      setinvalid({
        show: true,
        text: !vpa || vpa === "" ? "* Enter an UPI Id" : "* Invalid UPI Id",
      });
    }
  }

  function copy() {
    const url: string = generated.url;
    navigator.clipboard.writeText(url);
    setcopied(true);
  }

  // -------------------------
  // SHOW PASSCODE SCREEN FIRST
  // -------------------------
  if (!auth) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#f9fafb",
          padding: "20px"
        }}
      >
        <h2 style={{ fontSize: "24px", marginBottom: "20px", fontWeight: "600" }}>
          Enter Passcode
        </h2>

        <input
          type="password"
          placeholder="****"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{
            padding: "12px 15px",
            fontSize: "18px",
            textAlign: "center",
            width: "150px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            marginBottom: "15px",
          }}
        />

        <button
          onClick={verify}
          style={{
            background: "#000",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "8px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          U N L O C K
        </button>
      </main>
    );
  }

  // -------------------------
  // NORMAL APP UI AFTER PASSCODE
  // -------------------------
  return (
    <>
      <Meta title="Create | Upier" />
      <main>
        <Header title="Create" share={true} />
        <section className="content">
          <h1 className="heading">Create Shareable Link for UPI Payment</h1>

          {!generated.show ? (
            <>
              {/* Generate section start */}
              <div className="generate">
                <div className="center">
                  <p className="pdetailupiid">Enter Your VPA (UPI ID)</p>
                  <input
                    type="text"
                    placeholder="UPI ID"
                    className="inputbox"
                    onChange={(e) =>
                      setinput({ ...input, vpa: e.target.value })
                    }
                    value={input.vpa}
                  />
                </div>

                <div className="amountdiv">
                  <p className="pdetailamount">
                    Amount ={" "}
                    <input
                      type="number"
                      placeholder="₹"
                      className="amountbox"
                      onChange={(e) =>
                        setinput({ ...input, amount: e.target.value })
                      }
                      value={input.amount}
                    />
                    {" ₹"}
                  </p>
                  <p className="vsmalltext">(Optional)</p>
                </div>

                <div className="center">
                  <button className="createbutton" onClick={generate}>
                    C R E A T E
                  </button>
                  {invalid.show && (
                    <p className="invalidtext">{invalid.text}</p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Generated section start */}
              <div className="generate">
                <p className="paymentlinktxt">
                  Send this link to Recieve Payment
                </p>
                <div className="center">
                  <input
                    type="text"
                    value={generated.url}
                    readOnly
                    className="inputbox"
                  />
                  <p className="copied">
                    {copied ? "Copied 👍" : "Click copy to copy url 🔗"}
                  </p>
                  <a className="createbutton" onClick={copy}>
                    C O P Y
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Additional data */}
          <div className="additionaldata">
            <p className="additionaltext">
              If you have any questions about security or privacy, Check our{" "}
              <Link href="/tos">TOS</Link>. You can also check this{" "}
              <a href="https://github.com/cachecleanerjeet/Upier">
                Open Source Project
              </a>{" "}
              to know how this system works.
            </p>
            <p className="hashtag"># Go Cashless</p>
            <p className="india">Made in 🇮🇳 for 🇮🇳</p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Index;
