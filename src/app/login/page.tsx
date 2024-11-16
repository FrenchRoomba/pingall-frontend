"use client";

import { redirect, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { signInWithGitHub } from "@/lib/firebase/auth";
import { useEffect } from "react";
import { useUser } from "@/lib/useUser";

export default function Page() {
  const router = useRouter();
  function signIn() {
    signInWithGitHub().then(() => {
      router.push("/");
    });
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Button
        onClick={() => {
          signIn();
        }}
      >
        Login with GitHub
      </Button>
    </main>
  );
}
