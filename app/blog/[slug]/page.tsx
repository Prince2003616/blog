"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, notFound, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { 
  FiCalendar, 
  FiClock, 
  FiChevronLeft,
  FiShare2,
  FiBookmark,
  FiAlertTriangle,
  FiRefreshCw,
  FiExternalLink,
  FiStar
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import readingTime from "reading-time";
import { toast } from "react-hot-toast";
// import Image from "next/image";

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
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  subHeading2: string;
  description2: string;
  list: Array<{ title: string; detail: string }>;
  subHeading3: string;
  description3: string;
  list2: Array<{ title: string; detail: string }>;
  caseStudy?: {
    title: string;
    summary: string;
    link: string;
  };
  quote?: {
    text: string;
    author: string;
  };
  statistic?: {
    value: string;
    label: string;
  };
  warning?: {
    title: string;
    detail: string;
  };
  alert?: {
    level: "High" | "Medium" | "Low";
    message: string;
  };
  successStory?: {
    company: string;
    result: string;
  };
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
    <div className="h-80 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl animate-pulse" />
  )
});

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [animationData, setAnimationData] = useState<LottieAnimationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const fetchBlogData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!slug || typeof slug !== "string") {
        throw new Error("Invalid blog URL");
      }

      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 500));

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
      
      // Check if blog is bookmarked
      const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
      setIsBookmarked(!!bookmarks[foundBlog.id]);
      
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

  const toggleBookmark = () => {
    if (!blog) return;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '{}');
    const newBookmarkedState = !isBookmarked;
    
    if (newBookmarkedState) {
      bookmarks[blog.id] = true;
      toast.success("Saved to bookmarks");
    } else {
      delete bookmarks[blog.id];
      toast("Removed from bookmarks", { icon: "🗑️" });
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    setIsBookmarked(newBookmarkedState);
  };

  if (error === "Blog not found") return notFound();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Blog</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchBlogData}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center shadow-sm"
            >
              <FiRefreshCw className="mr-2" />
              Try Again
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center border border-gray-200 shadow-sm"
            >
              <FiChevronLeft className="mr-2" />
              Go Home
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading || !blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
            <div className="h-96 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl"></div>
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
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
          {/* Header with gradient background */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white relative"
          >
            <div className="absolute top-6 right-6 flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleBookmark}
                className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
              >
                <FiBookmark className={`w-5 h-5 ${isBookmarked ? "fill-yellow-300 text-yellow-300" : ""}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCopyLink}
                className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                aria-label="Share"
              >
                <FiShare2 className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-5">
              {blog.tags.map((tag) => (
                <motion.span 
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-sm font-medium"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight tracking-tight">{blog.heading}</h1>
            <p className="text-lg md:text-xl opacity-90 mb-6 leading-relaxed">{blog.subHeading}</p>
            
            {/* Author Section
            <div className="flex items-center gap-3 mb-6">
              <Image 
                src={blog.author.avatar} 
                alt={blog.author.name} 
                className="w-12 h-12 rounded-full border-2 border-white/20"
              />
              <div>
                <p className="font-semibold">{blog.author.name}</p>
                <p className="text-sm opacity-90">{blog.author.role}</p>
              </div>
            </div> */}
            
            <div className="flex flex-wrap items-center text-sm opacity-90 gap-3">
              <span className="flex items-center gap-1.5">
                <FiCalendar className="w-4 h-4" />
                {blog.publishedDate}
              </span>
              <span className="text-white/50">•</span>
              <span className="flex items-center gap-1.5">
                <FiClock className="w-4 h-4" />
                {blog.readTime}
              </span>
            </div>
          </motion.div>

          {/* Content area */}
          <div className="p-8">
            {/* Lottie Animation */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="my-8 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 hover:shadow-sm transition-shadow duration-300"
            >
              <AnimatePresence mode="wait">
                {animationData ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Lottie 
                      animationData={animationData} 
                      loop={true}
                      className="w-full h-auto"
                    />
                  </motion.div>
                ) : (
                  <div className="h-80 flex items-center justify-center text-gray-400">
                    <FiRefreshCw className="h-12 w-12 animate-spin" />
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Main content */}
            <div className="prose prose-lg max-w-none">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-gray-700 leading-relaxed mb-8 text-lg"
              >
                {blog.description}
              </motion.p>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="my-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-3"></span>
                  {blog.subHeading2}
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">{blog.description2}</p>
                <ul className="space-y-4 pl-5">
                  {blog.list.map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index }}
                      className="text-gray-700 relative pl-7 text-lg leading-relaxed"
                    >
                      <span className="absolute left-0 top-3 w-2.5 h-2.5 bg-blue-400 rounded-full"></span>
                      <strong className="font-medium block">{item.title}</strong>
                      <p className="mt-1 text-gray-600">{item.detail}</p>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="my-10"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-5 flex items-center">
                  <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                  {blog.subHeading3}
                </h2>
                <p className="text-gray-700 mb-6 leading-relaxed">{blog.description3}</p>
                <ul className="space-y-4 pl-5">
                  {blog.list2.map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * index + 0.2 }}
                      className="text-gray-700 relative pl-7 text-lg leading-relaxed"
                    >
                      <span className="absolute left-0 top-3 w-2.5 h-2.5 bg-indigo-400 rounded-full"></span>
                      <strong className="font-medium block">{item.title}</strong>
                      <p className="mt-1 text-gray-600">{item.detail}</p>
                    </motion.li>
                  ))}
                </ul>
              </motion.section>

              {/* Special Content Blocks */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
                className="space-y-8 mt-12"
              >
                {blog.caseStudy && (
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-800 mb-3">
                      <FiBookmark className="inline mr-2" />
                      {blog.caseStudy.title}
                    </h3>
                    <p className="text-blue-700 mb-4">{blog.caseStudy.summary}</p>
                    <Link
                      href={blog.caseStudy.link}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                    >
                      Read Full Case Study
                      <FiExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {blog.quote && (
                  <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                    <blockquote className="text-purple-800 text-xl italic mb-3">
                      &ldquo;{blog.quote.text}&rdquo;
                    </blockquote>
                    <p className="text-purple-700 font-medium">— {blog.quote.author}</p>
                  </div>
                )}

                {blog.statistic && (
                  <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                    <div className="text-4xl font-bold text-green-800 mb-2">
                      {blog.statistic.value}
                    </div>
                    <p className="text-green-700">{blog.statistic.label}</p>
                  </div>
                )}

                {blog.warning && (
                  <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200">
                    <div className="flex items-center gap-3 mb-3">
                      <FiAlertTriangle className="w-6 h-6 text-yellow-700" />
                      <h3 className="text-lg font-semibold text-yellow-800">
                        {blog.warning.title}
                      </h3>
                    </div>
                    <p className="text-yellow-700">{blog.warning.detail}</p>
                  </div>
                )}

                {blog.successStory && (
                  <div className="bg-teal-50 p-6 rounded-xl border border-teal-200">
                    <div className="flex items-center gap-3 mb-3">
                      <FiStar className="w-6 h-6 text-teal-700" />
                      <h3 className="text-lg font-semibold text-teal-800">
                        Success Story: {blog.successStory.company}
                      </h3>
                    </div>
                    <p className="text-teal-700">{blog.successStory.result}</p>
                  </div>
                )}

                {blog.alert && (
                  <div className={`${blog.alert.level === "High" ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"} p-6 rounded-xl border`}>
                    <div className="flex items-center gap-3 mb-3">
                      <FiAlertTriangle className={`w-6 h-6 ${blog.alert.level === "High" ? "text-red-700" : "text-orange-700"}`} />
                      <h3 className={`text-lg font-semibold ${blog.alert.level === "High" ? "text-red-800" : "text-orange-800"}`}>
                        {blog.alert.level} Priority
                      </h3>
                    </div>
                    <p className={`${blog.alert.level === "High" ? "text-red-700" : "text-orange-700"}`}>
                      {blog.alert.message}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="border-t border-gray-100 p-6 bg-gray-50"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <Link href="/" passHref legacyBehavior>
                <motion.a
                  whileHover={{ x: -2 }}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <FiChevronLeft className="w-5 h-5" />
                  Back to Blogs
                </motion.a>
              </Link>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <span className="text-sm text-gray-500 font-medium">
                  Enjoyed this article? Share it!
                </span>
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 bg-white rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-all"
                    aria-label="Share on Twitter"
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.heading)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2.5 bg-white rounded-full shadow-sm border border-gray-200 text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all"
                    aria-label="Share on LinkedIn"
                    onClick={() => {
                      window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.heading)}`, '_blank');
                    }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </article>
      </div>
    </motion.div>
  );
};

export default BlogDetailsPage;