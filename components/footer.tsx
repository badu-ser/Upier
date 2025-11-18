import type { NextPage } from "next";
import Link from "next/link";

const Footer: NextPage = () => {
  return (
    <footer className="footer">
      <h1 className="logo">X4 ESPORTS</h1>
      <p className="slogan">
        X4 eSports Payment&apos;s Link for{" "}
        <img
          src="/images/upi.svg"
          className="upilogo"
          width="40"
          alt="Upi Icon"
        />
      </p>
      <p className="tpf">
        <Link href={"https://x4-esports-official.vercel.app/privacy.html"} passHref>
          <u>Privacy Policy</u>
        </Link>
      </p>
      <p className="tuhin">
        A Payment page by{" "}
        <a
          href="http://thetuhin.com/?ref=upier"
          target="_blank"
          rel="noreferrer"
        >
          X4 eSports India 🇮🇳
        </a>
      </p>
      <img
        src="https://files.catbox.moe/kilmh9.jpeg"
        className="center"
        width="35"
        alt="X4 eSports Website"
      />
    </footer>
  );
};

export default Footer;
