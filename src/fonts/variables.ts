import localFont from "next/font/local";
export const pretendardSans = localFont({
  src: [
    {
      path: "./PretendardVariable.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});
