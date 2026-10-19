import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Panel del comité", template: "%s · Panel OMICHH" },
  robots: { index: false, follow: false },
};

export default function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  return <div className="flex min-h-full flex-1 flex-col">{children}</div>;
}
