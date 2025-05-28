"use client";
import queryClient from "../config/queryClient";
import { setNavigate } from "../lib/navigation";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  setNavigate((route: string) => router.push(route));
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools position="bottom" initialIsOpen={false} />
        </QueryClientProvider>
      </body>
    </html>
  );
}
