import { useState } from "react";
import { Button } from "~/@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/@/components/ui/dialog";
import { Input } from "~/@/components/ui/input";
import { Label } from "~/@/components/ui/label";
import { api } from "~/utils/api";

export function NewWorkButton() {
  const { mutateAsync, status } = api.work.create.useMutation();
  const [prompt, setPrompt] = useState("EDM podcast intro");

  if (status === "loading") {
    return <Button disabled>Creating...</Button>;
  }

  if (status === "error") {
    return <Button disabled>Failed to create</Button>;
  }

  const onClick = async () => {
    try {
      await mutateAsync({ prompt });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button> {status === "success" ? "Create another" : "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="dark text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new work</DialogTitle>
          <DialogDescription>
            {
              "Just type in a prompt and we'll generate a new work for you. Need some inspiration? Try "
            }
            <span
              className="cursor-pointer text-primary"
              onClick={() => setPrompt("80s synthwave with a dark vibe")}
            >
              {'"80s synthwave with a dark vibe"'}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="name" className="text-right ">
              Prompt
            </Label>
            <Input
              id="name"
              className="col-span-5"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => void onClick()}>
            Start work
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
