"use client";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import Header from "../../components/custom/headbar";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const Contact = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/contactus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message.");
      }
    } catch (error) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`${poppins.className} w-full h-screen bg-[#2F322F] text-white overflow-hidden`}
    >
      <Header />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-6">
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-xl">
          <button
            onClick={() => router.back()}
            className="absolute left-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold mb-6 text-center">Get in Touch</h1>
          <p className="text-gray-300 text-center mb-8">
            Have questions? We&apos;d love to hear from you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block text-gray-300 text-sm font-medium mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition duration-200"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-300 text-sm font-medium mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition duration-200"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>

            <div>
              <label
                className="block text-gray-300 text-sm font-medium mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white/30 transition duration-200 resize-none"
                name="message"
                placeholder="Your message here..."
                rows="4"
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
                required
              ></textarea>
            </div>

            <button
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 px-6 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
