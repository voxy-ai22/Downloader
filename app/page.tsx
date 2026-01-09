"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Zap, CheckCircle2 } from "lucide-react";
import { VideoDownloader } from "@/components/VideoDownloader";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFF] selection:bg-blue-100 selection:text-blue-600 overflow-x-hidden">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-20 pb-24">
        {/* Header Section */}
        <section className="container mx-auto px-4 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-col items-center space-y-2 bg-white px-6 py-3 rounded-[2rem] shadow-sm border border-blue-50 mb-8"
          >
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-sm font-bold text-blue-600 tracking-wide uppercase">AIO Video Downloader</span>
            </div>
            <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">by Gobel</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]"
          >
            Download Pure <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-500">
              Content Instantly.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            The fastest, most secure way to save your favorite content from any short video or social media platform without watermarks.
          </motion.p>
        </section>

        {/* Downloader Section */}
        <VideoDownloader />

        {/* Security Info */}
        <section className="container mx-auto px-4 mt-24">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Security is our <br />Top Priority
                </h2>
                <p className="text-slate-500 leading-relaxed">
                  We use an advanced proxy system to ensure your data is never exposed. No tracking, no storage, just direct conversion.
                </p>
                <div className="space-y-4">
                  {[
                    "Secure Connection",
                    "No Data Retention",
                    "Automated Sanitization"
                  ].map((text, i) => (
                    <div key={i} className="flex items-center space-x-3 text-slate-700 font-semibold">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                <div className="aspect-square bg-white rounded-[2rem] p-8 shadow-xl border border-blue-50 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                    <Shield className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-slate-800">100% Secure</span>
                </div>
                <div className="aspect-square bg-blue-600 rounded-[2rem] p-8 shadow-xl border border-blue-500 flex flex-col items-center justify-center text-center space-y-4 translate-y-8">
                  <div className="p-4 bg-white/20 rounded-2xl text-white">
                    <Zap className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-white">Ultra Fast</span>
                </div>
                <div className="aspect-square bg-white rounded-[2rem] p-8 shadow-xl border border-blue-50 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                    <Lock className="w-8 h-8" />
                  </div>
                  <span className="font-bold text-slate-800">Private</span>
                </div>
                <div className="aspect-square bg-white rounded-[2rem] p-8 shadow-xl border border-blue-50 flex flex-col items-center justify-center text-center space-y-4 translate-y-8">
                   <div className="flex -space-x-3">
                      {[1,2,3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-blue-100" />
                      ))}
                   </div>
                  <span className="font-bold text-slate-800">2M+ Users</span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Disclaimer Footer */}
        <section className="container mx-auto px-4 mt-32 text-center">
           <div className="max-w-2xl mx-auto p-8 rounded-[2rem] bg-slate-900 text-white shadow-2xl">
              <h3 className="text-xl font-bold mb-4">Pernyataan Penafian Keamanan Konten</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Harap gunakan alat ini hanya untuk konten publik yang Anda memiliki hak aksesnya. Kami tidak menyimpan video apa pun di server kami. Semua unduhan diambil langsung dari platform CDN resmi.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <span>Safe</span>
                <span>•</span>
                <span>Private</span>
                <span>•</span>
                <span>by Gobel</span>
              </div>
           </div>
        </section>
      </div>

      {/* Real Footer */}
      <footer className="py-12 border-t border-blue-50 text-center">
        <p className="text-slate-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} AIO Video Downloader. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
