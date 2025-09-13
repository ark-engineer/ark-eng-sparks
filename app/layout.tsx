import React from "react";
import { Metadata } from "next";
import { cn } from "@/lib/utils";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

export const metadata: Metadata = {
  title: "gr-ae | Home ",
  description:
    "A premissa das nossas empresas é a concepção coletiva. Acreditamos nas virtudes do cruzamento de ideias e no entusiasmo do conhecimento compartilhado.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          as="image"
          href="/uploads/animation/hub.png"
        />
        <link
          rel="preload"
          as="image"
          href="/uploads/animation/monochrome-animation-compressed.gif"
        />
      </head>
      <body className={cn("min-h-screen bg-background antialiased")}>
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
      </body>
    </html>
  );
}
