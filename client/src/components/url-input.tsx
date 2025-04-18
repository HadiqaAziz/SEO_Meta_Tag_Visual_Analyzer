import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Link as LinkIcon } from "lucide-react";

// URL validation schema
const urlSchema = z.object({
  url: z
    .string()
    .url("Please enter a valid URL")
    .regex(/^https?:\/\/.+/, "URL must start with http:// or https://"),
});

type FormValues = z.infer<typeof urlSchema>;

interface URLInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export default function URLInput({ onAnalyze, isLoading }: URLInputProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    onAnalyze(values.url);
  };

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="urlInput" className="block text-sm font-medium text-slate-700">
                Website URL to analyze
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <LinkIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <Input
                              id="urlInput"
                              placeholder="https://example.com"
                              className="pl-10 py-3"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark py-3 px-6 rounded-md transition-colors min-w-[150px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-slate-500">
                Enter the full URL including https:// (example: https://www.example.com)
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
