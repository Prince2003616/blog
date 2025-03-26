"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { FiRefreshCw, FiAlertTriangle } from "react-icons/fi";
import { motion } from "framer-motion";

// Types
interface Blog {
  heading: string;
  subHeading: string;
  publishedDate: string;
  slug: string;
  lottie: string;
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
    <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg animate-pulse" />
  ),
});

// Loading component
const BlogCardSkeleton = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="block bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
  >
    <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg" />
    <div className="mt-4 space-y-2">
      <div className="h-6 bg-gray-200 animate-pulse rounded" />
      <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
    </div>
  </motion.div>
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

      const blogResponse = await fetch("/data.json");
      if (!blogResponse.ok)
        throw new Error(`HTTP error! status: ${blogResponse.status}`);

      const json = await blogResponse.json();
      if (!json.variations) throw new Error("Invalid data format");

      setBlogs(json.variations);

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
      <div className="max-w-5xl mx-auto p-6 text-center">
        <div className="bg-red-50 p-6 rounded-xl inline-block">
          <FiAlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center mx-auto"
          >
            <FiRefreshCw className="mr-2" />
            Retry
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-amber-50 to-orange-100">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Latest Articles
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our collection of insightful articles and tutorials
        </p>
      </motion.div>

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
            >
              <Link
                href={`/blog/${blog.slug}`}
                className="block bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all h-full"
                aria-label={`Read ${blog.heading}`}
              >
                <div className="h-48 flex justify-center items-center mb-4 overflow-hidden rounded-lg">
                  {lottieAnimations[blog.slug] ? (
                    <Lottie
                      animationData={lottieAnimations[blog.slug]}
                      className="w-full h-full object-cover"
                      aria-hidden="true"
                    />
                  ) : (
                    <FiAlertTriangle className="h-12 w-12 text-gray-300" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">
                    {blog.publishedDate}
                  </p>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {blog.heading}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.subHeading}
                  </p>
                  <span className="inline-block text-blue-600 font-medium hover:text-blue-800 transition">
                    Read more →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
