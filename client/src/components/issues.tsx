import React from "react";
import { AnalyzedSite, Issue } from "@shared/schema";
import { getSeverityClass, getSeverityIcon, getSeverityTextClass } from "@/lib/seo-utils";

interface IssuesProps {
  result: AnalyzedSite;
}

export default function Issues({ result }: IssuesProps) {
  const issues = (result.issues as Issue[]) || [];
  
  return (
    <>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">
        Issues Found ({issues.length})
      </h2>
      
      {issues.length === 0 ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="material-icons text-green-500">check_circle</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">No issues found</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Great job! We didn't find any SEO-related issues with your website.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {issues.map((issue, index) => (
            <div 
              key={index}
              className={`${getSeverityClass(issue.severity)} border-l-4 p-4 rounded-md`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className={`material-icons text-${issue.severity === 'error' ? 'error' : issue.severity === 'warning' ? 'warning' : 'blue-500'}`}>
                    {getSeverityIcon(issue.severity)}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className={`text-sm font-medium ${getSeverityTextClass(issue.severity)}`}>
                    {issue.title}
                  </h3>
                  <div className={`mt-2 text-sm ${issue.severity === 'error' ? 'text-red-700' : issue.severity === 'warning' ? 'text-amber-700' : 'text-blue-700'}`}>
                    <p>{issue.description}</p>
                  </div>
                  {issue.fixLink && (
                    <div className="mt-3">
                      <div className="text-sm">
                        <a 
                          href={issue.fixLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`${issue.severity === 'error' ? 'text-red-700 hover:text-red-600' : issue.severity === 'warning' ? 'text-amber-700 hover:text-amber-600' : 'text-blue-700 hover:text-blue-600'} font-medium`}
                        >
                          Learn how to fix this →
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
