import { useAtomValue } from "jotai";
import Link from "next/link";
import Hero from "~/design-system/Hero";
import { Button } from "~/design-system/components/ui/button";
import { tokenAtom } from "~/utils/api";

export default function Home() {
  const isConnected = Boolean(useAtomValue(tokenAtom));
  return (
    <div className="flex flex-1 flex-row items-center gap-16">
      <div className="flex max-w-xl flex-col items-start gap-4">
        <h1 className="text-6xl">Generate music on the Golem Network</h1>
        <p className="text-golem-black text-xl font-normal ">
          {`Create music with Meta's MusicGen AI, a text to music generator, powered by the decentralized Golem Network. Start crafting your unique sound and support a fair internet today.`}
        </p>
        {isConnected ? (
          <Button asChild>
            <Link href="/create-new">Start creating</Link>
          </Button>
        ) : (
          <Button disabled>Sign in to start creating</Button>
        )}
      </div>
      <Hero height={400} />
    </div>
  );
}
