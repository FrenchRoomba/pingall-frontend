"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { LatencyTable } from "@/components/latency-table";
import { auth } from "@/lib/firebase/firebase";
import { redirect } from "next/navigation";
import { useUser } from "@/lib/useUser";

export default function Home() {
  const [url, setUrl] = useState<string>("");
  const { user, isLoading } = useUser();
  useEffect(() => {
    if (!user && !isLoading) {
      redirect("/login");
    }
  }, [user, isLoading]);

  function query(e: any) {
    setUrl(e.target.value);
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <Input
        className="w-80"
        type="text"
        placeholder="Url"
        onKeyDown={(e) => (e.keyCode === 13 ? query(e) : null)}
      />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <LatencyTable url={url} />
      </div>
    </main>
  );
}
