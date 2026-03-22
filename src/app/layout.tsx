import type { Metadata } from "next";
import "./globals.css";
import { AuthWrapper } from "@/components/AuthWrapper";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ModalProvider } from "@/components/ModalProvider";

export const metadata: Metadata = {
  title: "Quill - Organize Your Developer Notes",
  description:
    "A beautiful notes app for developers to organize and manage notes by skills",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthWrapper>
          <ModalProvider />
          <ToastContainer />
          {children}
        </AuthWrapper>
      </body>
    </html>
  );
}
