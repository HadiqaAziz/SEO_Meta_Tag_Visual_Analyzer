import React from "react";
import { AnalyzedSite } from "@shared/schema";
import { formatPathForDisplay } from "@/lib/seo-utils";

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
  
  return (
    <>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">How your site appears in search results & social media</h2>
      
      <div className="space-y-8">
        {/* Google Preview */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.501 12.2243C22.501 11.3433 22.4296 10.5012 22.2956 9.69189H12.2148V13.9447H18.0319C17.7956 15.3201 17.0629 16.4911 15.9559 17.2641V19.9355H19.4412C21.4647 17.9874 22.501 15.359 22.501 12.2243Z" fill="#4285F4"/>
              <path d="M12.214 22.5C15.1068 22.5 17.5353 21.5378 19.4447 19.9354L15.9594 17.264C14.9996 17.9146 13.7328 18.3067 12.214 18.3067C9.49823 18.3067 7.22202 16.5305 6.34996 14.1128H2.76172V16.8622C4.65822 20.2625 8.17314 22.5 12.214 22.5Z" fill="#34A853"/>
              <path d="M6.34626 14.1128C6.14626 13.462 6.03516 12.7681 6.03516 12.0001C6.03516 11.2321 6.14626 10.5382 6.34626 9.88745V7.13806H2.75802C2.02441 8.59525 1.60547 10.2493 1.60547 12.0001C1.60547 13.7509 2.02441 15.4049 2.75802 16.8621L6.34626 14.1128Z" fill="#FBBC05"/>
              <path d="M12.214 5.69333C13.7508 5.69333 15.1246 6.24713 16.1949 7.27325L19.2949 4.17333C17.5283 2.51857 15.0997 1.5 12.214 1.5C8.17314 1.5 4.65822 3.73748 2.76172 7.13775L6.34996 9.88713C7.22202 7.46952 9.49823 5.69333 12.214 5.69333Z" fill="#EA4335"/>
            </svg>
            Google Search Result
          </h3>
          <div className="preview-card bg-white border border-slate-200 rounded-lg p-4 max-w-2xl">
            <div className="text-xl text-blue-800 mb-1 font-medium line-clamp-1">{googleTitle}</div>
            <div className="text-green-700 text-sm mb-1">{googleUrl}</div>
            <div className="text-sm text-slate-700 line-clamp-2">{googleDesc}</div>
          </div>
          <div className="text-sm text-slate-500 flex items-center">
            {result.scoreTitle === "excellent" && result.scoreDescription === "excellent" ? (
              <>
                <span className="material-icons text-success mr-1 text-sm">check_circle</span>
                Optimized title and description that fit Google's display limits
              </>
            ) : (
              <>
                <span className="material-icons text-warning mr-1 text-sm">warning</span>
                {result.scoreTitle !== "excellent" ? "Title could be improved. " : ""}
                {result.scoreDescription !== "excellent" ? "Description could be improved." : ""}
              </>
            )}
          </div>
        </div>

        {/* Facebook Preview */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 12.073C24 5.404 18.629 0 12.001 0C5.37 0 0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.413C10.125 6.385 11.917 4.713 14.658 4.713C15.97 4.713 17.344 4.949 17.344 4.949V7.896H15.83C14.339 7.896 13.874 8.822 13.874 9.771V12.073H17.202L16.67 15.563H13.874V24C19.612 23.094 24 18.1 24 12.073Z" fill="#1877F2"/>
            </svg>
            Facebook Sharing Preview
          </h3>
          {result.ogTitle || result.ogDescription || result.ogImage ? (
            <div className="preview-card bg-[#F0F2F5] border border-slate-200 rounded-lg overflow-hidden max-w-md">
              <div className="bg-white p-3">
                <div className="text-xs text-[#65676B] uppercase tracking-wider mb-1">{websiteDomain}</div>
              </div>
              <div>
                {ogImage ? (
                  <img 
                    src={ogImage} 
                    alt="Facebook preview image" 
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      // If image fails to load, replace with placeholder
                      e.currentTarget.onerror = null; // Prevent infinite callbacks
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400">
                    No image specified
                  </div>
                )}
              </div>
              <div className="bg-white p-3">
                <div className="font-medium mb-1 line-clamp-2">{ogTitle}</div>
                <div className="text-sm text-[#65676B] line-clamp-3">{ogDesc}</div>
              </div>
            </div>
          ) : (
            <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-md">
              <div className="text-center p-12 bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-icons mr-2">error_outline</span>
                Open Graph metadata not found
              </div>
            </div>
          )}
          <div className="text-sm text-slate-500 flex items-center">
            {result.scoreOpenGraph === "excellent" ? (
              <>
                <span className="material-icons text-success mr-1 text-sm">check_circle</span>
                Complete Open Graph implementation for optimal social sharing
              </>
            ) : result.scoreOpenGraph === "good" ? (
              <>
                <span className="material-icons text-success mr-1 text-sm">check_circle</span>
                Good Open Graph implementation, but could be improved
              </>
            ) : result.scoreOpenGraph === "needs-work" ? (
              <>
                <span className="material-icons text-warning mr-1 text-sm">warning</span>
                Incomplete Open Graph implementation - missing recommended properties
              </>
            ) : (
              <>
                <span className="material-icons text-error mr-1 text-sm">error_outline</span>
                Missing Open Graph metadata - content won't display optimally when shared
              </>
            )}
          </div>
        </div>

        {/* Twitter Preview */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.901 1.15332H22.581L14.541 10.3433L24 22.8463H16.594L10.794 15.2623L4.156 22.8463H0.474L9.074 13.0163L0 1.15432H7.594L12.837 8.08632L18.901 1.15332ZM17.61 20.6443H19.649L6.486 3.24032H4.298L17.61 20.6443Z" fill="#000000"/>
            </svg>
            Twitter Card Preview
          </h3>
          {twitterTitle || twitterDesc || twitterImage ? (
            <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-md">
              {twitterImage ? (
                <img 
                  src={twitterImage} 
                  alt="Twitter preview image" 
                  className="w-full h-52 object-cover"
                  onError={(e) => {
                    // If image fails to load, replace with placeholder
                    e.currentTarget.onerror = null; // Prevent infinite callbacks
                    e.currentTarget.src = defaultImage;
                  }}
                />
              ) : (
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400">
                  No image specified
                </div>
              )}
              <div className="p-4">
                <div className="font-medium mb-1">{twitterTitle || "No title specified"}</div>
                <div className="text-sm text-gray-500 mb-2">{twitterDesc || "No description specified"}</div>
                <div className="text-xs text-gray-400">{websiteDomain}</div>
              </div>
            </div>
          ) : (
            <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-md">
              <div className="text-center p-12 bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-icons mr-2">error_outline</span>
                Twitter Card metadata not found
              </div>
            </div>
          )}
          <div className="text-sm text-slate-500 flex items-center">
            {result.scoreTwitter === "excellent" ? (
              <>
                <span className="material-icons text-success mr-1 text-sm">check_circle</span>
                Complete Twitter Card implementation for optimal Twitter sharing
              </>
            ) : result.scoreTwitter === "good" ? (
              <>
                <span className="material-icons text-success mr-1 text-sm">check_circle</span>
                Good Twitter Card implementation, but could be improved
              </>
            ) : result.scoreTwitter === "needs-work" ? (
              <>
                <span className="material-icons text-warning mr-1 text-sm">warning</span>
                Incomplete Twitter Card implementation - missing recommended properties
              </>
            ) : (
              <>
                <span className="material-icons text-error mr-1 text-sm">error_outline</span>
                Missing Twitter Card metadata - content won't display optimally when shared
              </>
            )}
          </div>
        </div>

        {/* LinkedIn Preview */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 2.667C0 1.194 1.194 0 2.667 0H21.333C22.806 0 24 1.194 24 2.667V21.333C24 22.806 22.806 24 21.333 24H2.667C1.194 24 0 22.806 0 21.333V2.667ZM7.334 9.333H10.667V10.667C11.041 9.87 12.137 9.133 13.836 9.133C17.319 9.133 18.001 10.956 18.001 14.311V18.667H14.667V14.974C14.667 13.465 14.217 12.483 13.134 12.483C11.576 12.483 10.667 13.526 10.667 14.975V18.667H7.334V9.333ZM2.667 9.333H6.001V18.667H2.667V9.333ZM6.334 5.333C6.334 6.437 5.438 7.333 4.334 7.333C3.231 7.333 2.334 6.437 2.334 5.333C2.334 4.23 3.231 3.333 4.334 3.333C5.438 3.333 6.334 4.23 6.334 5.333Z" fill="#0A66C2"/>
            </svg>
            LinkedIn Sharing Preview
          </h3>
          {result.ogTitle || result.ogDescription || result.ogImage ? (
            <div className="preview-card bg-[#F3F2EF] border border-slate-200 rounded-lg overflow-hidden max-w-md">
              <div>
                {ogImage ? (
                  <img 
                    src={ogImage} 
                    alt="LinkedIn preview image" 
                    className="w-full h-52 object-cover"
                    onError={(e) => {
                      // If image fails to load, replace with placeholder
                      e.currentTarget.onerror = null; // Prevent infinite callbacks
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-400">
                    No image specified
                  </div>
                )}
              </div>
              <div className="bg-white p-3">
                <div className="text-xs text-[#65676B] mb-1">{websiteDomain}</div>
                <div className="font-medium mb-1 line-clamp-2">{ogTitle}</div>
                <div className="text-sm text-[#65676B] line-clamp-2">{ogDesc}</div>
              </div>
            </div>
          ) : (
            <div className="preview-card bg-white border border-slate-200 rounded-lg overflow-hidden max-w-md">
              <div className="text-center p-12 bg-slate-100 flex items-center justify-center text-slate-400">
                <span className="material-icons mr-2">error_outline</span>
                Open Graph metadata not found
              </div>
            </div>
          )}
          <div className="text-sm text-slate-500 flex items-center">
            <span className="material-icons text-warning mr-1 text-sm">warning</span>
            Using fallback Open Graph tags - no LinkedIn-specific optimizations
          </div>
        </div>
      </div>
    </>
  );
}
