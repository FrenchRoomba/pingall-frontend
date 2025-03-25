"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LatencyTable } from "@/components/latency-table";
import { auth } from "@/lib/firebase/firebase";
import { redirect } from "next/navigation";
import { useUser } from "@/lib/useUser";

export default function Home() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const tableRef = useRef<{ runQuery: () => Promise<void> } | null>(null);
  const { user, isLoading } = useUser();
  const [isQuerying, setIsQuerying] = useState(false);

  useEffect(() => {
    if (!user && !isLoading) {
      redirect("/login");
    }
  }, [user, isLoading]);

  function handleQuery() {
    if (inputUrl.trim() && !isQuerying) {
      tableRef.current?.runQuery();
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      {isLoading && !user ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="flex w-full max-w-lg gap-2 justify-center">
            <Input
              className="flex-1"
              type="text"
              placeholder="Enter URL to ping"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleQuery();
                }
              }}
            />
            <Button
              onClick={handleQuery}
              disabled={isQuerying || !inputUrl.trim()}
            >
              {isQuerying ? "Pinging..." : "Ping"}
            </Button>
          </div>
          <LatencyTable
            ref={tableRef}
            url={inputUrl}
            onQueryStart={() => setIsQuerying(true)}
            onQueryEnd={() => setIsQuerying(false)}
          />
        </>
      )}
    </main>
  );
}
