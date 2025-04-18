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
    <Card className="mb-8 shadow-md">
      <CardContent className="p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            SEO Analyzer
          </h2>
          <p className="text-slate-600">
            Enter any website URL to analyze its SEO meta tags and preview social media appearance
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <LinkIcon className="h-5 w-5 text-primary" />
                            </div>
                            <Input
                              id="urlInput"
                              placeholder="https://example.com"
                              className="pl-12 py-6 text-lg rounded-lg shadow-sm border-slate-300 focus:border-primary"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-center mt-2" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 py-6 px-8 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg min-w-[150px] text-lg font-medium"
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
              <div className="flex justify-center">
                <p className="text-sm text-slate-500 max-w-lg text-center">
                  Enter the full URL including https:// to analyze meta tags, social media previews, and get SEO recommendations
                </p>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
