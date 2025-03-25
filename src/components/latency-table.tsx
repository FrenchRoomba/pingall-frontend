"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";

import { CloudLogo } from "./cloud-logos";
import React from "react";
import { getCurrentUser } from "@/lib/firebase/auth";
import useSWRImmutable from "swr/immutable";
import { useUser } from "@/lib/useUser";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// function usePingQuery(url: string) {
//   const { data, error, isLoading } = useSWRImmutable(
//     `https://ping-service-tx45f4bnfa-ts.a.run.app/?url=${url}`,
//     fetcher
//   );

//   return {
//     pingQuery: data,
//     isLoading,
//     isError: error,
//   };
// }

async function* getPingQuery(
  url: string,
  idToken: string,
  signal?: AbortSignal
) {
  const reqUrl = new URL("https://ping-service-tx45f4bnfa-ts.a.run.app/");
  reqUrl.searchParams.append("url", url);

  const res = await fetch(reqUrl, {
    method: "GET",
    headers: { Authorization: `Bearer ${idToken}` },
    signal,
  });

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No reader");

  const decoder = new TextDecoder("utf-8");
  let { value: chunk, done: readerDone } = await reader.read();
  let chunk_str = chunk ? decoder.decode(chunk) : "";

  const newline = /\r?\n/gm;
  let startIndex = 0;
  let result;

  while (true) {
    const result = newline.exec(chunk_str);
    if (!result) {
      if (readerDone) break;
      const remainder = chunk_str.substring(startIndex);
      ({ value: chunk, done: readerDone } = await reader.read());
      chunk_str = remainder + (chunk ? decoder.decode(chunk) : "");
      startIndex = newline.lastIndex = 0;
      continue;
    }
    yield chunk_str.substring(startIndex, result.index);
    startIndex = newline.lastIndex;
  }

  if (startIndex < chunk_str.length) {
    // Last line didn't end in a newline char
    yield chunk_str.substring(startIndex);
  }
}

interface Result {
  provider: string;
  region: string;
  latency: string;
}

export default function usePingQuery() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);
  // const { user, isLoading: isLoadingUser } = useUser();

  const mutate = useCallback(
    async (prompt: string) => {
      setIsLoading(true);
      setResults([]);
      setError(undefined);

      if (abortController) {
        abortController.abort();
      }
      const controller = new AbortController();
      const signal = controller.signal;
      setAbortController(controller);

      try {
        const idToken = await getCurrentUser()?.getIdToken();
        if (idToken === undefined) {
          setError("No Id token");
          console.log(":(");
          return;
        }
        for await (const token of getPingQuery(prompt, idToken, signal)) {
          console.log("token", token);
          const result: Result = JSON.parse(token);
          console.log(result);
          setResults((prev) => [...prev, result]);
        }
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return; // abort errors are expected
        }
        setError(err);
      }
      setIsLoading(false);
      setAbortController(null);
    },
    [abortController]
  );

  return [mutate, { data: results, isLoading, error }] as const;
}

export const LatencyTable = React.forwardRef<
  { runQuery: () => Promise<void> },
  {
    url: string;
    onQueryStart?: () => void;
    onQueryEnd?: () => void;
  }
>(({ url, onQueryStart, onQueryEnd }, ref) => {
  const [mutate, { data, isLoading, error }] = usePingQuery();

  const runQuery = useCallback(async () => {
    if (url === "") {
      return;
    }
    onQueryStart?.();
    await mutate(url);
    onQueryEnd?.();
  }, [url, mutate, onQueryStart, onQueryEnd]);

  // Expose the runQuery method via ref
  useEffect(() => {
    if (ref && "current" in ref) {
      ref.current = { runQuery };
    }
  }, [ref, runQuery]);

  // Initial query on mount if URL is present
  useEffect(() => {
    if (url !== "") {
      runQuery();
    }
  }, []); // Only run once on mount

  if (error) return <div>failed to load</div>;

  const sorted_data =
    data?.sort((a, b) => parseInt(a.latency) - parseInt(b.latency)) || [];

  return (
    <div className="w-full">
      {isLoading && (
        <div className="text-center mb-4">Running ping query...</div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Cloud</TableHead>
            <TableHead className="w-[100px]">Region</TableHead>
            <TableHead className="text-right">Latency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted_data.map((result: Result) => (
            <TableRow key={`${result.provider}.${result.region}`}>
              <TableCell className="flex items-center">
                <CloudLogo provider={result.provider} />
                {result.provider}
              </TableCell>
              <TableCell>{result.region}</TableCell>
              <TableCell className="text-right">{result.latency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

LatencyTable.displayName = "LatencyTable";

export { usePingQuery };
