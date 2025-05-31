"use client";

import useAuth from "@/hooks/useAuth";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  return <main className="min-h-screen">{children}</main>;
}
