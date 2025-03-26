"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  FiCalendar, 
  FiClock, 
  FiChevronLeft,
  FiShare2,
  FiBookmark,
  FiAlertTriangle,
  FiRefreshCw
} from "react-icons/fi";
import { motion } from "framer-motion";
import readingTime from "reading-time";
import { toast } from "react-hot-toast";

// Types
type Blog = {
  id: number;
  heading: string;
  subHeading: string;
  description: string;
  lottie: string;
  publishedDate: string;
  slug: string;
  tags: string[];
  readTime: string;
  subHeading2: string;
  description2: string;
  list: string[];
  subHeading3: string;
  description3: string;
  list2: string[];
};

type LottieAnimationData = {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  layers: unknown[];
};

const Lottie = dynamic(() => import("lottie-react"), { 
  ssr: false,
  loading: () => (
    <div className="h-80 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl animate-pulse" />
  )
});

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!slug || typeof slug !== "string") {
        throw new Error("Invalid blog URL");
      }

      const dataResponse = await fetch('/data.json');
      if (!dataResponse.ok) throw new Error(`Failed to load data (status ${dataResponse.status})`);
      
      const jsonData = await dataResponse.json();
      const foundBlog = jsonData.variations.find((b: Blog) => b.slug === slug);
      if (!foundBlog) throw new Error("Blog not found");
      
      // Calculate reading time if not provided
      const contentToAnalyze = `${foundBlog.description} ${foundBlog.description2} ${foundBlog.description3}`;
      const calculatedReadTime = foundBlog.readTime || readingTime(contentToAnalyze).text;
      
      setBlog({ 
        ...foundBlog,
        readTime: calculatedReadTime
      });
      
      const lottieResponse = await fetch(foundBlog.lottie);
      if (!lottieResponse.ok) throw new Error("Failed to load animation");
      setAnimationData(await lottieResponse.json());
      
    } catch (err) {
      console.error("Blog loading error:", err);
      setError(err instanceof Error ? err.message : "Failed to load blog content");
      toast.error("Failed to load blog content");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link"));
    }
  };

  if (error === "Blog not found") return notFound();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Blog</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchBlogData}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center mx-auto"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (loading || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="animate-pulse space-y-8">
            <div className="flex flex-wrap gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full w-24"></div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-96 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`h-4 bg-gray-200 rounded ${i % 2 ? 'w-5/6' : 'w-full'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-white to-gray-50"
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Header with gradient background */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white"
          >
            <div className="flex flex-wrap gap-2 mb-4">
              {blog.tags.map((tag) => (
                <motion.span 
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">{blog.heading}</h1>
            <p className="text-lg md:text-xl opacity-90 mb-4">{blog.subHeading}</p>
            
            <div className="flex items-center text-sm opacity-80">
              <FiCalendar className="mr-1" />
              <span>{blog.publishedDate}</span>
              <span className="mx-2">•</span>
              <FiClock className="mr-1" />
              <span>{blog.readTime}</span>
            </div>
          </motion.div>

          {/* Content area */}
          <div className="p-8">
            {/* Lottie Animation */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="my-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-100"
            >
              {animationData ? (
                <Lottie 
                  animationData={animationData} 
                  loop={true}
                  className="w-full h-auto"
                />
              ) : (
                <div className="h-80 flex items-center justify-center text-gray-400">
                  <FiRefreshCw className="h-12 w-12 animate-spin" />
                </div>
              )}
            </motion.div>

            {/* Main content */}
            <div className="prose prose-lg max-w-none">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-700 leading-relaxed mb-6"
              >
                {blog.description}
              </motion.p>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="my-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  {blog.subHeading2}
                </h2>
                <p className="text-gray-700 mb-4">{blog.description2}</p>
                <ul className="space-y-3 pl-5">
                  {blog.list.map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-gray-700 relative pl-6"
                    >
                      <span className="absolute left-0 top-2 w-2 h-2 bg-blue-400 rounded-full"></span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="my-8"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                  {blog.subHeading3}
                </h2>
                <p className="text-gray-700 mb-4">{blog.description3}</p>
                <ul className="space-y-3 pl-5">
                  {blog.list2.map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index + 0.2 }}
                      className="text-gray-700 relative pl-6"
                    >
                      <span className="absolute left-0 top-2 w-2 h-2 bg-indigo-400 rounded-full"></span>
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </motion.section>
            </div>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="border-t border-gray-100 p-6 bg-gray-50"
          >
            <div className="flex justify-between items-center">
              <Link href="/" passHref legacyBehavior>
                <motion.a
                  whileHover={{ x: -2 }}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center cursor-pointer"
                >
                  <FiChevronLeft className="mr-1" />
                  Back to Blogs
                </motion.a>
              </Link>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Share"
                  onClick={handleCopyLink}
                >
                  <FiShare2 />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Bookmark"
                >
                  <FiBookmark />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogDetailsPage;