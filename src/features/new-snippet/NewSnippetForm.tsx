import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/design-system/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "~/design-system/components/ui/form";
import { Textarea } from "~/design-system/components/ui/textarea";
import { useToast } from "~/design-system/components/ui/use-toast";
import { tokenAtom, api } from "~/utils/api";

export default function NewSnippetForm() {
  const FormSchema = z.object({
    prompt: z
      .string()
      .min(1, {
        message: "Required.",
      })
      .max(160, {
        message: "Prompt must not be longer than 160 characters.",
      }),
  });

  const isConnected = Boolean(useAtomValue(tokenAtom));
  const { toast } = useToast();
  const router = useRouter();

  const { mutateAsync, status } = api.snippet.create.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      await mutateAsync(data);
      toast({
        title: "Success!",
        description: "Your song snippet has been created.",
      });
      await router.push("/my-creations");
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
    <Form {...form}>
      <form
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl space-y-6"
      >
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create a new song snippet</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Your prompt goes here"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {`Just type in a prompt and we'll generate a 15 second song snippet for you.
                  Need some inspiration? Try `}
                <span
                  className="cursor-pointer text-primary"
                  onClick={() =>
                    form.setValue("prompt", "80s synthwave with a dark vibe")
                  }
                >
                  {'"80s synthwave with a dark vibe"'}
                </span>
                .
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isConnected ? (
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
          >
            Submit
          </Button>
        ) : (
          <Button disabled>Sign in to start creating</Button>
        )}
      </form>
    </Form>
  );
}
