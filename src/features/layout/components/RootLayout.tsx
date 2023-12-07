import Header from "./Header";
import Head from "next/head";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <Head>
        <title>Make music on golem</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center overflow-auto">
        {children}
      </main>
    </div>
  );
}
