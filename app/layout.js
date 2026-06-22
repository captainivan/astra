import { Bebas_Neue, Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const getBebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas"
});

const getPlusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-jakarta"
})

export const metadata = {
  title: "Astra | Movies & TV Series",
  description:
    "Discover movies and TV series with Astra, a sleek cinematic streaming UI experience.",
  manifest: "/manifest.json",
  themeColor: "#7C3AED",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${getBebasNeue.variable} ${getPlusJakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
