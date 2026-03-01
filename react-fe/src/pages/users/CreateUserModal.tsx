import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/formfields/FormInput";
import { Button } from "@/components/ui/button";
import { useUserService } from "@/hooks/use-user-service";
import { useEffect } from "react";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email"),
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

type CreateUserModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function CreateUserModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateUserModalProps) {
  const userService = useUserService();

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: CreateUserFormValues) {
    form.clearErrors();
    const valid = await form.trigger();
    if (!valid) return;
    try {
      await userService.createUser(values.name, values.email);
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create user";
      if (/email|already exists/i.test(message)) {
        form.setError("email", { type: "server", message });
      } else {
        form.setError("name", { type: "server", message });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create user</DialogTitle>
          <DialogDescription>
            Add a new user. Name and email are required.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput<CreateUserFormValues>
              control={form.control}
              name="name"
              label="Name"
              placeholder="Jane Doe"
            />
            <FormInput<CreateUserFormValues>
              control={form.control}
              name="email"
              label="Email"
              type="email"
              placeholder="jane@example.com"
              autoComplete="email"
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
