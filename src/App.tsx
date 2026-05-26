/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { 
  Compass, 
  Map, 
  Coffee, 
  Music, 
  Sparkles, 
  QrCode, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  FileDown, 
  Check, 
  Gift, 
  User, 
  Users, 
  Heart,
  Train,
  X,
  Sunset,
  Award
} from "lucide-react";

import haifengTrainInterior from "./assets/images/haifeng_train_interior_1779791421103.png";
import haifengDessertBox from "./assets/images/haifeng_dessert_box_1779791438191.png";
import haifengTrainExterior from "./assets/images/haifeng_train_exterior_1779791402127.png";

export default function App() {
  const [activeTab, setActiveTab] = useState("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState("dating");
  const [customTicketName, setCustomTicketName] = useState("");
  const [isTicketGenerated, setIsTicketGenerated] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState("matcha");
  const [selectedSeat, setSelectedSeat] = useState("window");
  
  // Audio Context for synthesizing custom beach waves & retro train ambient sound!
  const audioCtxRef = useRef<AudioContext | null>(null);
  const waveNoiseRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Toggle ambient audio synthesis
  const toggleAmbientSound = () => {
    if (isPlaying) {
      // Stop
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5);
      }
      setTimeout(() => {
        setIsPlaying(false);
      }, 500);
    } else {
      // Start
      try {
        if (!audioCtxRef.current) {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioCtxRef.current = new AudioContextClass();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          ctx.resume();
        }

        // Create synthesizers for beautiful coastal waves
        const bufferSize = 4 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink noise filter to simulate deep ocean rumbling
          output[i] = (lastOut * 0.99) + (white * 0.01);
          lastOut = output[i];
        }

        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;

        // Bandpass to capture the soothing swell of the waves
        const waveFilter = ctx.createBiquadFilter();
        waveFilter.type = "bandpass";
        waveFilter.frequency.value = 350;
        waveFilter.Q.value = 1.0;

        // Create custom low frequency oscillator (LFO) to automate ocean tides (breathing cycle)
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.12; // 8-second wave interval

        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 250; // Sweeps filter frequency between 100Hz and 600Hz

        const mainGain = ctx.createGain();
        mainGain.gain.value = 0;

        // Connections
        lfo.connect(lfoGain);
        lfoGain.connect(waveFilter.frequency);
        
        noiseSrc.connect(waveFilter);
        waveFilter.connect(mainGain);
        mainGain.connect(ctx.destination);

        // Start synthesizers
        lfo.start();
        noiseSrc.start();
        
        gainNodeRef.current = mainGain;
        mainGain.gain.setValueAtTime(0, ctx.currentTime);
        mainGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 1.5);
        
        setIsPlaying(true);
      } catch (err) {
        console.error("Audio generation failed: ", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // Standalone Single-file HTML generator and exporter
  const handleExportHTML = () => {
    const htmlString = `<!doctype html>
<html lang="zh-Hant">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>海風號 | 甜點觀光列車體驗 landing page</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700;900&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS Play CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              serif: ["'Noto Serif TC'", 'serif'],
              sans: ["'Noto Sans TC'", 'sans-serif'],
            },
            colors: {
              brand: {
                cyan: '#A1C9C1',
                darkgreen: '#1F4E46',
                deepteal: '#143630',
                gold: '#C5A059',
                lightgold: '#DFCA9B',
                cream: '#FAF8F4',
              }
            }
          }
        }
      }
    </script>
    <style>
      body {
        background-color: #FAF8F4;
        color: #2D3748;
        font-family: 'Noto Sans TC', sans-serif;
        overflow-x: hidden;
      }
      .text-stroke-gold {
        -webkit-text-stroke: 1px #C5A059;
      }
    </style>
  </head>
  <body class="bg-[#FAF8F4] overflow-x-hidden">
    <!-- TOP MARGIN -->
    <div class="bg-[#143630] text-[#DFCA9B] text-center py-2.5 text-xs tracking-widest font-serif">
      「不趕時間的旅程，才有風景。」— 海風號 慢時光列車
    </div>

    <!-- MAIN NAVBAR -->
    <header class="sticky top-0 z-50 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#C5A059]/20 transition-all duration-300">
      <div class="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <div class="w-10 h-10 rounded-full bg-[#1F4E46] flex items-center justify-center text-[#DFCA9B] font-bold border border-[#C5A059]/40">
            風
          </div>
          <div>
            <h1 class="font-serif font-bold text-lg tracking-wider text-[#143630]">海風號</h1>
            <p class="text-[9px] tracking-widest text-[#C5A059] uppercase">Sea Breeze Dessert Train</p>
          </div>
        </div>
        <nav class="hidden md:flex space-x-8 text-sm font-medium text-[#143630]">
          <a href="#hero" class="hover:text-[#C5A059] transition-colors">首班列車</a>
          <a href="#highlights" class="hover:text-[#C5A059] transition-colors">行程亮點</a>
          <a href="#concept" class="hover:text-[#C5A059] transition-colors">慢活美學</a>
          <a href="#coupon" class="hover:text-[#C5A059] transition-colors">LINE預約</a>
        </nav>
        <button onclick="document.getElementById('coupon').scrollIntoView({behavior: 'smooth'})" class="bg-[#1F4E46] hover:bg-[#143630] text-white px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 border border-[#C5A059]/35 hover:shadow-lg">
          專屬預約
        </button>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section id="hero" class="relative py-16 lg:py-24 overflow-hidden border-b border-[#C5A059]/20 bg-gradient-to-b from-[#FAF8F4] to-[#EEF5F3]">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 space-y-8 z-10">
          <div class="inline-flex items-center space-x-2 bg-[#1F4E46]/10 px-4 py-1.5 rounded-full border border-[#1F4E46]/20">
            <span class="w-2 h-2 rounded-full bg-[#C5A059]"></span>
            <span class="text-xs text-[#1F4E46] font-semibold tracking-widest uppercase">2026 期間限定夢幻企劃</span>
          </div>
          
          <div class="space-y-4">
            <h2 class="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#143630] font-black leading-tight tracking-wide">
              搭上海風號，<br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#1F4E46] to-[#C5A059]">把午後變成一趟小旅行</span>
            </h2>
            <div class="h-1 w-24 bg-gradient-to-r from-[#C5A059] to-transparent"></div>
            <p class="font-serif text-lg sm:text-xl text-[#C5A059] font-medium tracking-widest">
              慢享海景 × 精緻甜點 × 好時光
            </p>
          </div>

          <p class="text-[#4A5568] leading-relaxed max-w-xl text-base">
            沿著湛藍的東海岸線徐徐行駛，坐在頂級古典車廂的環景座艙內。一邊看著粼粼波光的蔚藍海風，一邊品嚐由職人每日鮮作的奢華甜點盒與頂級茗茶。這是一場屬於您的靈魂療癒之旅。
          </p>

          <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="https://line.me/ti/p/BqTYWDpaas" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-gradient-to-r from-[#1F4E46] to-[#143630] hover:from-[#143630] hover:to-[#122b27] text-white font-bold py-4.5 px-10 rounded-full shadow-lg transition-all transform hover:-translate-y-1 hover:shadow-xl tracking-widest text-[#FAF8F4] border border-[#C5A059]/40 group no-underline text-base sm:text-lg">
              <span>立即領取體驗</span>
              <svg class="w-5 h-5 ml-2.5 group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </a>
          </div>

          <div class="grid grid-cols-3 gap-4 pt-4 border-t border-[#C5A059]/20">
            <div>
              <div class="text-2xl font-serif font-bold text-[#1F4E46]">180度</div>
              <div class="text-[11px] text-gray-500 tracking-wider">環景巨幕蔚藍海景</div>
            </div>
            <div>
              <div class="text-2xl font-serif font-bold text-[#1F4E46]">100%</div>
              <div class="text-[11px] text-gray-500 tracking-wider">職人在地食材手作</div>
            </div>
            <div>
              <div class="text-2xl font-serif font-bold text-[#1F4E46]">限量</div>
              <div class="text-[11px] text-gray-500 tracking-wider">席位預約專屬招待</div>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE: PREMIUM PHOTO EXTENSION COLLAGE -->
        <div class="lg:col-span-5 relative flex justify-center items-center">
          <div class="absolute inset-0 bg-[#A1C9C1]/20 rounded-full filter blur-3xl -z-10"></div>
          <div class="relative w-full max-w-md bg-white p-4 rounded-3xl shadow-2xl border border-[#C5A059]/30 transform rotate-1 hover:rotate-0 transition-all duration-500">
            <div class="overflow-hidden rounded-2xl relative aspect-square bg-[#1F4E46]">
              <img src="https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?auto=format&fit=crop&q=80&w=1200" alt="豪華觀光列車" class="object-cover w-full h-full opacity-90 transition-transform duration-700 hover:scale-105">
              <div class="absolute inset-0 bg-gradient-to-t from-[#143630]/75 via-transparent to-transparent"></div>
              <div class="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span class="text-xs uppercase tracking-widest text-[#DFCA9B] font-serif">席次限時預約中</span>
                <h4 class="font-serif text-lg font-bold">海風號 經典車廂座艙</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HIGHLIGHTS SECTION -->
    <section id="highlights" class="py-20 bg-white">
      <div class="max-w-6xl mx-auto px-4">
        <div class="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span class="text-xs uppercase tracking-widest font-semibold text-[#C5A059]">The Signature Experience</span>
          <h3 class="font-serif text-3xl sm:text-4xl text-[#143630] font-bold">列車三大夢幻亮點</h3>
          <div class="w-12 h-0.5 bg-[#C5A059] mx-auto"></div>
          <p class="text-gray-600 text-sm">精心打造的奢華體驗，不論是蔚藍深海岸景或極致法式西點，皆在海風中與您共享。</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- CARD 1 -->
          <div class="bg-[#FAF8F4] rounded-2xl p-8 border border-[#C5A059]/15 shadow-sm hover:shadow-xl hover:border-[#C5A059]/50 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-[#1F4E46]/10 flex items-center justify-center text-[#1F4E46] mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.242.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.568-.372-1.81.588-1.81h4.906a1 1 0 00.95-.69l1.519-4.674z"></path></svg>
            </div>
            <h4 class="font-serif text-xl font-bold text-[#143630] mb-3">絕美海景</h4>
            <p class="text-gray-600 leading-relaxed text-sm">
              寬景大窗獨占頂等海景，看著澄透蔚藍海岸綿延，如同移動在海天一線。
            </p>
          </div>

          <!-- CARD 2 -->
          <div class="bg-[#FAF8F4] rounded-2xl p-8 border border-[#C5A059]/15 shadow-sm hover:shadow-xl hover:border-[#C5A059]/50 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-[#1F4E46]/10 flex items-center justify-center text-[#1F4E46] mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path></svg>
            </div>
            <h4 class="font-serif text-xl font-bold text-[#143630] mb-3">精饌甜點</h4>
            <p class="text-gray-600 leading-relaxed text-sm">
              與五星職人聯手，專屬訂製甜點雙層盒，將季節在地花果與頂級巧克力完美融合。
            </p>
          </div>

          <!-- CARD 3 -->
          <div class="bg-[#FAF8F4] rounded-2xl p-8 border border-[#C5A059]/15 shadow-sm hover:shadow-xl hover:border-[#C5A059]/50 transition-all group">
            <div class="w-12 h-12 rounded-xl bg-[#1F4E46]/10 flex items-center justify-center text-[#1F4E46] mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg class="w-6 h-6 text-[#C5A059]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h4 class="font-serif text-xl font-bold text-[#143630] mb-3">多種場合</h4>
            <p class="text-gray-600 leading-relaxed text-sm">
              不論是深情約會、生日慶典、或是閨蜜午後，皆能留下完美的蔚藍海藍回憶。
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- MID HIGHLIGHT STORY CONCEPT -->
    <section id="concept" class="py-20 bg-[#EEF5F3] relative overflow-hidden">
      <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] bg-[#1F4E46] group">
          <img src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=1200" alt="英式下午茶鮮美茶點" class="w-full h-full object-cover opacity-85 transition-transform duration-500 hover:scale-105">
          <div class="absolute inset-0 bg-black/25"></div>
        </div>
        <div class="space-y-8">
          <span class="text-xs tracking-widest text-[#C5A059] uppercase font-semibold">Lifestyle philosophy</span>
          <h3 class="font-serif text-3xl sm:text-4xl text-[#143630] font-bold leading-tight">
            一場不用遠行的<br/>海景下午茶
          </h3>
          <p class="text-[#4A5568] leading-relaxed">
            搭上海風號，在綠寶石車廂內享受寧靜時光。窗外是浪，桌上是茗，每一刻都像一幅被精心收藏的畫作。放慢平日汲汲營營的焦躁，讓徐徐的海風與浪漫的鐵軌合奏，洗滌您的心靈。
          </p>
          <div class="pt-2">
            <blockquote class="border-l-4 border-[#C5A059] pl-4 italic text-sm text-[#1F4E46] font-serif font-medium">
              「在車廂搖晃的微風中，聽海唱歌，這才是不趕時間的風景。」
            </blockquote>
          </div>
        </div>
      </div>
    </section>

    <!-- RESERVATION ACTION AREA -->
    <section id="booking-area" class="py-20 bg-white">
      <div class="max-w-4xl mx-auto px-4 text-center space-y-8">
        <div class="w-16 h-16 rounded-full bg-[#1F4E46]/10 flex items-center justify-center mx-auto text-[#1F4E46] border border-[#C5A059]/40 mb-2">
          <svg class="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
        </div>
        <h3 class="font-serif text-3xl text-[#143630] font-black">限時名額！立即探索午後限定班次</h3>
        <p class="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed">
          點擊下方按鈕加入官方 LINE，取得最新一期「海風號」夢幻班次的運行時間、季節限定甜點品項，並由線上專員一對一為您保留尊皇景觀席位。
        </p>
        <div>
          <a href="https://line.me/ti/p/BqTYWDpaas" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center bg-[#1F4E46] hover:bg-[#143630] text-white font-black py-4.5 px-12 rounded-full border border-[#C5A059]/40 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl shadow-xl tracking-widest text-base sm:text-lg no-underline">
            立即領取體驗
          </a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-[#143630] text-white py-12 border-t border-[#C5A059]/30">
      <div class="max-w-6xl mx-auto px-4 text-center space-y-4">
        <h2 class="font-serif text-2xl tracking-widest text-[#DFCA9B]">海風號 甜點觀光列車</h2>
      </div>
    </footer>

    <!-- STATIC MODAL DIALOG -->
    <div id="coupon-modal-static" class="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4" style="display:none;">
      <div class="bg-[#FAF8F4] w-full max-w-md rounded-3xl p-6 relative border-2 border-[#C5A059] shadow-2xl text-center space-y-6">
        <button onclick="document.getElementById('coupon-modal-static').style.display='none'" class="absolute top-4 right-4 text-gray-500 hover:text-black focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <div class="w-16 h-16 bg-[#1F4E46]/10 rounded-full flex items-center justify-center mx-auto text-[#C5A059]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4l-2 2h-2zm0 0H8l2 2h2z"></path></svg>
        </div>
        <div>
          <h3 class="font-serif text-2xl text-[#143630] font-bold">海風專屬優惠券</h3>
          <p class="text-xs text-[#C5A059] tracking-widest font-semibold mt-1">LINE EXCLUSIVE SERVICE</p>
        </div>
        <div class="bg-white p-4 rounded-2xl border border-dashed border-[#C5A059] flex items-center justify-center mx-auto" style="width: 160px; height: 160px;">
          <canvas id="coupon-qr-canvas" class="mx-auto" style="width:144px; height:144px;"></canvas>
        </div>
        <div class="space-y-1.5">
          <p class="text-sm font-semibold text-[#143630]">「不趕時間車次 ✦ 全座位享九折優惠」</p>
          <p class="text-xs text-gray-500">掃描上方 QR 碼即可免費開通</p>
        </div>
        <button onclick="document.getElementById('coupon-modal-static').style.display='none'" class="w-full bg-[#1F4E46] text-white py-3 rounded-full text-xs font-semibold tracking-wider hover:bg-[#143630] transition-colors">
          完成下載，關閉視窗
        </button>
      </div>
    </div>
    <!-- Real-time QRCode Generator -->
    <script src="https://cdn.jsdelivr.net/npm/qrcode@1.4.4/build/qrcode.min.js"></script>
    <script>
      window.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('coupon-qr-canvas');
        if (canvas) {
          QRCode.toCanvas(canvas, "https://line.me/ti/p/BqTYWDpaas", {
            width: 144,
            margin: 1,
            color: {
              dark: "#143630",
              light: "#FFFFFF"
            }
          }, function (error) {
            if (error) console.error("QR Code Generation Error:", error);
          });
        }
      });
    </script>
  </body>
</html>`;

    const blob = new Blob([htmlString], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "haifeng_landing_page.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-brand-cream relative selection:bg-brand-gold selection:text-white font-sans-tc w-full overflow-x-hidden">
      
      {/* 1. TOP MOST ANNOUNCEMENT SLATE */}
      <div id="top-bar" className="bg-brand-deepteal text-brand-lightgold text-center py-2.5 px-4 text-xs font-serif-tc tracking-widest flex items-center justify-center space-x-1 border-b border-brand-gold/20 shadow-sm relative z-50">
        <span className="animate-pulse">✦</span>
        <span>「不趕時間的旅程，才有風景。」— 海風號 慢時光列車</span>
        <span className="hidden md:inline">✦ 2026 年度熱烈預約中 ✦</span>
      </div>

      {/* 2. DYNAMIC FLOATING GLASS NAVBAR */}
      <header id="main-header" className="sticky top-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-gold/15 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-11 h-11 rounded-full bg-brand-darkgreen flex items-center justify-center text-brand-lightgold font-bold text-lg border border-brand-gold/40 shadow-inner group-hover:rotate-12 transition-transform duration-500">
              風
            </div>
            <div>
              <h1 className="font-serif-tc font-black text-xl tracking-wider text-brand-deepteal flex items-center space-x-1">
                <span>海風號</span>
                <span className="text-xs bg-brand-gold/20 text-brand-gold font-bold px-1.5 py-0.5 rounded ml-1">甜點列車</span>
              </h1>
              <p className="text-[10px] tracking-widest text-brand-gold font-mono-tc uppercase">Sea Breeze Dessert Train</p>
            </div>
          </div>

          <nav className="hidden lg:flex space-x-8 text-sm font-semibold text-brand-deepteal">
            <a href="#hero" className="hover:text-brand-gold transition-colors flex items-center space-x-1">
              <Train size={14} />
              <span>首班列車</span>
            </a>
            <a href="#highlights" className="hover:text-brand-gold transition-colors">行程亮點</a>
            <a href="#concept" className="hover:text-brand-gold transition-colors">奢華美學</a>
            <a href="#coupon" className="hover:text-brand-gold transition-colors">LINE 優惠預定</a>
          </nav>

          <div className="flex items-center space-x-3">
          </div>
        </div>
      </header>

      {/* 3. HERO BANNER: BRAND NEW FULL-DISPLAY LANDING LAYOUT */}
      <section id="hero" className="relative py-12 md:py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-brand-cream via-brand-cyan/10 to-brand-cream border-b border-brand-gold/20">
        
        {/* Curved Wave Splines Background Decors */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path d="M100 0 C130 50, 160 120, 200 130 L200 200 L0 200" fill="url(#waveGrad)" stroke="var(--color-brand-gold)" strokeWidth="1"/>
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--color-brand-cyan)" />
                <stop offset="100%" stopColor="var(--color-brand-darkgreen)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Visual Typography Brand Focus */}
            <div className="lg:col-span-7 space-y-8 text-left">
              <div className="inline-flex items-center space-x-2 bg-brand-darkgreen/10 px-4 py-1.5 rounded-full border border-brand-darkgreen/20">
                <Sunset size={14} className="text-brand-gold animate-pulse" />
                <span className="text-xs text-brand-darkgreen font-semibold tracking-widest uppercase">2026 夏季特別企劃｜不趕時間下午茶</span>
              </div>

              <div className="space-y-4">
                <h2 className="font-serif-tc text-4xl sm:text-5xl lg:text-6xl text-brand-deepteal font-black leading-tight tracking-wide">
                  搭上海風號，<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-darkgreen to-brand-gold">
                    把午後變成一趟慢活小旅行
                  </span>
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-brand-gold to-transparent"></div>
                <p className="font-serif-tc text-lg sm:text-2xl text-brand-gold font-bold tracking-widest">
                  慢享海景 × 精緻甜點 × 好時光
                </p>
              </div>

              <p className="text-slate-600 max-w-xl text-base leading-relaxed font-sans-tc">
                沿著蔚藍無際的東海岸線徐徐前進，置身在頂級古典美學設計的寶石綠觀光列車。在舒暢悠揚的爵士音樂中，一邊遠看粼粼碎浪的湛藍海面，一邊品嚐由職人每日低溫烘焙、精選搭配的奢華限定精緻甜點雙層盒。這才是屬於您的無壓靈魂洗滌之旅。
              </p>

              {/* Multi-feature CTA Buttons */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                  href="https://line.me/ti/p/BqTYWDpaas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-deepteal hover:bg-brand-darkgreen text-brand-lightgold hover:text-white font-extrabold py-5 px-12 rounded-full border-2 border-brand-gold/60 transition-all transform hover:-translate-y-1 hover:shadow-2xl shadow-xl tracking-widest text-base sm:text-lg flex items-center justify-center space-x-3 group cursor-pointer w-full sm:w-auto"
                >
                  <Gift size={22} className="text-brand-gold animate-bounce" />
                  <span>立即領取體驗</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </a>
              </div>

              {/* Real Value Badges */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-brand-gold/20 max-w-xl">
                <div>
                  <div className="text-2xl font-serif-tc font-bold text-brand-darkgreen">海面第一排</div>
                  <div className="text-[11px] text-slate-500 font-semibold tracking-wider">180度環景巨幕窗</div>
                </div>
                <div>
                  <div className="text-2xl font-serif-tc font-bold text-brand-darkgreen">職人手作</div>
                  <div className="text-[11px] text-slate-500 font-semibold tracking-wider font-sans-tc">在地豐饒果物食材</div>
                </div>
                <div>
                  <div className="text-2xl font-serif-tc font-bold text-brand-darkgreen">極致舒壓</div>
                  <div className="text-[11px] text-slate-500 font-semibold tracking-wider">五星古典歐風沙龍車</div>
                </div>
              </div>
            </div>

            {/* Right Column: Original ad images combined elegantly as high-end aesthetic collages */}
            <div className="lg:col-span-5 relative flex flex-col items-center">
              <div className="absolute inset-0 bg-brand-cyan/20 rounded-full filter blur-3xl -z-10 animate-pulse"></div>

              {/* Card Container holding dynamic views */}
              <div className="relative w-full max-w-md bg-white p-4.5 rounded-3xl shadow-2xl border border-brand-gold/20 transition-all duration-500 hover:scale-[1.01]">
                <div className="overflow-hidden rounded-2xl relative aspect-[1.1] bg-brand-deepteal">
                  <img 
                    src={
                      selectedScenario === "dating" 
                        ? haifengTrainInterior // interior for romantic dating vibe
                        : selectedScenario === "birthday"
                          ? haifengDessertBox // exquisite dessert box for celebration
                          : haifengTrainExterior // gorgeous scenic train for閨蜜bff travel
                    } 
                    alt="海風號美學視覺" 
                    className="object-cover w-full h-full opacity-90 transition-all duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-deepteal/80 via-transparent to-transparent"></div>
                  
                  {/* Badge on Image */}
                  <div className="absolute top-4 right-4 bg-brand-gold text-brand-deepteal text-[10px] font-bold px-3 py-1 rounded-full border border-brand-lightgold shadow-md uppercase tracking-wider">
                    {selectedScenario === "dating" ? "浪漫雙人座" : selectedScenario === "birthday" ? "尊榮壽星禮" : "閨蜜午後宴"}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 text-brand-cream space-y-1">
                    <span className="text-[11px] uppercase tracking-widest text-brand-lightgold font-bold">海風號 經典窗景</span>
                    <h4 className="font-serif-tc text-xl font-bold">「唯有放慢靈魂，才得擁抱世界。」</h4>
                  </div>
                </div>

                {/* Switcher tabs immediately below image to engage user */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => setSelectedScenario("dating")}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${selectedScenario === 'dating' ? 'bg-brand-darkgreen text-brand-lightgold shadow-sm border border-brand-gold/40' : 'bg-brand-cream hover:bg-brand-cyan/20 text-brand-deepteal'}`}
                  >
                    雙人唯美浪漫
                  </button>
                  <button 
                    onClick={() => setSelectedScenario("birthday")}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${selectedScenario === 'birthday' ? 'bg-brand-darkgreen text-brand-lightgold shadow-sm border border-brand-gold/40' : 'bg-brand-cream hover:bg-brand-cyan/20 text-brand-deepteal'}`}
                  >
                    精美慶生特典
                  </button>
                  <button 
                    onClick={() => setSelectedScenario("friends")}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center ${selectedScenario === 'friends' ? 'bg-brand-darkgreen text-brand-lightgold shadow-sm border border-brand-gold/40' : 'bg-brand-cream hover:bg-brand-cyan/20 text-brand-deepteal'}`}
                  >
                    姊妹歡聚香檳
                  </button>
                </div>
              </div>

              {/* Decorative mini boarding pass overlap */}
              <div className="absolute -bottom-6 -left-6 hidden md:block bg-brand-deepteal text-brand-lightgold px-5 py-3 rounded-2xl border border-brand-gold shadow-lg font-serif-tc space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-brand-gold font-bold">
                  <Compass size={13} className="animate-spin" style={{ animationDuration: "12s" }} />
                  <span>SEA BREEZE CAR NO.1</span>
                </div>
                <p className="text-[10px] text-brand-cream/80 tracking-widest">不趕時間的旅程，才有風景</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIVITY HIGHLIGHTS (活動亮點區) - THREE STUNNING 图文 cards */}
      <section id="highlights" className="py-20 bg-white border-b border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs uppercase tracking-widest font-black text-brand-gold">The Journey Signature</span>
            <h3 className="font-serif-tc text-3xl sm:text-4xl text-brand-deepteal font-bold tracking-wide">
              海風號 ✦ 三大奢華慢享提案
            </h3>
            <div className="w-12 h-0.5 bg-brand-gold mx-auto"></div>
            <p className="text-slate-500 text-sm">從流線金屬軌道聲到舌尖精製法烘焙，我們把旅行中的每一格畫面重新著色。</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Highlight 1 */}
            <div className="bg-brand-cream rounded-3xl p-8 border border-brand-gold/15 shadow-sm hover:shadow-2xl hover:border-brand-gold/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-darkgreen/15 flex items-center justify-center text-brand-darkgreen mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sunset size={28} className="text-brand-gold" />
              </div>
              <h4 className="font-serif-tc text-xl font-bold text-brand-deepteal mb-3 flex items-center justify-between">
                <span>絕美視角 · 海景第一排</span>
                <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2.5 py-0.5 rounded-full font-serif-tc font-bold">180° 環彩幕</span>
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                打破車窗鐵框限制！特別定製超薄流線巨幕防眩玻璃，不論晨光破曉或是金黃落日，百米蔚藍海洋盡收眼底，隨便拍都是明信片級大片。
              </p>
              <div className="bg-white/80 p-3.5 rounded-2xl mt-4 border border-brand-gold/10 text-xs text-brand-deepteal flex justify-between items-center font-semibold">
                <span>✦ 免費附設古典專屬雙人暖木桌</span>
                <ChevronRight size={14} className="text-brand-gold" />
              </div>
            </div>

            {/* Highlight 2 */}
            <div className="bg-brand-cream rounded-3xl p-8 border border-brand-gold/15 shadow-sm hover:shadow-2xl hover:border-brand-gold/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-darkgreen/15 flex items-center justify-center text-brand-darkgreen mb-6 group-hover:scale-110 transition-transform duration-300">
                <Coffee size={28} className="text-brand-gold" />
              </div>
              <h4 className="font-serif-tc text-xl font-bold text-brand-deepteal mb-3 flex items-center justify-between">
                <span>職人甜點 · 限定精緻盒</span>
                <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2.5 py-0.5 rounded-full font-serif-tc font-bold">烘焙坊協演</span>
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                嚴選頂級進口白巧、初雪抹茶粉，融入東台灣鮮採金桔與蜜香紅茶，精心研發「極之旬菓」甜點奢箱。每一口都是細膩層次的尊爵享受。
              </p>
              <div className="bg-white/80 p-3.5 rounded-2xl mt-4 border border-brand-gold/10 text-xs text-brand-deepteal flex justify-between items-center font-semibold">
                <span>✦ 配搭暖心高山烏龍或耶加雪菲</span>
                <ChevronRight size={14} className="text-brand-gold" />
              </div>
            </div>

            {/* Highlight 3 */}
            <div className="bg-brand-cream rounded-3xl p-8 border border-brand-gold/15 shadow-sm hover:shadow-2xl hover:border-brand-gold/40 transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-brand-darkgreen/15 flex items-center justify-center text-brand-darkgreen mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sparkles size={28} className="text-brand-gold" />
              </div>
              <h4 className="font-serif-tc text-xl font-bold text-brand-deepteal mb-3 flex items-center justify-between">
                <span>各種場合 · 專屬紀念</span>
                <span className="text-[10px] bg-brand-gold/10 text-brand-gold px-2.5 py-0.5 rounded-full font-serif-tc font-bold">美學定製</span>
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                內建頂奢氛圍燈與留聲爵士樂，不論為伴侶策劃一場驚喜求婚，或是與姊妹享用悠閒午茶，甚至是為家人補辦盛大生日，我們皆為您精準打點。
              </p>
              <div className="bg-white/80 p-3.5 rounded-2xl mt-4 border border-brand-gold/10 text-xs text-brand-deepteal flex justify-between items-center font-semibold">
                <span>✦ 客製化紀念登車證與手寫姓名卡</span>
                <ChevronRight size={14} className="text-brand-gold" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CONCEPT AD STORY DETAIL (體驗介紹區) - IMMERSIVE STORY */}
      <section id="concept" className="relative py-20 lg:py-28 bg-brand-cream/80 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/20 filter blur-3xl rounded-full opacity-65 translate-x-20 -translate-y-10"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/10 filter blur-3xl rounded-full opacity-65 -translate-x-20 translate-y-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Grid Overviews representing high quality train interior */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-md transform hover:-rotate-1 transition-all duration-300 bg-brand-deepteal border border-brand-gold/15">
                  <img 
                    src={haifengTrainExterior} 
                    alt="海風號經典列車" 
                    className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-500" 
                  />
                </div>
                <div className="bg-brand-darkgreen text-brand-lightgold p-6 rounded-3xl border border-brand-gold/30 text-center font-serif-tc">
                  <Award size={28} className="mx-auto mb-2 text-brand-gold" />
                  <span className="block text-xl font-bold font-serif-tc">五星首選</span>
                  <p className="text-[10px] text-brand-cream/80 mt-1 uppercase tracking-widest font-sans-tc">票選最療癒人文行程</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white/90 p-5 rounded-3xl border border-brand-gold/20 shadow-sm text-center">
                  <span className="text-3xl font-bold text-brand-deepteal font-serif-tc">10+</span>
                  <p className="text-[10px] text-slate-500 font-semibold tracking-wider font-sans-tc mt-1">頂級菓燒職人鮮配</p>
                </div>
                <div className="rounded-3xl overflow-hidden shadow-md transform hover:rotate-1 transition-all duration-300 bg-brand-deepteal border border-brand-gold/15">
                  <img 
                    src={haifengTrainInterior} 
                    alt="古典車廂雅座" 
                    className="w-full object-cover aspect-[4/5] hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              </div>
            </div>

            {/* Typographic narrative columns */}
            <div className="lg:col-span-6 space-y-8 text-left">
              <span className="text-xs tracking-widest text-brand-gold font-bold uppercase block">Philosophical Wanderlust</span>
              <h3 className="font-serif-tc text-3xl sm:text-4xl lg:text-5xl text-brand-deepteal font-black leading-tight">
                一場不用遠行的<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-darkgreen to-brand-gold">
                  蔚藍海岸微醺下午茶
                </span>
              </h3>
              <div className="h-1 w-20 bg-brand-gold"></div>

              <div className="space-y-4 text-slate-600 text-base leading-relaxed">
                <p>
                  我們常說生活太匆忙，所以錯過了許多本該屬於自己的好風光。「海風號」的存在，就是為了讓您擁有一段完整、從容、且精緻的午後。
                </p>
                <p>
                  當列車優雅地在沿海鐵軌上前行，車體流暢的微恙像是在搖籃中般讓人放鬆。放眼望去，深淺不一的果凍藍層疊成美麗的海平線，再將一勺甜而不膩的法式巧克力糕點送入嘴中。香醇與海風的味道在髮梢、指尖、以及味蕾擴散。
                </p>
              </div>

              {/* Decorative blockquote */}
              <div className="border-l-4 border-brand-gold pl-5 py-2.5 bg-brand-cyan/10 rounded-r-2xl border-brand-gold/40">
                <blockquote className="italic font-serif-tc text-brand-deepteal text-sm font-semibold leading-relaxed">
                  「這是一段把時間慷慨浪費在美好事物上的旅途。窗外全是海，而桌上全是幸福甜香。」
                </blockquote>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. COUPON CLAIM SECTION (優惠方案區) */}
      <section id="coupon" className="py-20 bg-brand-deepteal text-brand-cream border-t border-brand-gold/40 relative overflow-hidden">
        
        {/* Swirling glow elements */}
        <div className="absolute top-0 left-12 w-64 h-64 bg-brand-cyan/15 filter blur-3xl rounded-full"></div>
        <div className="absolute bottom-4 right-12 w-80 h-80 bg-brand-gold/10 filter blur-3xl rounded-full"></div>

        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="w-16 h-16 rounded-full bg-brand-cream/10 flex items-center justify-center mx-auto text-brand-gold border border-brand-gold/40 animate-bounce">
            <Compass size={32} />
          </div>

          <div className="space-y-3">
            <span className="text-xs tracking-widest text-[#DFCA9B] font-serif-tc font-bold block uppercase">Line Exclusive Offer</span>
            <h3 className="font-serif-tc text-3xl sm:text-4xl text-brand-lightgold font-bold">
              極限特邀 ✧ 掃碼領取 LINE 預約專屬空席折扣
            </h3>
            <div className="h-0.5 w-16 bg-brand-gold mx-auto"></div>
          </div>

          <p className="text-brand-cream/80 text-sm max-w-xl mx-auto font-sans-tc leading-relaxed">
            限時開放「海風號」夢幻體驗車次，想一邊細聽慢活海風一邊啜飲奢華下午茶嗎？點擊下方按鈕或掃描 QR CODE，即可獲得最新班次日程、甜點套餐詳情、並享有登車全品項專屬優惠。
          </p>

          <div className="flex flex-col md:flex-row justify-center items-center gap-8 bg-brand-cream/10 p-8 rounded-3xl border border-brand-gold/30 max-w-2xl mx-auto">
            
            {/* Action text & button */}
            <div className="space-y-4 text-left">
              <h4 className="font-serif-tc font-bold text-lg text-brand-lightgold">
                限時預約名額・客製方案
              </h4>
              <p className="text-xs text-brand-cream/70 leading-relaxed max-w-sm font-sans-tc">
                線上專業管家提供一對一古典席位置預訂，並贈送客製手繪姓名卡片與主廚烘焙小茶點招待！
              </p>
              <a 
                href="https://line.me/ti/p/BqTYWDpaas"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-gold hover:bg-brand-lightgold hover:scale-[1.03] text-brand-deepteal font-extrabold py-4 px-8 rounded-full text-sm sm:text-base tracking-widest transition-all shadow-xl inline-flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto text-center"
              >
                <Gift size={18} />
                <span>立即領取體驗</span>
              </a>
            </div>

            {/* Simulated brand QR module matching ad image */}
            <div className="bg-white p-3.5 rounded-2xl border-2 border-brand-gold shadow-md shrink-0">
              <div className="w-28 h-28 flex items-center justify-center p-1">
                <QRCodeSVG
                  value="https://line.me/ti/p/BqTYWDpaas"
                  size={104}
                  level="H"
                  fgColor="#143630"
                  bgColor="#FFFFFF"
                  imageSettings={{
                    src: "https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg",
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FOOTER PART */}
      <footer className="bg-brand-deepteal text-white py-14 border-t border-brand-gold/20 font-serif-tc">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <h3 className="text-xl tracking-widest text-brand-lightgold">海風號 ✦ 甜點觀光列車</h3>
        </div>
      </footer>

      {/* 9. PORTABLE LINE COUPON INTERACTION DIALOG MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FAF8F4] w-full max-w-md rounded-3xl p-6 relative border-2 border-brand-gold shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
            
            {/* Close */}
            <button 
              onClick={() => setShowCouponModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 transition-colors focus:outline-none"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-brand-darkgreen/10 rounded-full flex items-center justify-center mx-auto text-brand-gold border border-brand-gold/30">
              <Gift size={32} />
            </div>

            <div>
              <h4 className="font-serif-tc text-2xl text-brand-deepteal font-bold">LINE 專屬乘車招待券</h4>
              <p className="text-[10px] text-[#C5A059] tracking-widest font-black uppercase font-mono-tc mt-1">Savour the Breeze Exclusive Coupon</p>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-dashed border-brand-gold inline-block mx-auto">
              <QRCodeSVG
                value="https://line.me/ti/p/BqTYWDpaas"
                size={128}
                level="H"
                fgColor="#143630"
                bgColor="#FFFFFF"
                imageSettings={{
                  src: "https://upload.wikimedia.org/wikipedia/commons/4/41/LINE_logo.svg",
                  height: 28,
                  width: 28,
                  excavate: true,
                }}
                className="mx-auto"
              />
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-bold text-brand-deepteal">「2026 夏日限定 ✦ 特惠乘席九折優惠券」</p>
              <p className="text-xs text-slate-500 font-sans-tc">加入好友後貼上「 慢活海風2026 」即刻有線上秘書為您劃坐</p>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setShowCouponModal(false)}
                className="w-full bg-[#1F4E46] text-white py-3.5 rounded-full text-xs font-bold tracking-widest hover:bg-[#143630] transition-colors"
              >
                我知道了，下載優惠儲存
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
