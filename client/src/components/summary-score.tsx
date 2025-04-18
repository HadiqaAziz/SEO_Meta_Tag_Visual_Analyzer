import React from "react";
import { AnalyzedSite, ScoreType } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { formatUrl } from "@/lib/seo-utils";
import { scoreToIconClass, scoreToIcon, scoreToString } from "@/lib/seo-utils";
import SEOScoreGraph from "./seo-score-graph";
import { motion } from "framer-motion";

interface SummaryScoreProps {
  result: AnalyzedSite;
  onReanalyze: () => void;
}

interface ScoreCardProps {
  title: string;
  score: ScoreType;
}

function ScoreCard({ title, score }: ScoreCardProps) {
  return (
    <div className="bg-slate-50 rounded-md p-4 border border-slate-200 flex items-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mr-3 ${scoreToIconClass(score)}`}>
        <motion.span 
          className="material-icons"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          {scoreToIcon(score)}
        </motion.span>
      </div>
      <div>
        <div className="text-sm text-slate-500">{title}</div>
        <div className="font-semibold text-slate-800">{scoreToString(score)}</div>
      </div>
    </div>
  );
}

export default function SummaryScore({ result, onReanalyze }: SummaryScoreProps) {
  const domain = formatUrl(result.url);
  const analyzedAt = new Date(result.analyzedAt).toLocaleString();

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              {domain} - SEO Analysis
            </h2>
            <p className="text-slate-500 text-sm">
              Analyzed {analyzedAt}
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-3 md:mt-0"
            onClick={onReanalyze}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Re-analyze
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* SEO Score Graph */}
          <div className="lg:col-span-2 flex justify-center items-center bg-white p-4 rounded-lg">
            <SEOScoreGraph result={result} />
          </div>
          
          {/* Score Cards */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScoreCard 
              title="Title Tag" 
              score={result.scoreTitle as ScoreType} 
            />
            <ScoreCard 
              title="Meta Description" 
              score={result.scoreDescription as ScoreType} 
            />
            <ScoreCard 
              title="Open Graph" 
              score={result.scoreOpenGraph as ScoreType} 
            />
            <ScoreCard 
              title="Twitter Cards" 
              score={result.scoreTwitter as ScoreType} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
