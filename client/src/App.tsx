import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { motion } from "framer-motion";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={Home} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white mr-3">
            <span className="material-icons">analytics</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">MetaTag Analyzer</h1>
            <p className="text-xs text-slate-500">SEO & Social Media Preview Tool</p>
          </div>
        </motion.div>
        
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <a 
            href="https://moz.com/learn/seo/meta-tags" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-primary text-sm flex items-center transition-colors"
          >
            <span className="material-icons text-sm mr-1">school</span>
            SEO Guide
          </a>
          <a 
            href="https://developers.google.com/search/docs/appearance/snippet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-primary text-sm flex items-center transition-colors"
          >
            <span className="material-icons text-sm mr-1">help_outline</span>
            Help
          </a>
        </motion.div>
      </div>
    </header>
  );
}

function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} SEO Meta Tag Analyzer. All rights reserved.</p>
          <div className="flex gap-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <AppHeader />
      <main className="flex-grow">
        {children}
      </main>
      <AppFooter />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppLayout>
          <Router />
        </AppLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
