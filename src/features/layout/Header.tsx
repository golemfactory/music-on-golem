import { ConnectButton } from "~/features/auth/ConnectButton";
import Navigation from "./Navigation";

export default function Header() {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <Navigation />
      <ConnectButton />
    </header>
  );
}
