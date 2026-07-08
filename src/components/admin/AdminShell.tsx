"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

type AdminShellProps = {
  adminName: string;
  adminEmail: string;
  children: ReactNode;
};

export default function AdminShell({
  adminName,
  adminEmail,
  children,
}: AdminShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-50">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex min-h-screen flex-1 flex-col">
        <AdminTopbar
          adminName={adminName}
          adminEmail={adminEmail}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
