import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface TooltipHelperProps {
  content: string;
  size?: 'sm' | 'md' | 'lg';
}

const TooltipHelper = ({ content, size = 'md' }: TooltipHelperProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help ml-1">
            <HelpCircle className={`${sizeClasses[size]} text-slate-400 hover:text-primary transition-colors`} />
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipHelper;