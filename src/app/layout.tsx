import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ModalProvider } from "@/components/ModalProvider";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { getServerUser } from "@/lib/serverAuth";

export const metadata: Metadata = {
  title: "Quill - Organize Your Developer Notes",
  description:
    "A beautiful notes app for developers to organize and manage notes by skills",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken } = await getServerUser();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ReactQueryProvider>
          <AuthProvider initialUser={user} initialToken={accessToken}>
            <ModalProvider />
            <ToastContainer />
            {children}
          </AuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
