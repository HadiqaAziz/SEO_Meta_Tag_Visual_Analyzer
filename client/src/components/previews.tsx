import React, { useState } from "react";
import { AnalyzedSite } from "@shared/schema";
import { formatPathForDisplay } from "@/lib/seo-utils";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewsProps {
  result: AnalyzedSite;
}

export default function Previews({ result }: PreviewsProps) {
  const googleTitle = result.title || "No title found";
  const googleDesc = result.description || "No description found";
  const googleUrl = formatPathForDisplay(result.url);
  
  // Default image for previews (only used if no image is found)
  const defaultImage = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
  
  const websiteDomain = new URL(result.url).hostname;
  
  // Get OpenGraph data with fallbacks
  const ogTitle = result.ogTitle || result.title || "No title found";
  const ogDesc = result.ogDescription || result.description || "No description found";
  const ogImage = result.ogImage || defaultImage;
  
  // Get Twitter data with fallbacks
  const twitterTitle = result.twitterTitle || result.ogTitle || result.title;
  const twitterDesc = result.twitterDescription || result.ogDescription || result.description;
  const twitterImage = result.twitterImage || result.ogImage;
  
  // Define tab state
  const [activePreview, setActivePreview] = useState('google');
  
  // Animation variants
  const previewVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  // Google Preview
  const renderGooglePreview = () => (
    <motion.div
      className="space-y-4 mt-6"
      variants={previewVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="preview-card bg-white border border-slate-200 rounded-lg p-6 max-w-2xl shadow-md">
        <div className="text-xl text-blue-800 mb-2 font-medium line-clamp-1 hover:underline">{googleTitle}</div>
        <div className="text-green-700 text-sm mb-2">{googleUrl}</div>
        <div className="text-sm text-slate-700 line-clamp-3">{googleDesc}</div>
      </div>
      
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-start">
          {result.scoreTitle === "excellent" && result.scoreDescription === "excellent" ? (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-green-500 mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                check_circle
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Optimized for Google Search</h4>
                <p className="text-sm text-slate-600">Title and description length are perfect for Google search results.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-warning mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                warning
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Could use improvement</h4>
                <p className="text-sm text-slate-600">
                  {result.scoreTitle !== "excellent" ? "Title could be improved. " : ""}
                  {result.scoreDescription !== "excellent" ? "Description could be improved." : ""}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  // Facebook Preview
  const renderFacebookPreview = () => (
    <motion.div
      className="space-y-4 mt-6"
      variants={previewVariants}
      initial="hidden"
      animate="visible"
    >
      {result.ogTitle || result.ogDescription || result.ogImage ? (
        <div className="preview-card bg-[#F0F2F5] border border-slate-200 rounded-lg overflow-hidden max-w-xl shadow-md">
          <div className="bg-white p-4 border-b border-slate-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">f</div>
              <div>
                <div className="font-medium text-slate-800">{websiteDomain}</div>
                <div className="text-xs text-slate-500">Sponsored · <span className="material-icons text-xs">public</span></div>
              </div>
            </div>
          </div>
          <div>
            {ogImage ? (
              <motion.img 
                src={ogImage} 
                alt="Facebook preview image" 
                className="w-full h-72 object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onError={(e) => {
                  e.currentTarget.onerror = null; 
                  e.currentTarget.src = defaultImage;
                }}
              />
            ) : (
              <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-400">
                <span className="material-icons mr-2">image_not_supported</span>
                No image specified
              </div>
            )}
          </div>
          <div className="bg-white p-4">
            <div className="text-xs text-[#65676B] uppercase tracking-wider mb-2">{websiteDomain}</div>
            <div className="font-medium text-base mb-2 line-clamp-2">{ogTitle}</div>
            <div className="text-sm text-[#65676B] line-clamp-4 mb-3">{ogDesc}</div>
            <button className="w-full bg-[#E4E6EB] hover:bg-[#d8d9dd] text-[#050505] py-2 rounded-md font-medium transition-colors">
              Learn More
            </button>
          </div>
        </div>
      ) : (
        <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-xl p-10 flex items-center justify-center flex-col shadow-md">
          <span className="material-icons text-red-500 text-4xl mb-4">error_outline</span>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Open Graph metadata not found</h3>
          <p className="text-slate-600 text-center max-w-md">Without Open Graph tags, Facebook will attempt to scrape basic information, resulting in an incomplete and less appealing preview.</p>
        </div>
      )}
      
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-start">
          {result.scoreOpenGraph === "excellent" ? (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-green-500 mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                check_circle
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Perfect Open Graph Implementation</h4>
                <p className="text-sm text-slate-600">Your content will be displayed optimally when shared on Facebook.</p>
              </div>
            </div>
          ) : result.scoreOpenGraph === "good" ? (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-blue-500 mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                thumb_up
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Good Open Graph Implementation</h4>
                <p className="text-sm text-slate-600">Your content will display well on Facebook, but has room for minor improvements.</p>
              </div>
            </div>
          ) : result.scoreOpenGraph === "needs-work" ? (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-warning mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                warning
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Incomplete Open Graph Implementation</h4>
                <p className="text-sm text-slate-600">Missing some recommended Open Graph properties that would improve Facebook sharing.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-error mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                error_outline
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Missing Open Graph Metadata</h4>
                <p className="text-sm text-slate-600">Your content won't display optimally when shared on Facebook.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  // Twitter Preview
  const renderTwitterPreview = () => (
    <motion.div
      className="space-y-4 mt-6"
      variants={previewVariants}
      initial="hidden"
      animate="visible"
    >
      {twitterTitle || twitterDesc || twitterImage ? (
        <div className="preview-card rounded-xl border border-slate-200 overflow-hidden max-w-xl shadow-md bg-white">
          <div className="border-b border-slate-100 p-3 flex items-center">
            <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white font-bold mr-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.15332H22.581L14.541 10.3433L24 22.8463H16.594L10.794 15.2623L4.156 22.8463H0.474L9.074 13.0163L0 1.15432H7.594L12.837 8.08632L18.901 1.15332Z" fill="white"/>
              </svg>
            </div>
            <div>
              <div className="font-medium text-slate-800">Username</div>
              <div className="text-xs text-slate-500">@username</div>
            </div>
          </div>
          
          {twitterImage ? (
            <motion.img 
              src={twitterImage} 
              alt="Twitter preview image" 
              className="w-full h-72 object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultImage;
              }}
            />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-400">
              <span className="material-icons mr-2">image_not_supported</span>
              No image specified
            </div>
          )}
          
          <div className="p-4">
            <div className="font-medium text-lg mb-2">{twitterTitle || "No title specified"}</div>
            <div className="text-slate-700 mb-3">{twitterDesc || "No description specified"}</div>
            <div className="text-slate-500 flex items-center text-sm">
              <span className="material-icons text-sm mr-1">link</span>
              {websiteDomain}
            </div>
          </div>
        </div>
      ) : (
        <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-xl p-10 flex items-center justify-center flex-col shadow-md">
          <span className="material-icons text-red-500 text-4xl mb-4">error_outline</span>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Twitter Card metadata not found</h3>
          <p className="text-slate-600 text-center max-w-md">Without Twitter Card tags, Twitter will display a basic link with no rich preview when your content is shared.</p>
        </div>
      )}
      
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-start">
          {result.scoreTwitter === "excellent" ? (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-green-500 mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
              >
                check_circle
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Perfect Twitter Card Implementation</h4>
                <p className="text-sm text-slate-600">Your content will be displayed optimally when shared on Twitter.</p>
              </div>
            </div>
          ) : result.scoreTwitter === "good" ? (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-blue-500 mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                thumb_up
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Good Twitter Card Implementation</h4>
                <p className="text-sm text-slate-600">Your content will display well on Twitter, but has room for minor improvements.</p>
              </div>
            </div>
          ) : result.scoreTwitter === "needs-work" ? (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-warning mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                warning
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Incomplete Twitter Card Implementation</h4>
                <p className="text-sm text-slate-600">Missing some recommended Twitter Card properties that would improve sharing.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <motion.span 
                className="material-icons text-error mr-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                error_outline
              </motion.span>
              <div>
                <h4 className="font-medium text-slate-800">Missing Twitter Card Metadata</h4>
                <p className="text-sm text-slate-600">Your content won't display optimally when shared on Twitter.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
  
  // LinkedIn Preview  
  const renderLinkedInPreview = () => (
    <motion.div
      className="space-y-4 mt-6"
      variants={previewVariants}
      initial="hidden"
      animate="visible"
    >
      {result.ogTitle || result.ogDescription || result.ogImage ? (
        <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-xl shadow-md">
          <div className="border-b border-slate-100 p-3 flex items-center">
            <div className="h-10 w-10 rounded-md bg-[#0A66C2] flex items-center justify-center text-white font-bold mr-3">in</div>
            <div>
              <div className="font-medium text-slate-800">Linkedin User</div>
              <div className="text-xs text-slate-500">500+ connections</div>
            </div>
          </div>
          
          <div className="p-4 border-b border-slate-100">
            <p className="text-slate-800 mb-2">Check out this interesting article I found</p>
          </div>
          
          <div className="border border-slate-200 m-4 rounded overflow-hidden">
            {ogImage ? (
              <motion.img 
                src={ogImage} 
                alt="LinkedIn preview image" 
                className="w-full h-72 object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultImage;
                }}
              />
            ) : (
              <div className="w-full h-72 bg-gray-200 flex items-center justify-center text-gray-400">
                <span className="material-icons mr-2">image_not_supported</span>
                No image specified
              </div>
            )}
            
            <div className="p-3 bg-white">
              <div className="text-xs text-[#65676B] mb-1">{websiteDomain}</div>
              <div className="font-medium mb-1 line-clamp-2">{ogTitle}</div>
              <div className="text-sm text-[#65676B] line-clamp-2">{ogDesc}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-xl p-10 flex items-center justify-center flex-col shadow-md">
          <span className="material-icons text-red-500 text-4xl mb-4">error_outline</span>
          <h3 className="text-lg font-medium text-slate-800 mb-2">Open Graph metadata not found</h3>
          <p className="text-slate-600 text-center max-w-md">LinkedIn uses Open Graph tags for rich previews. Without them, LinkedIn will display a basic link when your content is shared.</p>
        </div>
      )}
      
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center">
          <motion.span 
            className="material-icons text-warning mr-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            info
          </motion.span>
          <div>
            <h4 className="font-medium text-slate-800">Using Open Graph Tags for LinkedIn</h4>
            <p className="text-sm text-slate-600">LinkedIn uses Open Graph tags for rich previews. For best results, ensure your Open Graph tags are complete.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const previewIconStyle = "w-8 h-8 flex items-center justify-center";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-6">
        How your site appears in search results & social media
      </h2>
      
      <div className="bg-slate-50 p-1 rounded-lg mb-4 shadow-sm border border-slate-200">
        <div className="grid grid-cols-4 gap-1">
          <motion.button 
            onClick={() => setActivePreview('google')}
            className={`py-4 px-2 rounded-md flex flex-col items-center transition-all ${activePreview === 'google' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-white/50'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={previewIconStyle}>
              <svg viewBox="0 0 24 24" className="w-6 h-6 mr-0" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.501 12.2243C22.501 11.3433 22.4296 10.5012 22.2956 9.69189H12.2148V13.9447H18.0319C17.7956 15.3201 17.0629 16.4911 15.9559 17.2641V19.9355H19.4412C21.4647 17.9874 22.501 15.359 22.501 12.2243Z" fill="#4285F4"/>
                <path d="M12.214 22.5C15.1068 22.5 17.5353 21.5378 19.4447 19.9354L15.9594 17.264C14.9996 17.9146 13.7328 18.3067 12.214 18.3067C9.49823 18.3067 7.22202 16.5305 6.34996 14.1128H2.76172V16.8622C4.65822 20.2625 8.17314 22.5 12.214 22.5Z" fill="#34A853"/>
                <path d="M6.34626 14.1128C6.14626 13.462 6.03516 12.7681 6.03516 12.0001C6.03516 11.2321 6.14626 10.5382 6.34626 9.88745V7.13806H2.75802C2.02441 8.59525 1.60547 10.2493 1.60547 12.0001C1.60547 13.7509 2.02441 15.4049 2.75802 16.8621L6.34626 14.1128Z" fill="#FBBC05"/>
                <path d="M12.214 5.69333C13.7508 5.69333 15.1246 6.24713 16.1949 7.27325L19.2949 4.17333C17.5283 2.51857 15.0997 1.5 12.214 1.5C8.17314 1.5 4.65822 3.73748 2.76172 7.13775L6.34996 9.88713C7.22202 7.46952 9.49823 5.69333 12.214 5.69333Z" fill="#EA4335"/>
              </svg>
            </div>
            <span className="text-sm font-medium mt-1">Google</span>
          </motion.button>
          
          <motion.button 
            onClick={() => setActivePreview('facebook')}
            className={`py-4 px-2 rounded-md flex flex-col items-center transition-all ${activePreview === 'facebook' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-white/50'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={previewIconStyle}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073C24 5.404 18.629 0 12.001 0C5.37 0 0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.413C10.125 6.385 11.917 4.713 14.658 4.713C15.97 4.713 17.344 4.949 17.344 4.949V7.896H15.83C14.339 7.896 13.874 8.822 13.874 9.771V12.073H17.202L16.67 15.563H13.874V24C19.612 23.094 24 18.1 24 12.073Z" fill="#1877F2"/>
              </svg>
            </div>
            <span className="text-sm font-medium mt-1">Facebook</span>
          </motion.button>
          
          <motion.button 
            onClick={() => setActivePreview('twitter')}
            className={`py-4 px-2 rounded-md flex flex-col items-center transition-all ${activePreview === 'twitter' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-white/50'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={previewIconStyle}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.901 1.15332H22.581L14.541 10.3433L24 22.8463H16.594L10.794 15.2623L4.156 22.8463H0.474L9.074 13.0163L0 1.15432H7.594L12.837 8.08632L18.901 1.15332ZM17.61 20.6443H19.649L6.486 3.24032H4.298L17.61 20.6443Z" fill="#000000"/>
              </svg>
            </div>
            <span className="text-sm font-medium mt-1">Twitter</span>
          </motion.button>
          
          <motion.button 
            onClick={() => setActivePreview('linkedin')}
            className={`py-4 px-2 rounded-md flex flex-col items-center transition-all ${activePreview === 'linkedin' ? 'bg-white shadow-sm text-primary' : 'text-slate-600 hover:bg-white/50'}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={previewIconStyle}>
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 2.667C0 1.194 1.194 0 2.667 0H21.333C22.806 0 24 1.194 24 2.667V21.333C24 22.806 22.806 24 21.333 24H2.667C1.194 24 0 22.806 0 21.333V2.667ZM7.334 9.333H10.667V10.667C11.041 9.87 12.137 9.133 13.836 9.133C17.319 9.133 18.001 10.956 18.001 14.311V18.667H14.667V14.974C14.667 13.465 14.217 12.483 13.134 12.483C11.576 12.483 10.667 13.526 10.667 14.975V18.667H7.334V9.333ZM2.667 9.333H6.001V18.667H2.667V9.333ZM6.334 5.333C6.334 6.437 5.438 7.333 4.334 7.333C3.231 7.333 2.334 6.437 2.334 5.333C2.334 4.23 3.231 3.333 4.334 3.333C5.438 3.333 6.334 4.23 6.334 5.333Z" fill="#0A66C2"/>
              </svg>
            </div>
            <span className="text-sm font-medium mt-1">LinkedIn</span>
          </motion.button>
        </div>
      </div>
      
      {/* Active Preview */}
      <div className="preview-container">
        {activePreview === 'google' && renderGooglePreview()}
        {activePreview === 'facebook' && renderFacebookPreview()}
        {activePreview === 'twitter' && renderTwitterPreview()}
        {activePreview === 'linkedin' && renderLinkedInPreview()}
      </div>
    </motion.div>
  );
}
