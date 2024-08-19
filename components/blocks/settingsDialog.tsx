"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import persister from "@/lib/persister";
import { yupResolver } from "@hookform/resolvers/yup";
import { GearIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useToast } from "../ui/use-toast";

const gptModels = [
  {
    label: "GPT 3.5 Turbo",
    value: "gpt-3.5-turbo",
    description: "Fast, Cheap, and Good Enough",
  },
  {
    label: "GPT 4",
    value: "gpt-4",
    description: "Slow, Expensive, and Great",
  },
];
const settingsShape = yup.object().shape({
  apiKey: yup.string().required(),
  orgId: yup.string().required(),
  model: yup
    .string()
    .required()
    .oneOf(gptModels.map((m) => m.value)),
});

export function SettingsDialog() {
  const { toast } = useToast();
  const settingsValues = persister.get("settings");
  const form = useForm({
    defaultValues: { ...settingsValues },
    resolver: yupResolver(settingsShape),
  });

  const handleSave = async (data: any) => {
    console.log({data});
    persister.set("settings", data);
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

  const renderTextInput = (
    name: string,
    label: string,
    placeHolder: string
  ) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem className="grid grid-cols-4 items-center gap-4">
            <FormLabel>{label}</FormLabel>
            <FormControl className="col-span-3">
              <Input placeholder={placeHolder} {...field} />
            </FormControl>
            <FormMessage className="col-span-3" />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <GearIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)}>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Click [Save] to persist your changes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {renderTextInput("apiKey", "API Key", "Open AI API Keys")}
              {renderTextInput("orgId", "Org ID", "Open AI Organization Id")}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel>GPT Model</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="col-span-3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a GPT model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gptModels.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            <div className="flex flex-col">
                              {model.label}
                              <small>{model.description}</small>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-3" />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
