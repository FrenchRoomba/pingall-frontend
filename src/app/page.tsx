"use client";

import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LatencyTable } from "@/components/latency-table";

export default function Home() {
  const [inputUrl, setInputUrl] = useState<string>("");
  const tableRef = useRef<{ runQuery: () => Promise<void> } | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  function handleQuery() {
    if (inputUrl.trim() && !isQuerying) {
      tableRef.current?.runQuery();
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
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
        <Button onClick={handleQuery} disabled={isQuerying || !inputUrl.trim()}>
          {isQuerying ? "Pinging..." : "Ping"}
        </Button>
      </div>
      <LatencyTable
        ref={tableRef}
        url={inputUrl}
        onQueryStart={() => setIsQuerying(true)}
        onQueryEnd={() => setIsQuerying(false)}
      />
    </main>
  );
}
