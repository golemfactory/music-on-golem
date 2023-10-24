import { useAtom } from "jotai";
import { useState } from "react";
import { SiweMessage } from "siwe";
import { polygon } from "viem/chains";
import { useConnect, useDisconnect, useSignMessage, useAccount } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Button } from "~/@/components/ui/button";
import { api, tokenAtom } from "~/utils/api";

export function ConnectButton({
  onStateChange,
}: {
  onStateChange?: () => void;
}) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [token, setToken] = useAtom(tokenAtom);
  const login = api.example.login.useMutation();
  const nonce = api.example.nonce.useQuery(undefined, {
    enabled: false,
  });
  const { connectAsync, connectors } = useConnect({
    connector: new InjectedConnector({
      chains: [polygon],
    }),
  });
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { isConnected } = useAccount();

  const handleLogin = async () => {
    try {
      setIsConnecting(true);
      const { account } = await connectAsync({ connector: connectors[0]! });
      const nonceResponse = await nonce.refetch();
      const message = new SiweMessage({
        domain: window.location.host,
        address: account,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: polygon.id,
        nonce: nonceResponse.data?.nonce,
      });
      const messageHash = message.prepareMessage();
      const signature = await signMessageAsync({
        message: messageHash,
      });
      const token = await login.mutateAsync({
        message: messageHash,
        signature,
      });
      setToken(token.jwt);
    } catch (error) {
      disconnect();
      console.error(error);
    } finally {
      setIsConnecting(false);
      onStateChange?.();
    }
  };

  if (isConnecting) {
    return <Button disabled>Connecting...</Button>;
  }

  if (isConnected && token) {
    return (
      <Button
        onClick={() => {
          disconnect();
          setToken("");
          onStateChange?.();
        }}
      >
        Disconnect
      </Button>
    );
  }

  return (
    <Button
      onClick={(e) => {
        e.preventDefault();
        void handleLogin();
      }}
    >
      Sign-In with Ethereum
    </Button>
  );
}
