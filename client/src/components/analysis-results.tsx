import React, { useState } from "react";
import { AnalyzedSite } from "@shared/schema";
import { Card } from "@/components/ui/card";
import SummaryScore from "./summary-score";
import ResultTabs from "./result-tabs";

interface AnalysisResultsProps {
  isLoading: boolean;
  error: string | null;
  result: AnalyzedSite | null;
  onReanalyze: () => void;
}

export default function AnalysisResults({ isLoading, error, result, onReanalyze }: AnalysisResultsProps) {
  // Don't show anything if there's no result yet and we're not loading
  if (!isLoading && !error && !result) {
    return null;
  }

  return (
    <div id="results">
      {/* Loading State */}
      {isLoading && !result && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-12 w-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
          <p className="mt-4 text-slate-600">Analyzing website metadata...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border-l-4 border-error p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-error">error_outline</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-error">Error analyzing website</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results State */}
      {result && !isLoading && (
        <div id="analysisContent">
          <SummaryScore result={result} onReanalyze={onReanalyze} />
          <ResultTabs result={result} />
        </div>
      )}
    </div>
  );
}
