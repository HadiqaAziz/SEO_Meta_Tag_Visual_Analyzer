import React from 'react';
import { AnalyzedSite, ScoreType } from '@shared/schema';

interface SEOScoreGraphProps {
  result: AnalyzedSite;
}

// Helper function to convert score type to numeric value for the graph
const scoreToNumeric = (score: ScoreType | null | undefined): number => {
  switch(score) {
    case 'excellent': return 100;
    case 'good': return 75;
    case 'needs-work': return 40;
    case 'missing':
    default: return 10;
  }
};

// Helper to get color for score
const getScoreColor = (score: ScoreType | null | undefined): string => {
  switch(score) {
    case 'excellent': return '#22c55e'; // Green
    case 'good': return '#3b82f6'; // Blue
    case 'needs-work': return '#f59e0b'; // Amber
    case 'missing':
    default: return '#ef4444'; // Red
  }
};

const SEOScoreGraph: React.FC<SEOScoreGraphProps> = ({ result }) => {
  const scores = {
    title: scoreToNumeric(result.scoreTitle as ScoreType),
    description: scoreToNumeric(result.scoreDescription as ScoreType),
    openGraph: scoreToNumeric(result.scoreOpenGraph as ScoreType),
    twitter: scoreToNumeric(result.scoreTwitter as ScoreType)
  };

  // Calculate overall score (average)
  const overallScore = Math.round(
    (scores.title + scores.description + scores.openGraph + scores.twitter) / 4
  );

  // Get colors
  const titleColor = getScoreColor(result.scoreTitle as ScoreType);
  const descriptionColor = getScoreColor(result.scoreDescription as ScoreType);
  const ogColor = getScoreColor(result.scoreOpenGraph as ScoreType);
  const twitterColor = getScoreColor(result.scoreTwitter as ScoreType);

  // Overall score text and color
  let overallScoreText: ScoreType = 'missing';
  if (overallScore >= 90) overallScoreText = 'excellent';
  else if (overallScore >= 70) overallScoreText = 'good';
  else if (overallScore >= 30) overallScoreText = 'needs-work';
  
  const overallColor = getScoreColor(overallScoreText);

  // SVG dimensions
  const size = 200;
  const center = size / 2;
  const radius = size * 0.35;
  const strokeWidth = 10;
  
  // Calculate coordinates for the graph segments
  const angleToRad = (angle: number) => (angle - 90) * Math.PI / 180;
  
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = angleToRad(angleInDegrees);
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };
  
  const arcPath = (value: number, startAngle: number, endAngle: number, color: string) => {
    // Scale value from 0-100 to 0-(endAngle-startAngle)
    const angleRange = endAngle - startAngle;
    const scaledValue = value * angleRange / 100;
    
    const start = polarToCartesian(center, center, radius, startAngle);
    const end = polarToCartesian(center, center, radius, startAngle + scaledValue);
    
    const largeArcFlag = scaledValue > 180 ? 1 : 0;
    
    return (
      <path 
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    );
  };

  return (
    <div className="flex flex-col items-center mb-8">
      <h2 className="text-xl font-semibold text-slate-800 mb-2">SEO Score Analysis</h2>
      
      <div className="relative">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Title score (0-90 degrees) */}
          {arcPath(scores.title, 0, 90, titleColor)}
          
          {/* Description score (90-180 degrees) */}
          {arcPath(scores.description, 90, 180, descriptionColor)}
          
          {/* Open Graph score (180-270 degrees) */}
          {arcPath(scores.openGraph, 180, 270, ogColor)}
          
          {/* Twitter score (270-360 degrees) */}
          {arcPath(scores.twitter, 270, 360, twitterColor)}
          
          {/* Center text with overall score */}
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            fontSize="28"
            fontWeight="bold"
            fill={overallColor}
          >
            {overallScore}
          </text>
          <text
            x={center}
            y={center + 20}
            textAnchor="middle"
            fontSize="14"
            fill="#4b5563"
          >
            Overall
          </text>
        </svg>
        
        {/* Legend markers */}
        <div className="absolute -bottom-4 -left-4">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: titleColor }}></div>
        </div>
        <div className="absolute -bottom-4 -right-4">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: descriptionColor }}></div>
        </div>
        <div className="absolute -top-4 -left-4">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: twitterColor }}></div>
        </div>
        <div className="absolute -top-4 -right-4">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ogColor }}></div>
        </div>
      </div>
      
      {/* Legend labels */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-slate-700">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: titleColor }}></div>
          <span>Title</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: descriptionColor }}></div>
          <span>Description</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: ogColor }}></div>
          <span>Open Graph</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: twitterColor }}></div>
          <span>Twitter</span>
        </div>
      </div>
    </div>
  );
};

export default SEOScoreGraph;