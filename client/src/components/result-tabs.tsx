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
  
  // Track active tab for animations
  const [activeTab, setActiveTab] = useState('previews');
  
  // Count recommendations
  const recommendations = result.recommendations as any[] || [];
  const recommendationCount = recommendations.length;
  
  // Animation variants
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, 
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.1
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.2
      } 
    }
  };
  
  const tabIndicatorVariants = {
    hidden: { width: 0 },
    visible: { width: "100%", transition: { duration: 0.3 } }
  };
  
  const badgeVariants = {
    initial: { scale: 0 },
    animate: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 15 } }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="mb-8 overflow-hidden shadow-lg border-slate-200">
        <Tabs 
          defaultValue="previews" 
          onValueChange={handleTabChange}
        >
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
            <TabsList className="h-auto bg-transparent w-full justify-start border-b-0 p-2">
              <motion.div
                className="flex flex-wrap sm:flex-nowrap w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <TabsTrigger 
                  value="previews" 
                  className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center mr-1 relative overflow-hidden"
                >
                  <div className="flex items-center justify-center">
                    <Eye className="h-4 w-4 mr-2" />
                    <span className="font-medium">Previews</span>
                  </div>
                  {activeTab === 'previews' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial="hidden"
                      animate="visible"
                      variants={tabIndicatorVariants}
                    />
                  )}
                </TabsTrigger>
                
                <TabsTrigger 
                  value="metatags" 
                  className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center mr-1 relative overflow-hidden"
                >
                  <div className="flex items-center justify-center">
                    <Code className="h-4 w-4 mr-2" />
                    <span className="font-medium">Meta Tags</span>
                  </div>
                  {activeTab === 'metatags' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial="hidden"
                      animate="visible"
                      variants={tabIndicatorVariants}
                    />
                  )}
                </TabsTrigger>
                
                <TabsTrigger 
                  value="issues" 
                  className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center mr-1 relative overflow-hidden"
                >
                  <div className="flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                    <span className="font-medium">Issues</span>
                    {issueCount > 0 && (
                      <motion.span 
                        className="ml-2 bg-red-500 text-white text-xs py-0.5 px-2 rounded-full font-bold"
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {issueCount}
                      </motion.span>
                    )}
                  </div>
                  {activeTab === 'issues' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial="hidden"
                      animate="visible"
                      variants={tabIndicatorVariants}
                    />
                  )}
                </TabsTrigger>
                
                <TabsTrigger 
                  value="recommendations" 
                  className="text-sm sm:text-base flex-grow sm:flex-grow-0 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md py-3 px-4 sm:px-6 rounded-md transition-all duration-200 text-center relative overflow-hidden"
                >
                  <div className="flex items-center justify-center">
                    <Lightbulb className="h-4 w-4 mr-2 text-yellow-500" />
                    <span className="font-medium">Recommendations</span>
                    {recommendationCount > 0 && (
                      <motion.span 
                        className="ml-2 bg-blue-500 text-white text-xs py-0.5 px-2 rounded-full font-bold"
                        variants={badgeVariants}
                        initial="initial"
                        animate="animate"
                      >
                        {recommendationCount}
                      </motion.span>
                    )}
                  </div>
                  {activeTab === 'recommendations' && (
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-primary"
                      initial="hidden"
                      animate="visible"
                      variants={tabIndicatorVariants}
                    />
                  )}
                </TabsTrigger>
              </motion.div>
            </TabsList>
          </div>
          
          <AnimatePresence mode="wait">
            {activeTab === 'previews' && (
              <TabsContent value="previews" className="p-6 mt-0 bg-white">
                <motion.div
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key="previews-content"
                >
                  <Previews result={result} />
                </motion.div>
              </TabsContent>
            )}
            
            {activeTab === 'metatags' && (
              <TabsContent value="metatags" className="p-6 mt-0 bg-white">
                <motion.div
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key="metatags-content"
                >
                  <MetaTags result={result} />
                </motion.div>
              </TabsContent>
            )}
            
            {activeTab === 'issues' && (
              <TabsContent value="issues" className="p-6 mt-0 bg-white">
                <motion.div
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key="issues-content"
                >
                  <Issues result={result} />
                </motion.div>
              </TabsContent>
            )}
            
            {activeTab === 'recommendations' && (
              <TabsContent value="recommendations" className="p-6 mt-0 bg-white">
                <motion.div
                  variants={tabContentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  key="recommendations-content"
                >
                  <Recommendations result={result} />
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
      </Card>
    </motion.div>
  );
}
