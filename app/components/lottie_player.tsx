"use client"
import { useEffect, useState } from "react";
import Lottie from "lottie-react";

interface LottieProps {
  animationPath: string;
}

export default function LottiePlayer({ animationPath }: LottieProps) {
  const [animationData, setAnimationData] = useState<unknown>(null);

  useEffect(() => {
    import(`/public${animationPath}`)
      .then((data) => setAnimationData(data.default))
      .catch((err) => console.error("Error loading Lottie file", err));
  }, [animationPath]);

  if (!animationData) return <div className="text-center text-gray-500">Loading animation...</div>;

  return <Lottie animationData={animationData} loop={true} />;
}
