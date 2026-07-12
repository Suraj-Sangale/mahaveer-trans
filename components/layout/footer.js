import React from "react";
import styles from "@/styles/homeWrapper.module.css";
import Link from "next/link";
import { getConstant } from "../../utilities/utils";

export default function Footer() {
  const cx = (...args) => {
    return args
      .flat()
      .filter(Boolean)
      .map((str) =>
        String(str)
          .trim()
          .split(/\s+/)
          .map((c) => styles[c] || c)
          .join(" "),
      )
      .join(" ");
  };
  const footer = {
    logo: getConstant("company_name_short"),
    tagline:
      "Delivering the world's goods with precision and care. Your trusted logistics partner since 1999.",
    socials: [
      { label: "in", url: "#" },
      { label: "tw", url: "#" },
      { label: "yt", url: "#" },
      { label: "ig", url: "#" },
    ],
    columns: [
      {
        heading: "Services",
        links: [
          { label: "Air Freight", href: "/" },
          { label: "Sea Freight", href: "/" },
          { label: "Road Transport", href: "/" },
          { label: "Warehousing", href: "/" },
          { label: "Cold Chain", href: "/" },
          { label: "Customs", href: "/" },
        ],
      },
      {
        heading: "Company",
        links: [
          { label: "About Us", href: "/" },
          { label: "Careers", href: "/" },
          { label: "Sustainability", href: "/" },
          { label: "Press", href: "/" },
          { label: "Contact", href: "/" },
        ],
      },
      {
        heading: "Contact",
        links: [
          { label: `📍 ${getConstant("company_address")}`, href: "#"},
          { label: `📞 ${getConstant("contact_no_display")}`, href: `tel:${getConstant("contact_no")}`},
          { label: `✉️ ${getConstant("company_email")}`, href: `mailto:${getConstant("company_email")}`},
          { label: `🌐 ${getConstant("company_website")}`, href: "#"},
        ],
      },
    ],
    copyright: getConstant("company_copyright"),
    legal: "Privacy · Terms · Sitemap",
  };
  return (
    <footer>
      <div className={cx("f-top")}>
        <div className={cx("f-brand")}>
          <span className={cx("f-brand-logo")}>{footer.logo}</span>
          <p>{footer.tagline}</p>
          <div className={cx("f-socs")}>
            {footer.socials.map((s, i) => (
              <a key={i} href={s.url} className={cx("f-soc")}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
        {footer.columns.map((col, i) => (
          <div key={i} className={cx("f-col")}>
            <h4>{col.heading}</h4>
            <ul className={cx("f-links")}>
              {col.links.map(({label, href}, j) => (
                <li key={j}>
                  <a href={href}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className={cx("f-bottom")}>
        <p>{footer.copyright}</p>
        <p>{footer.legal}</p>
      </div>
    </footer>
  );
}
