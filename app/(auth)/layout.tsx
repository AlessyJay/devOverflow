import React from "react";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <main className="flex min-h-screen w-full items-center justify-center">
        {children}
      </main>
    </html>
  );
}
