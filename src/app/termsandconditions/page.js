"use client";
import React, { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import Header from "../../components/custom/headbar";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});

const TermsAndConditionsPage = () => {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    setLastUpdated(new Date().toLocaleDateString());
  }, []);

  return (
    <div className={`min-h-screen w-full  text-white ${poppins.className}`}>
      <Header />
      <div className=" mx-auto px-4 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-lg text-gray-300">
            Please read these terms carefully before using our service.
          </p>
        </header>

        <div className="space-y-8 text-gray-200">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Service Usage</h2>
            <p className="text-lg mb-6">
              By using our service, you agree to the following terms:
            </p>

            <div className="space-y-6">
              <div className="pl-4 border-l-2 border-gray-700">
                <h3 className="text-xl mb-2">Entertainment Purpose</h3>
                <p className="text-base">
                  This platform and its features, including prerecorded and
                  custom audio options, are provided solely for entertainment
                  and fun.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-gray-700">
                <h3 className="text-xl mb-2">Content Guidelines</h3>
                <ul className="space-y-4 list-disc pl-6">
                  <li className="text-base">
                    Users agree not to upload content that is offensive,
                    harmful, or illegal.
                  </li>
                  <li className="text-base">
                    The platform reserves the right to review, reject, or remove
                    custom audio.
                  </li>
                  <li className="text-base">
                    Users must obtain recipient&apos;s consent before using any
                    audio content.
                  </li>
                </ul>
              </div>

              <div className="pl-4 border-l-2 border-gray-700">
                <h3 className="text-xl mb-2">Legal Compliance</h3>
                <ul className="space-y-4 list-disc pl-6">
                  <li className="text-base">
                    All users must comply with applicable laws, including
                    telecommunications and privacy laws.
                  </li>
                  <li className="text-base">
                    The platform disclaims all liability for any emotional
                    distress or reputational harm.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <footer className="mt-12 pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-400">Last updated: {lastUpdated}</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
