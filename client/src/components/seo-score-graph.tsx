import React, { useEffect, useState } from 'react';
import { AnalyzedSite, ScoreType } from '@shared/schema';
import { motion } from 'framer-motion';
import TooltipHelper from '@/components/ui/tooltip-helper';

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
  // Animation states
  const [animatedScores, setAnimatedScores] = useState({
    title: 0,
    description: 0,
    openGraph: 0,
    twitter: 0,
    overall: 0
  });
  
  // Current tooltip
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
  // Actual scores
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
  
  // Animation effect
  useEffect(() => {
    // Animate scores from 0 to actual values
    const timeout = setTimeout(() => {
      setAnimatedScores({
        title: scores.title,
        description: scores.description,
        openGraph: scores.openGraph,
        twitter: scores.twitter,
        overall: overallScore
      });
    }, 300);
    
    return () => clearTimeout(timeout);
  }, [scores, overallScore]);

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

  // Create animated arc path with motion
  const animatedArcPath = (value: number, startAngle: number, endAngle: number, color: string, delay: number) => {
    // Scale value from 0-100 to 0-(endAngle-startAngle)
    const angleRange = endAngle - startAngle;
    
    // Animated path
    const start = polarToCartesian(center, center, radius, startAngle);
    
    // Animation variants for path drawing
    const variants = {
      hidden: {
        pathLength: 0,
        opacity: 0,
      },
      visible: {
        pathLength: value / 100,
        opacity: 1,
        transition: {
          pathLength: { type: "spring", duration: 1.5, bounce: 0, delay },
          opacity: { duration: 0.2, delay }
        }
      }
    };

    return (
      <motion.path 
        d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${start.x + radius} ${start.y + radius}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        initial="hidden"
        animate="visible"
        variants={variants}
      />
    );
  };
  
  // Generate tooltips for each score type
  const getScoreTooltip = (type: string, score: ScoreType | null | undefined) => {
    if (!score) return "";
    
    switch(score) {
      case 'excellent':
        return `${type} is excellent! Great job optimizing this aspect.`;
      case 'good':
        return `${type} is good but could use some minor improvements.`;
      case 'needs-work':
        return `${type} needs more work to meet best practices.`;
      case 'missing':
        return `${type} is missing - this should be fixed for better SEO.`;
      default:
        return `No data available for ${type}.`;
    }
  };

  return (
    <motion.div 
      className="flex flex-col items-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-3">
        SEO Score Analysis
      </h2>
      
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
          
          {/* Title score (0-90 degrees) - animated */}
          {animatedArcPath(animatedScores.title, 0, 90, titleColor, 0.1)}
          
          {/* Description score (90-180 degrees) - animated */}
          {animatedArcPath(animatedScores.description, 90, 180, descriptionColor, 0.2)}
          
          {/* Open Graph score (180-270 degrees) - animated */}
          {animatedArcPath(animatedScores.openGraph, 180, 270, ogColor, 0.3)}
          
          {/* Twitter score (270-360 degrees) - animated */}
          {animatedArcPath(animatedScores.twitter, 270, 360, twitterColor, 0.4)}
          
          {/* Center text with overall score - animated */}
          <motion.g
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.text
              x={center}
              y={center - 5}
              textAnchor="middle"
              fontSize="28"
              fontWeight="bold"
              fill={overallColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {animatedScores.overall}
            </motion.text>
            <motion.text
              x={center}
              y={center + 20}
              textAnchor="middle"
              fontSize="14"
              fill="#4b5563"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Overall
            </motion.text>
          </motion.g>
        </svg>
        
        {/* Legend markers with interaction */}
        <motion.div 
          className="absolute -bottom-4 -left-4 cursor-pointer"
          whileHover={{ scale: 1.2 }}
          onMouseEnter={() => setActiveTooltip('title')}
          onMouseLeave={() => setActiveTooltip(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: titleColor }}></div>
          {activeTooltip === 'title' && (
            <div className="absolute -top-10 left-0 bg-white p-2 rounded shadow-md text-xs w-40 z-10">
              {getScoreTooltip('Title', result.scoreTitle as ScoreType)}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="absolute -bottom-4 -right-4 cursor-pointer" 
          whileHover={{ scale: 1.2 }}
          onMouseEnter={() => setActiveTooltip('description')}
          onMouseLeave={() => setActiveTooltip(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: descriptionColor }}></div>
          {activeTooltip === 'description' && (
            <div className="absolute -top-10 right-0 bg-white p-2 rounded shadow-md text-xs w-40 z-10">
              {getScoreTooltip('Description', result.scoreDescription as ScoreType)}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="absolute -top-4 -left-4 cursor-pointer"
          whileHover={{ scale: 1.2 }}
          onMouseEnter={() => setActiveTooltip('twitter')}
          onMouseLeave={() => setActiveTooltip(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: twitterColor }}></div>
          {activeTooltip === 'twitter' && (
            <div className="absolute bottom-10 left-0 bg-white p-2 rounded shadow-md text-xs w-40 z-10">
              {getScoreTooltip('Twitter Card', result.scoreTwitter as ScoreType)}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          className="absolute -top-4 -right-4 cursor-pointer"
          whileHover={{ scale: 1.2 }}
          onMouseEnter={() => setActiveTooltip('openGraph')}
          onMouseLeave={() => setActiveTooltip(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: ogColor }}></div>
          {activeTooltip === 'openGraph' && (
            <div className="absolute bottom-10 right-0 bg-white p-2 rounded shadow-md text-xs w-40 z-10">
              {getScoreTooltip('Open Graph', result.scoreOpenGraph as ScoreType)}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Legend labels */}
      <motion.div 
        className="grid grid-cols-2 gap-4 mt-6 text-sm text-slate-700 bg-slate-50 p-3 rounded-lg shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
      >
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: titleColor }}></div>
          <span className="font-medium">Title</span>
          <TooltipHelper content={getScoreTooltip('Title', result.scoreTitle as ScoreType)} size="sm" />
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: descriptionColor }}></div>
          <span className="font-medium">Description</span>
          <TooltipHelper content={getScoreTooltip('Description', result.scoreDescription as ScoreType)} size="sm" />
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: ogColor }}></div>
          <span className="font-medium">Open Graph</span>
          <TooltipHelper content={getScoreTooltip('Open Graph', result.scoreOpenGraph as ScoreType)} size="sm" />
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: twitterColor }}></div>
          <span className="font-medium">Twitter</span>
          <TooltipHelper content={getScoreTooltip('Twitter Card', result.scoreTwitter as ScoreType)} size="sm" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SEOScoreGraph;