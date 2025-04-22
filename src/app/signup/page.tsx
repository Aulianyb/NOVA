"use client";


import React from "react";
import { Button } from "@/components/ui/button";
import { quantico } from "../fonts";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { SignupForm } from "@/components/signupForm";



function showAlert(isError: boolean) {
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Username is already taken!</AlertDescription>
      </Alert>
    );
  }
}

export default function SignupPage(){
  const [signupError, setSignupError] = useState<boolean>(false);
  const router = useRouter();
  return (
    <main className="flex justify-center items-center min-h-screen bg-[var(--black)]">
      <div className="bg-[var(--white)] w-[70vh] p-6 rounded-xl space-y-6">
        <Button size="icon" variant="ghost" onClick={() => router.push("/")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
        {showAlert(signupError)}
        <h1 className={`${quantico.className} text-[var(--primary)]`}>
          CREATE AN ACCOUNT
        </h1>
        <SignupForm setSignupError={setSignupError}/>
        <div className="text-center">
        <span>Already have an account? </span>
        <a onClick={() => router.push("/login")} className="font-bold text-[var(--primary)]">Login</a>
        </div>
      </div>
    </main>
  );
};
