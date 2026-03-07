import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: "Read BCBP",
  description: "Read IATA Bar Coded Boarding Pass (BCBP) information",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="govuk-template">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0b0c0c" />
        <link rel="stylesheet" href={`${basePath}/govuk-frontend.min.css`} />
      </head>
      <body className="govuk-template__body js-enabled govuk-frontend-supported">

        <a href="#main-content" className="govuk-skip-link" data-module="govuk-skip-link">
          Skip to main content
        </a>

        <header className="govuk-header" role="banner" data-module="govuk-header">
          <div className="govuk-header__container govuk-width-container">
            <div className="govuk-header__content" style={{ paddingLeft: 0 }}>
              <Link href="/" className="govuk-header__link govuk-header__service-name">
                Read BCBP
              </Link>
            </div>
          </div>
        </header>

        <div className="govuk-width-container">
          <div className="govuk-phase-banner" role="complementary">
            <p className="govuk-phase-banner__content">
              <strong className="govuk-tag govuk-phase-banner__content__tag">
                Beta
              </strong>
              <span className="govuk-phase-banner__text">
                This is a new service. Help us improve it and <a className="govuk-link" href="https://github.com/jqssun/iata-web/pulls" target="_blank">send your improvements</a>.
              </span>
            </p>
          </div>
          <main className="govuk-main-wrapper" id="main-content" role="main">
            {children}
          </main>
        </div>

        <footer className="govuk-footer" role="contentinfo">
          <div className="govuk-width-container">
            <div className="govuk-footer__meta">
              <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                <h2 className="govuk-visually-hidden">Support links</h2>
                <ul className="govuk-footer__inline-list">
                  <li className="govuk-footer__inline-list-item">
                    <a className="govuk-footer__link" href={`${basePath}/`}>
                      Help
                    </a>
                  </li>
                  <li className="govuk-footer__inline-list-item">
                    <a className="govuk-footer__link" href="https://github.com/jqssun/iata-api">
                      Project
                    </a>
                  </li>
                </ul>

                <span className="govuk-footer__licence-description">
                  This service is an independent reference implementation for reading Bar Coded Boarding Pass (BCBP) data in accordance with <a className="govuk-footer__link" href="https://www.iata.org/en/programs/passenger/common-use/" target="_blank" rel="noopener noreferrer">IATA Resolution 792</a>. No personal data is stored or retained.
                  <br /><br />
                  This project is free and open source. Barcode scanner based on <a className="govuk-footer__link" href="https://github.com/zxing-js/browser" target="_blank" rel="noopener noreferrer">ZXing (&ldquo;zebra crossing&rdquo;)</a>. Font is <a className="govuk-footer__link" href="https://www.k-type.com/fonts/transport-new/" target="_blank" rel="noopener noreferrer">Transport New</a>.
                  Site design using the{" "}
                  <a
                    className="govuk-footer__link"
                    href="https://github.com/alphagov/govuk-frontend"
                  >
                    GOV.UK Design System
                  </a>
                  , under the terms of the{" "}
                  <a
                    className="govuk-footer__link"
                    href="https://github.com/alphagov/govuk-frontend/blob/main/LICENSE.txt"
                  >
                    MIT License
                  </a>
                  .
                </span>
              </div>
              <div className="govuk-footer__meta-item">
                <a
                  className="govuk-footer__link govuk-footer__copyright-logo"
                  href="https://github.com/jqssun"
                >
                  &copy; jqssun
                </a>
              </div>
            </div>
          </div>
        </footer>

        <Script src={`${basePath}/govuk-frontend.min.js`} strategy="afterInteractive" />
        <Script id="govuk-init" strategy="afterInteractive">
          {`
            if (window.GOVUKFrontend) {
              window.GOVUKFrontend.initAll();
            }
          `}
        </Script>
      </body>
    </html>
  );
}
