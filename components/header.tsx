
import type { NextPage } from "next";
import Link from "next/link";
import * as gtag from "../analytic/gtag";

interface Props {
  title?: string;
  share?: boolean;
}

const Header: NextPage<Props> = (props) => {
  return (
    <header className="header">
      <h1 className="title">{props.title}</h1>
      {/* Icon removed completely */}
    </header>
  );
};

export default Header;
