import { useEffect } from "react";
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
import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useShiftService } from "@/hooks/use-shift-service";
import { useRolesQuery } from "@/hooks/use-roles-query";
import { dayKey } from "@/lib/date-utils";
import { Plus, Trash2 } from "lucide-react";
import type { Shift } from "@/graphql/types";

const editShiftSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    date: z.string().min(1, "Pick a date"),
    startTime: z.string().min(1, "Start time required"),
    endTime: z.string().min(1, "End time required"),
    requiredRoles: z
      .array(z.object({ roleId: z.string(), count: z.number().min(1) }))
      .min(1, "Add at least one role"),
  })
  .refine(
    (data) => {
      const [sh, sm] = data.startTime.split(":").map(Number);
      const [eh, em] = data.endTime.split(":").map(Number);
      return eh > sh || (eh === sh && em > sm);
    },
    { message: "End time must be after start time", path: ["endTime"] }
  );

type EditShiftFormValues = z.infer<typeof editShiftSchema>;

function toISO(dateStr: string, timeStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [h, min] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, h, min).toISOString();
}

function shiftToFormValues(shift: Shift): EditShiftFormValues {
  const start = new Date(shift.startDateTime);
  const end = new Date(shift.endDateTime);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    name: shift.name,
    date: dayKey(start),
    startTime: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
    endTime: `${pad(end.getHours())}:${pad(end.getMinutes())}`,
    requiredRoles: shift.requiredRoles.map((r) => ({
      roleId: r.role.id,
      count: r.count,
    })),
  };
}

type EditShiftModalProps = {
  shift: Shift | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export function EditShiftModal({
  shift,
  open,
  onOpenChange,
  onSuccess,
}: EditShiftModalProps) {
  const shiftService = useShiftService();
  const { roles } = useRolesQuery();

  const form = useForm<EditShiftFormValues>({
    resolver: zodResolver(editShiftSchema),
    defaultValues: {
      name: "",
      date: "",
      startTime: "08:00",
      endTime: "16:00",
      requiredRoles: [{ roleId: "", count: 1 }],
    },
  });

  useEffect(() => {
    if (open && shift) {
      form.reset(shiftToFormValues(shift));
    }
  }, [open, shift, form]);

  const requiredRoles = form.watch("requiredRoles");

  function addRole() {
    form.setValue("requiredRoles", [
      ...requiredRoles,
      { roleId: roles[0]?.id ?? "", count: 1 },
    ]);
  }

  function removeRole(index: number) {
    const next = requiredRoles.filter((_, i) => i !== index);
    form.setValue("requiredRoles", next.length ? next : [{ roleId: "", count: 1 }]);
  }

  async function onSubmit(values: EditShiftFormValues) {
    if (!shift) return;
    form.clearErrors();
    const valid = await form.trigger();
    if (!valid) return;
    const filtered = values.requiredRoles.filter((r) => r.roleId && r.count > 0);
    if (filtered.length === 0) {
      form.setError("requiredRoles", { type: "manual", message: "Add at least one role" });
      return;
    }
    try {
      await shiftService.updateShift(shift.id, {
        name: values.name,
        startDateTime: toISO(values.date, values.startTime),
        endDateTime: toISO(values.date, values.endTime),
        requiredRoles: filtered.map((r) => ({ roleId: r.roleId, count: r.count })),
      });
      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update shift";
      form.setError("name", { type: "server", message });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit shift</DialogTitle>
          <DialogDescription>
            Update the shift name, time range, and required roles.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput<EditShiftFormValues>
              control={form.control}
              name="name"
              label="Name"
              placeholder="e.g. Morning Ward"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormField
              control={form.control}
              name="requiredRoles"
              render={() => (
                <FormItem>
                  <FormLabel>Required roles</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              {requiredRoles.map((_, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <FormField
                    control={form.control}
                    name={`requiredRoles.${index}.roleId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`requiredRoles.${index}.count`}
                    render={({ field }) => (
                      <FormItem className="w-20">
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            placeholder="#"
                            value={field.value != null ? field.value : ""}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber || 0)
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => removeRole(index)}
                    disabled={requiredRoles.length <= 1}
                    aria-label="Remove role"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addRole}>
                <Plus className="size-4" />
                Add role
              </Button>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
