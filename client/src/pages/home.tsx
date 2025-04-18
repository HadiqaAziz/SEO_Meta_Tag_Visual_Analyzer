import React from "react";
import URLInput from "@/components/url-input";
import AnalysisResults from "@/components/analysis-results";
import { AnalyzedSite } from "@shared/schema";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<AnalyzedSite | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleAnalyze = async (url: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await apiRequest("POST", "/api/analyze", { url });
      const data = await response.json();
      setResult(data);
      // Invalidate recent sites query to include this new analysis
      queryClient.invalidateQueries({ queryKey: ["/api/sites/recent"] });
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Failed to analyze URL";
      setError(errMessage);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: errMessage,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-semibold text-slate-800 flex items-center">
                <span className="material-icons mr-2 text-primary">search</span>
                SEO Meta Tag Analyzer
              </h1>
              <p className="text-slate-600 mt-1">
                Analyze any website's SEO implementation and preview how it appears on search engines and social media
              </p>
            </div>
            <div>
              <a
                href="https://moz.com/learn/seo/meta-tags"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark text-sm flex items-center"
              >
                <span className="material-icons text-sm mr-1">help_outline</span>
                SEO Tag Guide
              </a>
            </div>
          </div>
        </header>

        {/* URL Input Form */}
        <URLInput onAnalyze={handleAnalyze} isLoading={isAnalyzing} />

        {/* Analysis Results */}
        <AnalysisResults
          isLoading={isAnalyzing}
          error={error}
          result={result}
          onReanalyze={() => result && handleAnalyze(result.url)}
        />
      </div>
    </div>
  );
}
