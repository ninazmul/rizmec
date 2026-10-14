import { Metadata } from "next";
import MaintenanceClient from "./MaintenanceClient";

export const metadata: Metadata = {
  title: "Under Maintenance | RIZMEC",
  description:
    "RIZMEC is currently under maintenance. We'll be back shortly.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function MaintenancePage() {
  return <MaintenanceClient />;
}
