import React from "react";
import { AnalyzedSite, Recommendation } from "@shared/schema";
import { getPriorityClass, getPriorityTextClass, getPriorityIcon, getActionIconClass, getActionIcon } from "@/lib/seo-utils";

interface RecommendationsProps {
  result: AnalyzedSite;
}

export default function Recommendations({ result }: RecommendationsProps) {
  const recommendations = (result.recommendations as Recommendation[]) || [];
  
  // Group recommendations by priority
  const highPriorityRecs = recommendations.filter(rec => rec.priority === "high");
  const mediumPriorityRecs = recommendations.filter(rec => rec.priority === "medium");
  const lowPriorityRecs = recommendations.filter(rec => rec.priority === "low");
  
  return (
    <>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Recommendations to Improve SEO</h2>
      
      {recommendations.length === 0 ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <span className="material-icons text-3xl text-green-500 mb-2">check_circle</span>
          <h3 className="text-lg font-medium text-green-800 mb-2">Perfect! No recommendations needed</h3>
          <p className="text-green-700">
            Your website is already following SEO best practices. Keep up the great work!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* High Priority Recommendations */}
          {highPriorityRecs.length > 0 && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
              <div className={`${getPriorityClass("high")} px-4 py-3 border-b border-slate-200`}>
                <h3 className={`font-medium ${getPriorityTextClass("high")} flex items-center`}>
                  <span className="material-icons mr-1 text-sm">{getPriorityIcon("high")}</span>
                  High Priority
                </h3>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {highPriorityRecs.map((rec, index) => (
                    <li key={index} className="flex">
                      <span className={`material-icons ${getActionIconClass("high")} mr-2 flex-shrink-0`}>
                        {getActionIcon("high")}
                      </span>
                      <div>
                        <h4 className="font-medium text-slate-800">{rec.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                        {rec.code && (
                          <div className="mt-2 bg-slate-100 rounded p-3">
                            <pre className="font-mono text-xs text-slate-700 overflow-x-auto">
                              <code>{rec.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Medium Priority Recommendations */}
          {mediumPriorityRecs.length > 0 && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
              <div className={`${getPriorityClass("medium")} px-4 py-3 border-b border-slate-200`}>
                <h3 className={`font-medium ${getPriorityTextClass("medium")} flex items-center`}>
                  <span className="material-icons mr-1 text-sm">{getPriorityIcon("medium")}</span>
                  Medium Priority
                </h3>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {mediumPriorityRecs.map((rec, index) => (
                    <li key={index} className="flex">
                      <span className={`material-icons ${getActionIconClass("medium")} mr-2 flex-shrink-0`}>
                        {getActionIcon("medium")}
                      </span>
                      <div>
                        <h4 className="font-medium text-slate-800">{rec.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                        {rec.code && (
                          <div className="mt-2 bg-slate-100 rounded p-3">
                            <pre className="font-mono text-xs text-slate-700 overflow-x-auto">
                              <code>{rec.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Low Priority Recommendations */}
          {lowPriorityRecs.length > 0 && (
            <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
              <div className={`${getPriorityClass("low")} px-4 py-3 border-b border-slate-200`}>
                <h3 className={`font-medium ${getPriorityTextClass("low")} flex items-center`}>
                  <span className="material-icons mr-1 text-sm">{getPriorityIcon("low")}</span>
                  Low Priority
                </h3>
              </div>
              <div className="p-4">
                <ul className="space-y-4">
                  {lowPriorityRecs.map((rec, index) => (
                    <li key={index} className="flex">
                      <span className={`material-icons ${getActionIconClass("low")} mr-2 flex-shrink-0`}>
                        {getActionIcon("low")}
                      </span>
                      <div>
                        <h4 className="font-medium text-slate-800">{rec.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">{rec.description}</p>
                        {rec.code && (
                          <div className="mt-2 bg-slate-100 rounded p-3">
                            <pre className="font-mono text-xs text-slate-700 overflow-x-auto">
                              <code>{rec.code}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
