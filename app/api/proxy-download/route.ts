import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return new Response("URL is required", { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return new Response("Failed to fetch content", { status: response.status });
    }

    // Proxy the headers and the body
    const headers = new Headers();
    const contentType = response.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    
    // Set attachment header to suggest filename
    headers.set("content-disposition", `attachment; filename="video.mp4"`);

    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Stream Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
