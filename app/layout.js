import "./globals.css";
import { Shrikhand, Kaushan_Script, Karla } from "next/font/google";
import Splash from "./splash";

const shrikhand = Shrikhand({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});
const kaushan = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});
const karla = Karla({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "BuzzRecs — Chicago Happy Hours",
  description:
    "The insider's guide to Chicago happy hours: times, deals, menus, and reservations in one place.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${shrikhand.variable} ${kaushan.variable} ${karla.variable}`}
    >
      <body>
        <Splash />
        {children}
      </body>
    </html>
  );
}
