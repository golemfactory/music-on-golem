import { useAtomValue } from "jotai";
import { CreationsTable } from "~/features/creations-table/components/CreationsTable";
import { tokenAtom } from "~/utils/api";

export default function MyCreations() {
  const isConnected = Boolean(useAtomValue(tokenAtom));
  if (!isConnected)
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl font-semibold">You are not connected</h1>
        <p className="text-xl">
          Please connect your wallet to use this feature.
        </p>
      </div>
    );

  return (
    <div className="flex h-full w-full justify-center overflow-y-auto pt-16">
      <CreationsTable />
    </div>
  );
}
