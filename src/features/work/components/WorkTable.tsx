import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/@/components/ui/table";
import { api } from "~/utils/api";
import { WorkActions } from "./WorkActions";
import {
  CheckCircledIcon,
  LapTimerIcon,
  ValueIcon,
  ValueNoneIcon,
} from "@radix-ui/react-icons";

function truncateString(str: string, len: number) {
  if (str.length <= len) {
    return str;
  }
  return str.slice(0, len) + "...";
}

export function WorkTable() {
  const { data: works } = api.work.getAll.useQuery(undefined, {
    refetchInterval: 1000,
  });
  const { mutate: cancelWork } = api.work.cancel.useMutation();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[150px]">Id</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Prompt</TableHead>
          <TableHead className="text-right">Created at</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {works?.map((work) => (
          <TableRow key={work.id}>
            <TableCell className="font-medium">
              {truncateString(work.id, 8)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {
                  {
                    waiting: <ValueIcon />,
                    in_progress: <LapTimerIcon />,
                    done: <CheckCircledIcon />,
                    error: <ValueNoneIcon />,
                  }[work.status]
                }
                <span>{work.status}</span>
              </div>
            </TableCell>
            <TableCell>{truncateString(work.prompt, 32)}</TableCell>
            <TableCell className="text-right">
              {work.createdAt?.toLocaleString("pl")}
            </TableCell>
            <TableCell>
              <WorkActions
                canCancel={work.status !== "done" && work.status !== "error"}
                canListen={work.status === "done"}
                onCancel={() => cancelWork({ id: work.id })}
                onListen={() => window.open(`/${work.id}.wav`, "_blank")}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
