import React, { useState } from "react";
import { AnalyzedSite } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, AlertTriangle, Lightbulb, Eye } from "lucide-react";
import Previews from "./previews";
import MetaTags from "./meta-tags";
import Issues from "./issues";
import Recommendations from "./recommendations";

interface ResultTabsProps {
  result: AnalyzedSite;
}

export default function ResultTabs({ result }: ResultTabsProps) {
  // Count issues for the badge
  const issues = result.issues as any[] || [];
  const issueCount = issues.length;

  return (
    <Card className="mb-8 overflow-hidden">
      <Tabs defaultValue="previews">
        <div className="border-b border-slate-200">
          <TabsList className="h-auto bg-transparent w-full justify-start border-b-0 p-0">
            <TabsTrigger 
              value="previews" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:text-primary data-[state=active]:border-primary py-4 px-4 sm:px-8 border-b-2 data-[state=active]:border-b-2 data-[state=inactive]:border-transparent rounded-none text-center"
            >
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                Previews
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="metatags" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:text-primary data-[state=active]:border-primary py-4 px-4 sm:px-8 border-b-2 data-[state=active]:border-b-2 data-[state=inactive]:border-transparent rounded-none text-center"
            >
              <div className="flex items-center">
                <Code className="h-4 w-4 mr-1" />
                Meta Tags
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="issues" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:text-primary data-[state=active]:border-primary py-4 px-4 sm:px-8 border-b-2 data-[state=active]:border-b-2 data-[state=inactive]:border-transparent rounded-none text-center"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1" />
                Issues
                {issueCount > 0 && (
                  <span className="ml-1 bg-error text-white text-xs py-0.5 px-2 rounded-full">
                    {issueCount}
                  </span>
                )}
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="recommendations" 
              className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:text-primary data-[state=active]:border-primary py-4 px-4 sm:px-8 border-b-2 data-[state=active]:border-b-2 data-[state=inactive]:border-transparent rounded-none text-center"
            >
              <div className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-1" />
                Recommendations
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="previews" className="p-6 mt-0">
          <Previews result={result} />
        </TabsContent>
        
        <TabsContent value="metatags" className="p-6 mt-0">
          <MetaTags result={result} />
        </TabsContent>
        
        <TabsContent value="issues" className="p-6 mt-0">
          <Issues result={result} />
        </TabsContent>
        
        <TabsContent value="recommendations" className="p-6 mt-0">
          <Recommendations result={result} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
