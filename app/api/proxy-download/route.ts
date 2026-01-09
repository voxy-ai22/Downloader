import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Extend duration for Pro/Enterprise if possible, but 60 is a safe max for many

/**
 * GOD-LEVEL PROXY DOWNLOADER BY VOXY AI
 * Bypasses CORS, spoofing headers, and prevents timeout by streaming.
 * Includes advanced rotation and error recovery.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") || "video_aio_gobel.mp4";

  if (!url) {
    return new Response("URL is required", { status: 400 });
  }

  const userAgents = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15"
  ];

  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

  try {
    // Advanced Headers Spoofing - VOXY MASTER LOGIC
    const headers: Record<string, string> = {
      "User-Agent": randomUA,
      "Accept": "*/*",
      "Accept-Encoding": "identity", // Force no compression for streaming
      "Connection": "keep-alive",
      "Sec-Fetch-Dest": "video",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
    };

    // Determine domain for Referer spoofing
    try {
        const urlObj = new URL(url);
        headers["Referer"] = `${urlObj.protocol}//${urlObj.hostname}/`;
        headers["Origin"] = `${urlObj.protocol}//${urlObj.hostname}`;
    } catch (e) {}

    const response = await fetch(url, { 
      headers, 
      cache: "no-store",
      // @ts-ignore - Some fetch implementations support this
      duplex: 'half'
    });
    
    if (!response.ok) {
      console.warn(`Voxy Proxy: Initial attempt failed (${response.status}). Retrying with minimal headers.`);
      // Minimal retry
      const retry = await fetch(url, { 
        headers: { "User-Agent": randomUA },
        cache: "no-store" 
      });
      
      if (!retry.ok) {
        // Last ditch effort: Redirect to source if proxy fails (user might be able to download directly)
        return Response.redirect(url, 302);
      }
      return createStreamResponse(retry, filename);
    }

    return createStreamResponse(response, filename);
  } catch (error: any) {
    console.error("Voxy AI Error - Proxy Download:", error.message);
    // Fallback to redirect on fatal error
    return Response.redirect(url, 302);
  }
}

function createStreamResponse(response: Response, filename: string) {
  let contentType = response.headers.get("content-type");
  
  // Intelligence: If content-type is octet-stream or missing, determine by filename
  if (!contentType || contentType === "application/octet-stream") {
    if (filename.endsWith(".mp3")) contentType = "audio/mpeg";
    else if (filename.endsWith(".mp4")) contentType = "video/mp4";
    else contentType = "video/mp4"; // Default
  }

  const contentLength = response.headers.get("content-length");
  
  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "public, max-age=3600",
  };

  if (contentLength) {
    headers["Content-Length"] = contentLength;
  }

  return new Response(response.body, { headers });
}
