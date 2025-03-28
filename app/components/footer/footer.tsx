"use client";

import { motion } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function PublicationFooter() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    jobLevel: '',
    company: '',
    consent: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : formData.consent;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for subscribing!');
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      jobTitle: '',
      jobLevel: '',
      company: '',
      consent: false
    });
  };

  return (
    <footer className="bg-gray-950 text-gray-100 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 bg-gray-900 rounded-2xl p-8 shadow-lg"
        >
          <div className="max-w-4xl mx-auto">
            <div className="md:flex md:items-end md:justify-between md:gap-8">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-white mb-2">Stay updated with our newsletter</h2>
                <p className="text-gray-400 max-w-md">
                  Get the latest data science articles, tutorials, and industry insights delivered to your inbox.
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">Email address*</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-300">First name*</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder="First name"
                    />
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      required
                      checked={formData.consent}
                      onChange={handleChange}
                      className="w-4 h-4 rounded bg-gray-800 border-gray-700 focus:ring-indigo-500"
                    />
                  </div>
                  <label htmlFor="consent" className="ml-3 text-sm text-gray-400">
                    I consent to receive newsletters and other communications from Towards Data Science publications*
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="w-full md:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/20"
                >
                  <FiMail className="w-5 h-5" />
                  Subscribe Now
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </motion.section>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="flex flex-col items-start">
              <Link href="/" className="group mb-4">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="flex flex-col"
                >
                  <h1 className="text-3xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    towards
                  </h1>
                  <h2 className="text-2xl font-light text-gray-300 group-hover:text-indigo-300 transition-colors -mt-1">
                    data science
                  </h2>
                </motion.div>
              </Link>
              
              <p className="text-gray-400 mb-6">
                Your home for data science and AI. The world&apos;s leading publication for data science, data analytics, data engineering, machine learning, and artificial intelligence professionals.
              </p>
              
              <div className="flex items-center gap-4">
                <Link href="/about" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors">
                  Learn about us <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/latest" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link href="/topics" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Topics
                </Link>
              </li>
              <li>
                <Link href="/picks" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Editors&apos; Picks
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Resources
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 group">
                  <FiArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Insight Media Group, LLC. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <p className="text-indigo-400 font-medium text-sm">
                Towards Data Science is now independent
              </p>
              
              <div className="flex items-center gap-4">
                <Link href="/about" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  About
                </Link>
                <Link href="/privacy" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}