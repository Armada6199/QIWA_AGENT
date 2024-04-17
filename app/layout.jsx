"use client";
import "../styles/styles.css";
import Providers from "./components/Providers";
import Header from "./components/layout/Header";
function layout({ children }) {
  return (
    <html>
      <head></head>
      <body>
        <Providers>
          <Header />
          {children}
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}

export default layout;
