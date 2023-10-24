import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "~/@/components/ui/dropdown-menu";
import { Button } from "~/@/components/ui/button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

type WorkActionsProps = {
  canListen: boolean;
  onListen: () => void;
  canCancel: boolean;
  onCancel: () => void;
};

export function WorkActions({
  canListen,
  onListen,
  canCancel,
  onCancel,
}: WorkActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="dark w-[160px]">
        <DropdownMenuItem
          disabled={!canListen}
          onSelect={onListen}
          className="cursor-pointer"
        >
          Listen
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!canCancel}
          onSelect={onCancel}
          className="cursor-pointer"
        >
          Cancel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
