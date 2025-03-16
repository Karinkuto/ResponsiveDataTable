import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <Main />
        <NextScript />
        <Script
          src="//unpkg.com/react-scan/dist/auto.global.js"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </Html>
  );
}
