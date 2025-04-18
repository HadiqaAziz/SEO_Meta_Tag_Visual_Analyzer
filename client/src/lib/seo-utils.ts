import { Issue, MetaTagAnalysis, Recommendation, ScoreType } from "@shared/schema";

// Score type to string and icon mappings
export const scoreToString = (score: ScoreType): string => {
  switch (score) {
    case "excellent":
      return "Excellent";
    case "good":
      return "Good";
    case "needs-work":
      return "Needs Work";
    case "missing":
      return "Missing";
    default:
      return "Unknown";
  }
};

export const scoreToIconClass = (score: ScoreType): string => {
  switch (score) {
    case "excellent":
    case "good":
      return "text-success bg-green-100";
    case "needs-work":
      return "text-warning bg-amber-100";
    case "missing":
      return "text-error bg-red-100";
    default:
      return "text-slate-500 bg-slate-100";
  }
};

export const scoreToIcon = (score: ScoreType): string => {
  switch (score) {
    case "excellent":
    case "good":
      return "check_circle";
    case "needs-work":
      return "warning";
    case "missing":
      return "error_outline";
    default:
      return "help_outline";
  }
};

// Format URL for display
export const formatUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
};

// Get domain from URL
export const getDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
};

// Format path for display in Google search result
export const formatPathForDisplay = (url: string): string => {
  try {
    const urlObj = new URL(url);
    let path = urlObj.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (path) {
      path = path.replace(/\//g, ' › ');
      return `${urlObj.hostname} › ${path}`;
    }
    return urlObj.hostname;
  } catch (e) {
    return url;
  }
};

// Generate a severity class for issues
export const getSeverityClass = (severity: Issue["severity"]): string => {
  switch (severity) {
    case "error":
      return "bg-red-50 border-error";
    case "warning":
      return "bg-amber-50 border-warning";
    case "info":
      return "bg-blue-50 border-blue-400";
    default:
      return "bg-slate-50 border-slate-300";
  }
};

export const getSeverityIcon = (severity: Issue["severity"]): string => {
  switch (severity) {
    case "error":
      return "error_outline";
    case "warning":
      return "warning";
    case "info":
      return "info_outline";
    default:
      return "help_outline";
  }
};

export const getSeverityTextClass = (severity: Issue["severity"]): string => {
  switch (severity) {
    case "error":
      return "text-red-800";
    case "warning":
      return "text-amber-800";
    case "info":
      return "text-blue-800";
    default:
      return "text-slate-800";
  }
};

// Priority formatting
export const getPriorityClass = (priority: Recommendation["priority"]): string => {
  switch (priority) {
    case "high":
      return "bg-success/10";
    case "medium":
      return "bg-slate-200";
    case "low":
      return "bg-slate-100";
    default:
      return "bg-slate-100";
  }
};

export const getPriorityTextClass = (priority: Recommendation["priority"]): string => {
  switch (priority) {
    case "high":
      return "text-success";
    case "medium":
      return "text-slate-700";
    case "low":
      return "text-slate-500";
    default:
      return "text-slate-700";
  }
};

export const getPriorityIcon = (priority: Recommendation["priority"]): string => {
  switch (priority) {
    case "high":
      return "priority_high";
    case "medium":
      return "low_priority";
    case "low":
      return "more_horiz";
    default:
      return "more_horiz";
  }
};

// Get icon color for recommendation action
export const getActionIconClass = (priority: Recommendation["priority"]): string => {
  switch (priority) {
    case "high":
      return "text-success";
    case "medium":
    case "low":
      return "text-slate-500";
    default:
      return "text-slate-500";
  }
};

export const getActionIcon = (priority: Recommendation["priority"]): string => {
  switch (priority) {
    case "high":
      return "add_circle";
    case "medium":
    case "low":
      return "refresh";
    default:
      return "refresh";
  }
};
