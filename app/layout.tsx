import type { Metadata } from "next";
import { Archivo_Black, Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const archivo = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Auroville — A Place Still Becoming",
  description: "An interactive editorial digital publication and architectural exhibition of Auroville.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${manrope.variable}`}
    >
      <body className="bg-paper text-ink font-sans antialiased selection:bg-terracotta selection:text-paper-light overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
