"use client";
import React from "react";
import { SignUpForm } from "./components/SignUpForm";
import { redirect } from "next/navigation";

const SignUpPage = () => {
  redirect("/login");
  return (
    <div className="flex items-center justify-center mt-35">
      {/* <SignUpForm /> */}
    </div>
  );
};

export default SignUpPage;
