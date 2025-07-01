"use client";
import React from "react";

export default function TermsOfService() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 mt-15">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

      <p className="mb-4">Effective Date: July 1, 2025</p>

      <p className="mb-4">
        Welcome to g4o2.me! These Terms of Service ("Terms") govern your use of
        our app and services. By using g4o2.me, you agree to these terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Use of the Service</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You must be at least 13 years old to use the app.</li>
        <li>
          You agree not to misuse the service or attempt to harm others or the
          platform.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. User Content</h2>
      <p className="mb-4">
        You are responsible for any content you upload. We may remove content
        that violates laws or these terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Accounts</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>You are responsible for your account and activity on it.</li>
        <li>Keep your login information secure.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Termination</h2>
      <p className="mb-4">
        We may suspend or terminate your access if you violate these terms or
        abuse the service.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        5. Limitation of Liability
      </h2>
      <p className="mb-4">
        g4o2.me is provided "as is." We are not liable for indirect damages,
        loss of data, or service interruptions.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">
        6. Changes to These Terms
      </h2>
      <p className="mb-4">
        We may update these terms from time to time. Continued use of the app
        means you accept the updated terms.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">7. Governing Law</h2>
      <p className="mb-4">
        These terms are governed by the laws of your jurisdiction, unless
        otherwise required by applicable law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">8. Contact</h2>
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
