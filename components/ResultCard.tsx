"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download, 
  Share2, 
  ShieldCheck, 
  Zap, 
  Loader2, 
  ExternalLink, 
  Globe, 
  Lock, 
  User, 
  Heart, 
  MessageCircle, 
  Eye, 
  Copy, 
  CheckCircle2, 
  Music,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface AlternativeUrl {
  type: string;
  url: string;
  has_ssl: boolean;
}

interface VideoData {
  title: string;
  thumbnail: string;
  download_url: string;
  audio_url?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  stats?: {
    views: number | string;
    likes: number | string;
    comments: number | string;
    shares: number | string;
  };
  alternative_urls: AlternativeUrl[];
}

interface ResultCardProps {
  data: VideoData;
  isLoading: boolean;
}

export function ResultCard({ data, isLoading }: ResultCardProps) {
  const [downloadingUrl, setDownloadingUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatNumber = (num: number | string) => {
    if (!num) return "0";
    const n = typeof num === "string" ? parseInt(num) : num;
    if (isNaN(n)) return num;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
  };

  const handleCopy = () => {
    if (!data?.download_url) return;
    navigator.clipboard.writeText(data.download_url);
    setCopied(true);
    toast.success("Link video berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (url: string, type: string, extension: string = "mp4") => {
    if (!url) {
      toast.error("Tautan unduhan tidak tersedia untuk format ini.");
      return;
    }
    
    setDownloadingUrl(url);
    try {
      const safeTitle = data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 50) || 'download';
      const filename = `${safeTitle}_${type.replace(/[^a-z0-9]/gi, '_')}.${extension}`;
      const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
      
      const link = document.createElement("a");
      link.href = proxyUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Memulai unduhan ${extension.toUpperCase()}...`);
    } catch (error) {
      console.error("Download failed, opening in new tab:", error);
      window.open(url, "_blank");
    } finally {
      setTimeout(() => setDownloadingUrl(null), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing", err);
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl mx-auto mt-8"
      >
        <Card className="overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[2rem]">
          <CardContent className="p-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full h-64 bg-slate-100 animate-pulse rounded-2xl" />
              <div className="w-3/4 h-8 bg-slate-100 animate-pulse rounded-md" />
              <div className="w-1/2 h-5 bg-slate-100 animate-pulse rounded-md" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="w-full max-w-xl mx-auto mt-8 pb-10"
    >
      <Card className="overflow-hidden border-none shadow-2xl bg-white/95 backdrop-blur-lg rounded-[2.5rem]">
        <CardContent className="p-0">
          <div className="relative group">
            <img
              src={data.thumbnail}
              alt={data.title}
              className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-emerald-600 text-white border-none px-4 py-1.5 shadow-xl backdrop-blur-md">
                <Zap className="w-3.5 h-3.5 mr-1.5 fill-white" />
                Download Ready
              </Badge>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4 group/avatar">
                <Avatar className="h-14 w-14 ring-2 ring-slate-100 ring-offset-2 transition-all duration-300 group-hover/avatar:ring-blue-500">
                  <AvatarImage src={data.author?.avatar} />
                  <AvatarFallback className="bg-slate-100 text-slate-400">
                    <User className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">Creator</span>
                  <span className="text-base font-black text-slate-800 tracking-tight leading-none">
                    {data.author?.name || "Anonymous"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { icon: Heart, value: data.stats?.likes, color: "text-rose-500" },
                  { icon: MessageCircle, value: data.stats?.comments, color: "text-blue-500" },
                  { icon: Eye, value: data.stats?.views, color: "text-slate-500" }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <stat.icon className={`h-4 w-4 ${stat.color} mb-1.5`} />
                    <span className="text-[10px] font-black text-slate-500 uppercase">{formatNumber(stat.value || 0)}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-100/50" />

            <div className="space-y-4">
              <h3 className="text-xl font-black text-slate-800 line-clamp-3 leading-tight tracking-tight">
                {data.title}
              </h3>
              
              <div className="flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em]">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                Verified & Pure Content
              </div>
            </div>

            {/* Main Action Area */}
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => handleDownload(data.download_url, "video", "mp4")}
                  disabled={!!downloadingUrl}
                  className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] transition-all group"
                >
                  {downloadingUrl === data.download_url ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Video className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                  )}
                  Video MP4
                </Button>

                <Button
                  onClick={() => handleDownload(data.audio_url!, "audio", "mp3")}
                  disabled={!!downloadingUrl || !data.audio_url}
                  className="h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-lg shadow-[0_10px_30px_-10px_rgba(225,29,72,0.4)] transition-all group disabled:opacity-50"
                >
                  {downloadingUrl === data.audio_url ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Music className="mr-2 h-5 w-5 transition-transform group-hover:-translate-y-1" />
                  )}
                  Audio MP3
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="h-14 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-slate-400" />
                  )}
                  {copied ? "Copied" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(data.download_url, "_blank")}
                  className="h-14 rounded-2xl border-2 border-slate-100 hover:bg-slate-50 text-slate-700 font-bold flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-5 w-5 text-slate-400" />
                  Direct Source
                </Button>
              </div>
            </div>

            <Separator className="bg-slate-100" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <Globe className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Alternative Servers (MP4)</span>
              </div>
              
              <ScrollArea className="h-auto max-h-[250px] pr-2">
                <div className="grid grid-cols-1 gap-2">
                  {data.alternative_urls?.map((alt, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-100/50 transition-colors rounded-2xl border border-slate-100/50 group">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                          {alt.has_ssl ? (
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-300" />
                          )}
                        </div>
                        <span className="font-bold text-slate-700 text-xs uppercase tracking-wider">{alt.type}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownload(alt.url, alt.type, "mp4")}
                          disabled={downloadingUrl === alt.url}
                          className="h-9 px-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold text-[10px]"
                        >
                          {downloadingUrl === alt.url ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <Download className="h-3 w-3 mr-1" />
                          )}
                          DL
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(alt.url, "_blank")}
                          className="h-9 px-3 rounded-xl hover:bg-slate-200 text-slate-500 font-bold text-[10px]"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          VIEW
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <Button
              variant="ghost"
              onClick={handleShare}
              className="w-full h-12 rounded-xl text-slate-400 font-bold hover:bg-slate-50 transition-all"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Tool
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 text-center">
        <p className="text-[10px] font-black text-slate-300 tracking-[0.4em] uppercase">by Gobel</p>
      </div>
    </motion.div>
  );
}
