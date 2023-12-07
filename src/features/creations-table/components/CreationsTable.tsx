import { api } from "~/utils/api";
import {
  CheckCircledIcon,
  LapTimerIcon,
  ValueIcon,
  ValueNoneIcon,
} from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/design-system/components/ui/card";
import { Button } from "~/design-system/components/ui/button";
import { useToast } from "~/design-system/components/ui/use-toast";

export function CreationsTable() {
  const { data: works } = api.work.getAll.useQuery(undefined, {
    refetchInterval: 1000,
  });
  const { mutateAsync } = api.work.cancel.useMutation();
  const { toast } = useToast();
  async function cancelWork(id: string) {
    try {
      await mutateAsync({ id });
      toast({
        title: "Success!",
        description: "Your song snippet has been canceled.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error!",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 2xl:grid-cols-3">
      {works?.map((work) => (
        <Card
          key={work.id}
          className="flex max-w-[500px] flex-col justify-between"
        >
          <CardHeader>
            <CardTitle>
              {
                {
                  waiting: (
                    <ValueIcon className="inline pr-1" height={32} width={32} />
                  ),
                  in_progress: (
                    <LapTimerIcon
                      className="inline pr-1"
                      height={32}
                      width={32}
                    />
                  ),
                  done: (
                    <CheckCircledIcon
                      className="inline pr-1"
                      height={32}
                      width={32}
                    />
                  ),
                  error: (
                    <ValueNoneIcon
                      className="inline pr-1"
                      height={32}
                      width={32}
                    />
                  ),
                }[work.status]
              }
              {work.prompt}
            </CardTitle>
            <CardDescription className="flex flex-row items-center gap-1">
              {work.createdAt?.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-normal text-golem-black">
              {{
                waiting:
                  "The work has been published to the Golem Network and is waiting for a provider to pick it up...",
                in_progress: "The work is being processed by a provider...",
                done: "The work has been completed successfully!",
                error:
                  "Something went wrong while processing the, please try again later.",
              }[work.status] || "Unknown status"}
            </p>
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-between">
            <audio
              controls
              src={work.status === "done" ? `/${work.id}.wav` : undefined}
            />
            {(work.status === "in_progress" || work.status === "waiting") && (
              <Button
                variant="destructive"
                onClick={() => void cancelWork(work.id)}
              >
                Cancel
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
