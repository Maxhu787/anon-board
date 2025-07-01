"use client";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 mt-15">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="mb-4">Effective Date: July 1, 2025</p>

      <p className="mb-4">
        Your privacy is important to us. This Privacy Policy explains how
        g4o2.me ("we", "our", or "us") collects, uses, and protects your
        personal information when you use our service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        1. Information We Collect
      </h2>
      <ul className="list-disc pl-6 mb-4">
        <li>
          Personal Information: When you sign up, we may collect your email,
          name, and other relevant details.
        </li>
        <li>
          Usage Data: We collect anonymous data on how you use the app to
          improve functionality and experience.
        </li>
        <li>
          Cookies and Tracking: We may use cookies or similar technologies for
          analytics and personalization.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        2. How We Use Your Information
      </h2>
      <p className="mb-4">We use your information to:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Provide and maintain the app</li>
        <li>Communicate with you</li>
        <li>Improve the app</li>
        <li>Ensure security and prevent fraud</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Data Sharing</h2>
      <p className="mb-4">
        We do not sell your personal data. We may share it only with trusted
        service providers or when required by law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Your Rights</h2>
      <p className="mb-4">
        You have the right to access, update, or delete your data. You may also
        withdraw consent at any time.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Data Security</h2>
      <p className="mb-4">
        We take reasonable measures to protect your data, though no method of
        transmission is 100% secure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. Changes to This Policy
      </h2>
      <p className="mb-4">
        We may update this policy. Significant changes will be communicated via
        email or in-app notice.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Contact</h2>
      <p className="mb-4">
        If you have any questions or concerns, contact us at{" "}
        <a
          href="mailto:g4o2dotme@googlegroups.com"
          className="text-blue-600 underline"
        >
          g4o2dotme@googlegroups.com
        </a>
        .
      </p>
    </div>
  );
}
