import { useAtomValue } from "jotai";
import Head from "next/head";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/@/components/ui/card";
import { ConnectButton } from "~/features/auth/components/ConnectButton";
import { NewWorkButton } from "~/features/work/components/NewWork";
import { WorkTable } from "~/features/work/components/WorkTable";
import { tokenAtom } from "~/utils/api";

export default function Home() {
  const isConnected = Boolean(useAtomValue(tokenAtom));
  return (
    <div className="dark flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <Head>
        <title>Make music on golem</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex items-center justify-between border-b p-4">
        <h2 className="text-3xl font-bold tracking-tight">
          Make music on Golem
        </h2>
        <ConnectButton />
      </header>
      <main className="flex flex-1 flex-col items-center justify-center">
        <Card className="max-h-[600px] w-[64rem] overflow-y-auto">
          {!isConnected ? (
            <CardHeader>
              <CardTitle>
                Please connect your MetaMask wallet to start creating on Golem
              </CardTitle>
            </CardHeader>
          ) : (
            <CardContent>
              <CardHeader>
                <CardTitle className="flex flex-row justify-between">
                  <span>{`Work history`}</span>
                  <NewWorkButton />
                </CardTitle>
              </CardHeader>
              <WorkTable />
            </CardContent>
          )}
        </Card>
      </main>
    </div>
  );
}
