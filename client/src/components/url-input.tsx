import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Link as LinkIcon, X, ExternalLink, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TooltipHelper from "@/components/ui/tooltip-helper";

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
  const [isFocused, setIsFocused] = useState(false);
  const [exampleUrls] = useState([
    "https://example.com",
    "https://yourwebsite.com",
    "https://shopsite.com/products",
    "https://blog.example.org/posts/seo-guide"
  ]);
  const [recentlyAnalyzed, setRecentlyAnalyzed] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    onAnalyze(values.url);
    
    // Save to recently analyzed if not already there
    if (!recentlyAnalyzed.includes(values.url)) {
      setRecentlyAnalyzed(prev => {
        const updated = [values.url, ...prev].slice(0, 3); // Keep only last 3
        return updated;
      });
    }
  };

  const handleClearInput = () => {
    form.setValue('url', '');
  };

  const handleSelectUrl = (url: string) => {
    form.setValue('url', url);
    // Close the dropdown
    setIsFocused(false);
  };
  
  const inputValue = form.watch('url');
  const hasValue = inputValue.length > 0;

  // Animation variants
  const labelVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6, type: "spring" } }
  };
  
  const popInVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.4, type: "spring", stiffness: 200 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mb-8 shadow-lg overflow-hidden border-slate-200">
        <CardContent className="p-8">
          <motion.div 
            className="text-center mb-8" 
            initial="initial" 
            animate="animate"
            variants={labelVariants}
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-3">
              SEO Meta Tag Analyzer
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Enter any website URL to analyze SEO meta tags and preview how your site appears on search engines and social media
            </p>
          </motion.div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              <motion.div 
                                className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                              >
                                <LinkIcon className="h-5 w-5 text-primary" />
                              </motion.div>
                              
                              <Input
                                id="urlInput"
                                placeholder="https://example.com"
                                className="pl-12 py-6 text-lg rounded-lg shadow-md border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                                onFocus={() => setIsFocused(true)}
                                {...field}
                                onBlur={(e) => {
                                  field.onBlur(e);
                                  // Delay to allow clicking on suggestions
                                  setTimeout(() => setIsFocused(false), 200);
                                }}
                              />
                              
                              {hasValue && (
                                <motion.button
                                  type="button"
                                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700"
                                  onClick={handleClearInput}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X className="h-5 w-5" />
                                </motion.button>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage className="text-center mt-2" />
                          
                          {/* Dropdown suggestions */}
                          <AnimatePresence>
                            {isFocused && (
                              <motion.div
                                className="absolute z-10 w-full bg-white mt-2 rounded-lg border border-slate-200 shadow-lg overflow-hidden"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                variants={popInVariants}
                              >
                                {recentlyAnalyzed.length > 0 && (
                                  <div className="p-2">
                                    <div className="flex items-center text-xs text-slate-500 px-3 py-2">
                                      <Clock className="h-3 w-3 mr-2" />
                                      <span>Recently analyzed</span>
                                    </div>
                                    {recentlyAnalyzed.map((url, idx) => (
                                      <motion.button
                                        key={`recent-${idx}`}
                                        type="button"
                                        className="flex items-center w-full px-3 py-2 text-left hover:bg-slate-50 rounded text-sm text-slate-700"
                                        onClick={() => handleSelectUrl(url)}
                                        whileHover={{ x: 5 }}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                                        {url}
                                      </motion.button>
                                    ))}
                                    <div className="border-t border-slate-100 my-1"></div>
                                  </div>
                                )}
                                
                                <div className="p-2">
                                  <div className="flex items-center text-xs text-slate-500 px-3 py-2">
                                    <span>Examples</span>
                                  </div>
                                  {exampleUrls.map((url, idx) => (
                                    <motion.button
                                      key={`example-${idx}`}
                                      type="button"
                                      className="flex items-center w-full px-3 py-2 text-left hover:bg-slate-50 rounded text-sm text-slate-700"
                                      onClick={() => handleSelectUrl(url)}
                                      whileHover={{ x: 5 }}
                                    >
                                      <ExternalLink className="h-4 w-4 mr-2 text-slate-400" />
                                      {url}
                                    </motion.button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <motion.div
                    variants={buttonVariants}
                    initial="idle"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 py-6 px-8 rounded-lg shadow-md hover:shadow-lg min-w-[150px] text-lg font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <motion.div
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Analyzing...
                        </motion.div>
                      ) : (
                        <motion.div
                          className="flex items-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Search className="h-5 w-5 mr-2" />
                          Analyze
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center px-4 py-2 bg-blue-50 rounded-full text-sm text-blue-600 border border-blue-100">
                    <Search className="h-4 w-4 mr-2 text-blue-500" />
                    Enter any URL to analyze SEO tags, previews, and get recommendations
                    <TooltipHelper content="Enter the full URL including https:// to analyze meta tags, social media previews, and get SEO recommendations" />
                  </div>
                </motion.div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
