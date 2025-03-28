"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FiRefreshCw, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

// Types
interface Blog {
  id: string;
  heading: string;
  subHeading: string;
  publishedDate: string;
  slug: string;
  lottie: string;
  tags?: string[];
  readTime?: string;
}

interface LottieAnimationData {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  layers: unknown[];
}

// Components
const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
  loading: () => (
    <div className="h-48 w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl animate-pulse" />
  ),
});

// Loading Skeleton Component
const BlogCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 h-full">
    <div className="h-48 bg-gradient-to-r from-gray-50 to-gray-100 animate-pulse" />
    <div className="p-6 space-y-4">
      <div className="h-5 bg-gray-200 rounded-full w-3/4 animate-pulse" />
      <div className="h-4 bg-gray-200 rounded-full w-1/2 animate-pulse" />
      <div className="pt-4">
        <div className="h-4 bg-gray-200 rounded-full w-24 animate-pulse" />
      </div>
    </div>
  </div>
);

export default function BlogLandingPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [lottieAnimations, setLottieAnimations] = useState<
    Record<string, LottieAnimationData>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate network delay for demo purposes
      await new Promise(resolve => setTimeout(resolve, 800));

      const blogResponse = await fetch("/data.json");
      if (!blogResponse.ok) {
        throw new Error(`Failed to load blogs (status ${blogResponse.status})`);
      }

      const json = await blogResponse.json();
      if (!json.variations) throw new Error("Invalid data format");

      setBlogs(json.variations);

      // Load Lottie animations in parallel
      const lottieResults = await Promise.all(
        json.variations.map(async (blog: Blog) => {
          try {
            const res = await fetch(blog.lottie);
            if (!res.ok) throw new Error(`Failed to load ${blog.lottie}`);
            return {
              slug: blog.slug,
              data: (await res.json()) as LottieAnimationData,
            };
          } catch (err) {
            console.error("Lottie load error:", err);
            return null;
          }
        })
      );

      const animationsMap: Record<string, LottieAnimationData> = {};
      lottieResults.forEach((item) => {
        if (item) animationsMap[item.slug] = item.data;
      });
      setLottieAnimations(animationsMap);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertTriangle className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Blogs</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:shadow-md transition-all duration-300 flex items-center justify-center mx-auto shadow-sm"
          >
            <FiRefreshCw className="mr-2" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Latest Insights
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
            Discover our collection of in-depth articles, tutorials, and industry perspectives
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {blogs.map((blog) => (
                <motion.div
                  key={blog.slug}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="block h-full group"
                    aria-label={`Read ${blog.heading}`}
                  >
                    <article className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300 h-full flex flex-col">
                      {/* Lottie Animation */}
                      <div className="h-48 w-full bg-gray-50 relative overflow-hidden">
                        <AnimatePresence mode="wait">
                          {lottieAnimations[blog.slug] ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="h-full w-full"
                            >
                              <Lottie
                                animationData={lottieAnimations[blog.slug]}
                                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                                aria-hidden="true"
                              />
                            </motion.div>
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
                              <FiAlertTriangle className="h-12 w-12 text-gray-300" />
                            </div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-grow flex flex-col">
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {blog.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex-grow">
                          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {blog.heading}
                          </h2>
                          <p className="text-gray-600 mb-4 line-clamp-3 font-light leading-relaxed">
                            {blog.subHeading}
                          </p>
                        </div>

                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {blog.publishedDate}
                            {blog.readTime && (
                              <span className="mx-1.5">•</span>
                            )}
                            {blog.readTime}
                          </span>
                          <span className="inline-flex items-center text-blue-600 group-hover:text-blue-700 transition-colors font-medium">
                            Read more
                            <FiArrowRight className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}