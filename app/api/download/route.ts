import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * VOXY AI GOD-LEVEL LOGIC
 * Fixes deployment IP blocks and API inconsistencies.
 */
export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL_REQUIRED", details: "Masukkan URL video yang valid." }, { status: 400 });
    }

    // 1. Try AIO API (Primary)
    const apiUrl = `https://api-faa.my.id/faa/aio?url=${encodeURIComponent(url)}`;
    
    // Backup APIs for redundancy - VOXY MASTER STRATEGY
    const backupApis = [
      `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`,
      `https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`
    ];

    let response = await fetch(apiUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "application/json",
      },
      next: { revalidate: 0 }
    });

    let data;
    if (response.ok) {
        data = await response.json();
    }

    // Fallback logic if primary API fails or returns no result
    if (!response.ok || !data || (!data.result && !data.data && data.status !== true)) {
        console.log("Voxy AI - Primary API failed or empty, trying backups...");
        for (const backupUrl of backupApis) {
            try {
                const bRes = await fetch(backupUrl, { next: { revalidate: 0 } });
                if (bRes.ok) {
                    const bData = await bRes.json();
                    if (bData.result || bData.data || bData.status === true) {
                        data = bData;
                        console.log("Voxy AI - Success using backup API:", backupUrl);
                        break;
                    }
                }
            } catch (e) {
                console.error("Voxy AI - Backup failed:", backupUrl);
            }
        }
    }

    if (!data) {
       throw new Error("ALL_APIS_OFFLINE");
    }
    console.log("Voxy AI - Raw Data Received:", JSON.stringify(data).substring(0, 500));

    // Intelligence mapping: Determine if the response is actually a success
    const result = data.result || data.data || (data.status === true ? data : null);

    if (!result) {
      return NextResponse.json(
        { error: "NOT_FOUND", details: data.message || "Video tidak ditemukan. Coba server lain atau pastikan URL publik." },
        { status: 404 }
      );
    }

    // Advanced Link Extraction Logic
    let download_url = "";
    let audio_url = "";
    const alt_urls: any[] = [];

    // Map fields dynamically
    const possibleFields = ["download_url", "url", "nowm", "watermark", "video", "video_url", "media", "link"];
    const possibleAudioFields = ["music", "music_url", "audio", "audio_url", "mp3", "sound"];
    
    for (const field of possibleFields) {
      if (result[field] && typeof result[field] === "string" && result[field].startsWith("http")) {
        if (!download_url) download_url = result[field];
        alt_urls.push({ type: field.toUpperCase(), url: result[field], has_ssl: result[field].startsWith("https") });
      }
    }

    for (const field of possibleAudioFields) {
      if (result[field] && typeof result[field] === "string" && result[field].startsWith("http")) {
        if (!audio_url) audio_url = result[field];
      }
    }

    // Handle nested results (like in TikTok APIs where there's 'video' object)
    if (!download_url && result.video) {
        download_url = result.video.url || result.video.no_watermark || result.video;
    }
    
    if (!audio_url && result.music_info) {
        audio_url = result.music_info.url || result.music_info.play_url;
    }

    // Handle Array results
    if (!download_url && Array.isArray(result)) {
      const first = result[0];
      download_url = typeof first === "string" ? first : (first.url || first.link);
    }

    // Final Validation
    if (!download_url) {
       return NextResponse.json(
         { error: "EXTRACTION_FAILED", details: "Gagal mengekstrak tautan video. API mungkin berubah." },
         { status: 422 }
       );
    }

    const cleanResponse = {
      title: result.title || result.desc || result.description || `Video Downloaded via AIO`,
      thumbnail: result.thumbnail || result.thumb || result.cover || result.image || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      download_url: download_url,
      audio_url: audio_url,
      author: {
        name: result.author?.nickname || result.author?.name || result.nickname || result.username || "Unknown Creator",
        avatar: result.author?.avatar || result.author?.image || result.avatar || result.user_avatar || null,
      },
      stats: {
        views: result.views || result.play_count || 0,
        likes: result.likes || result.digg_count || 0,
        comments: result.comments || result.comment_count || 0,
        shares: result.shares || result.share_count || 0,
      },
      alternative_urls: alt_urls.length > 0 ? alt_urls : [{ type: "DEFAULT", url: download_url, has_ssl: true }]
    };

    return NextResponse.json(cleanResponse);

  } catch (error: any) {
    console.error("Voxy AI Master Logic Failure:", error.message);
    return NextResponse.json(
      { error: "SYSTEM_FAILURE", details: "Server sedang overload atau API tujuan memblokir permintaan. Coba lagi dalam 5 detik." },
      { status: 500 }
    );
  }
}
