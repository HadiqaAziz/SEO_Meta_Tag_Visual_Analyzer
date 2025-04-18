import React, { useState, useEffect } from "react";
import { AnalyzedSite } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, AlertTriangle, Lightbulb, Eye, BarChart2, CircleCheck, ArrowRight } from "lucide-react";
import Previews from "./previews";
import MetaTags from "./meta-tags";
import Issues from "./issues";
import Recommendations from "./recommendations";
import { motion, AnimatePresence } from "framer-motion";

interface ResultTabsProps {
  result: AnalyzedSite;
}

export default function ResultTabs({ result }: ResultTabsProps) {
  // Count issues for the badge
  const issues = result.issues as any[] || [];
  const issueCount = issues.length;

  return (
    <Card className="mb-8 overflow-hidden shadow-md">
      <Tabs defaultValue="previews">
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <TabsList className="h-auto bg-transparent w-full justify-start border-b-0 p-2">
            <TabsTrigger 
              value="previews" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center mr-1"
            >
              <div className="flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                <span className="font-medium">Previews</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="metatags" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center mr-1"
            >
              <div className="flex items-center justify-center">
                <Code className="h-4 w-4 mr-2" />
                <span className="font-medium">Meta Tags</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="issues" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center mr-1"
            >
              <div className="flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                <span className="font-medium">Issues</span>
                {issueCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs py-0.5 px-2 rounded-full font-bold">
                    {issueCount}
                  </span>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center"
            >
              <div className="flex items-center justify-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="font-medium">Recommendations</span>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="previews" className="p-6 mt-0 bg-white">
          <Previews result={result} />
        </TabsContent>
        
        <TabsContent value="metatags" className="p-6 mt-0 bg-white">
          <MetaTags result={result} />
        </TabsContent>
        
        <TabsContent value="issues" className="p-6 mt-0 bg-white">
          <Issues result={result} />
        </TabsContent>
        
        <TabsContent value="recommendations" className="p-6 mt-0 bg-white">
          <Recommendations result={result} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
