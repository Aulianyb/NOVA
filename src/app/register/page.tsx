import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LoginPage: React.FC = () => {
  return (
    <main className="flex justify-center items-center min-h-screen bg-[var(--black)]">
      <div className="bg-[var(--white)] w-fit h-fit">
        <h1>REGISTER PAGE</h1>
        <Input placeholder="Username" />
        <Input placeholder="Password" />
        <Button>REGISTER</Button>
      </div>
    </main>
  );
};

export default LoginPage;
