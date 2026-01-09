"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link as LinkIcon, AlertCircle, Loader2, Zap, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ResultCard } from "./ResultCard";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function VideoDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Map backend errors (Voxy AI intelligence)
        if (data.error === "SYSTEM_FAILURE") {
          throw new Error("Server API sedang diblokir oleh platform video. Silakan coba link lain atau ulangi sebentar lagi.");
        }
        if (data.error === "NOT_FOUND") {
          throw new Error("Video tidak ditemukan. Pastikan video tersebut PUBLIK dan bukan PRIVATE/Dihapus.");
        }
        if (data.error === "EXTRACTION_FAILED") {
          throw new Error("Gagal mengambil link video. Platform tersebut mungkin sedang memperbarui sistem keamanannya.");
        }
        throw new Error(data.details || "Terjadi kesalahan teknis. Coba lagi nanti.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex items-center bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-3 shadow-2xl overflow-hidden border border-white/50">
            <div className="pl-6 text-blue-500">
              <LinkIcon className="w-6 h-6" />
            </div>
            <Input
              type="text"
              placeholder="Paste video link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border-none focus-visible:ring-0 text-xl py-8 placeholder:text-slate-300 font-bold tracking-tight bg-transparent"
            />
            <Button
              type="submit"
              disabled={isLoading || !url}
              className="rounded-full px-10 py-8 h-auto bg-blue-600 hover:bg-blue-700 text-white font-black text-lg transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <div className="flex items-center">
                   <Zap className="w-6 h-6 mr-2 fill-white" />
                   <span>Download</span>
                </div>
              )}
            </Button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <Alert variant="destructive" className="rounded-2xl border-none bg-red-50 text-red-600">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="font-medium">{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="mt-4">
        <AnimatePresence>
          {(isLoading || result) && (
            <ResultCard data={result} isLoading={isLoading} />
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center"
      >
        <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Gunakan hanya untuk konten publik dan yang kamu miliki hak aksesnya.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {[
          { title: "No Watermark", desc: "Clean and high-quality results" },
          { title: "Universal", desc: "Supports various platforms" },
          { title: "Ultra Fast", desc: "Optimized server responses" }
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-[1.5rem] bg-white/50 backdrop-blur-sm border border-blue-50 text-center">
            <h4 className="font-bold text-slate-800 mb-1">{item.title}</h4>
            <p className="text-sm text-slate-500">{item.desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
