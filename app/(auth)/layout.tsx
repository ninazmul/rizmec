import { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
      <Toaster />
      <main className="w-full max-w-md flex justify-center items-center">
        {children}
      </main>
    </div>
  );
}
