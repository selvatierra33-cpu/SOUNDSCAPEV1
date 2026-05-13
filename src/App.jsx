import { useState, useEffect, useRef, useCallback } from "react";

/* ─── GOOGLE FONTS ─────────────────────────────────────────────────────────── */
const FontLoader = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,300;1,400;1,600&family=Jost:wght@300;400&family=DM+Mono:wght@300;400&display=swap');
  `}</style>
);

/* ─── BRAND TOKENS — terracotta warmth edition ──────────────────────────────── */
const C = {
  cream:    "#EDE9C4",
  sageMint: "#C0DAC1",
  grayGreen:"#AFB8A4",
  mutedTeal:"#6F887A",
  teal:     "#608E81",
  terra:    "#A35228",
  amber:    "#DAA547",
  dark:     "#111714",
  darkAlt:  "#1a1f1c",
  // Terracotta background layers
  bg:       "#7a3d1e",
  bgMid:    "#8f4a25",
  bgLight:  "#a5562c",
  bgCard:   "#5c2e14",
};

const F = {
  display: "'Cormorant Garamond', Georgia, serif",
  body:    "'Jost', sans-serif",
  mono:    "'DM Mono', monospace",
};

/* ─── GENRES ────────────────────────────────────────────────────────────────── */
const GENRES = [
  { id:"classical",    name:"Classical",         scale:[0,2,4,5,7,9,11,12], base:60, tempo:72,  dur:0.42, synth:"triangle",  desc:"Diatonic, expressive" },
  { id:"singer",       name:"Singer-Songwriter", scale:[0,2,4,7,9,12],      base:57, tempo:88,  dur:0.36, synth:"sine",      desc:"Pentatonic warmth" },
  { id:"edm",          name:"EDM",               scale:[0,2,4,7,9,12],      base:62, tempo:128, dur:0.18, synth:"sawtooth",  desc:"Driving grid, pulse" },
  { id:"jazz",         name:"Jazz",              scale:[0,2,3,5,7,9,10,12], base:58, tempo:100, dur:0.28, synth:"sine",      desc:"Dorian, swing feel" },
  { id:"ambient",      name:"Ambient",           scale:[0,4,7,11,14],       base:48, tempo:40,  dur:1.4,  synth:"sine",      desc:"Slow, meditative" },
  { id:"flamenco",     name:"Flamenco",          scale:[0,1,4,5,7,8,11,12], base:64, tempo:110, dur:0.22, synth:"triangle",  desc:"Phrygian, passionate" },
  { id:"celtic",       name:"Celtic / Folk",     scale:[0,2,4,7,9,12,14],   base:62, tempo:96,  dur:0.26, synth:"triangle",  desc:"Mixolydian, flowing" },
  { id:"hiphop",       name:"Hip-Hop",           scale:[0,3,5,7,10,12],     base:55, tempo:90,  dur:0.20, synth:"sine",      desc:"Minor pent, groove" },
  { id:"cinematic",    name:"Cinematic",         scale:[0,2,3,5,7,8,11,12], base:52, tempo:60,  dur:0.62, synth:"triangle",  desc:"Harmonic minor, epic" },
  { id:"reggae",       name:"Reggae",            scale:[0,2,4,7,9,12],      base:55, tempo:80,  dur:0.30, synth:"sine",      desc:"Major pent, offbeat" },
];

/* ─── ANIMALS ───────────────────────────────────────────────────────────────── */
const ANIMALS = [
  { id:"frog",   name:"Frog",         emoji:"🐸" },
  { id:"jaguar", name:"Jaguar",       emoji:"🐆" },
  { id:"toucan", name:"Toucan",       emoji:"🦜" },
  { id:"tapir",  name:"Tapir",        emoji:"🦏" },
  { id:"snake",  name:"Coral Snake",  emoji:"🐍" },
  { id:"off",    name:"Off",          emoji:"✕"  },
];

/* ─── MAYAN CODEX SVG ANIMALS ───────────────────────────────────────────────── */
// Each returns an SVG group centered at 0,0 with given scale/phase
function FrogSVG({ phase }) {
  const bounce = Math.sin(phase * Math.PI * 2) * 8;
  const squish = 1 + Math.sin(phase * Math.PI * 2) * 0.12;
  return (
    <g transform={`translate(0,${bounce}) scale(1,${squish})`}>
      {/* Body */}
      <ellipse cx="0" cy="0" rx="22" ry="18" fill={C.teal} stroke={C.terra} strokeWidth="2.5"/>
      {/* Head */}
      <ellipse cx="0" cy="-22" rx="16" ry="13" fill={C.teal} stroke={C.terra} strokeWidth="2.5"/>
      {/* Eyes */}
      <circle cx="-9" cy="-28" r="6" fill={C.amber} stroke={C.terra} strokeWidth="2"/>
      <circle cx="9" cy="-28" r="6" fill={C.amber} stroke={C.terra} strokeWidth="2"/>
      <circle cx="-9" cy="-28" r="2.5" fill={C.dark}/>
      <circle cx="9" cy="-28" r="2.5" fill={C.dark}/>
      {/* Smile */}
      <path d="M-7,-17 Q0,-12 7,-17" stroke={C.terra} strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Spots */}
      <circle cx="-8" cy="2" r="4" fill={C.amber} opacity="0.85"/>
      <circle cx="8" cy="-4" r="3" fill={C.amber} opacity="0.85"/>
      <circle cx="2" cy="8" r="3.5" fill={C.amber} opacity="0.85"/>
      {/* Arms - wave with phase */}
      <line x1="-22" y1="-5" x2={-36 + Math.sin(phase*Math.PI*2)*6} y2={-18 + Math.cos(phase*Math.PI*2)*6}
        stroke={C.terra} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="22" y1="-5" x2={36 - Math.sin(phase*Math.PI*2)*6} y2={-18 + Math.cos(phase*Math.PI*2)*6}
        stroke={C.terra} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Legs */}
      <line x1="-12" y1="16" x2="-22" y2="34" stroke={C.terra} strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="12" y1="16" x2="22" y2="34" stroke={C.terra} strokeWidth="3.5" strokeLinecap="round"/>
      {/* Feet */}
      <ellipse cx="-26" cy="36" rx="8" ry="4" fill={C.teal} stroke={C.terra} strokeWidth="2" transform={`rotate(-20,-26,36)`}/>
      <ellipse cx="26" cy="36" rx="8" ry="4" fill={C.teal} stroke={C.terra} strokeWidth="2" transform={`rotate(20,26,36)`}/>
    </g>
  );
}

function JaguarSVG({ phase }) {
  const sway = Math.sin(phase * Math.PI * 2) * 6;
  const tailWag = Math.sin(phase * Math.PI * 4) * 20;
  return (
    <g transform={`translate(${sway},0)`}>
      {/* Body */}
      <ellipse cx="0" cy="5" rx="26" ry="16" fill={C.amber} stroke={C.dark} strokeWidth="2.5"/>
      {/* Rosettes */}
      {[[-10,-2],[8,0],[0,10],[-14,8],[12,8]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="4" fill="none" stroke={C.dark} strokeWidth="2"/>
      ))}
      {/* Head */}
      <ellipse cx="0" cy="-18" rx="15" ry="13" fill={C.amber} stroke={C.dark} strokeWidth="2.5"/>
      {/* Ears */}
      <polygon points="-14,-28 -8,-38 -4,-28" fill={C.amber} stroke={C.dark} strokeWidth="2"/>
      <polygon points="14,-28 8,-38 4,-28" fill={C.amber} stroke={C.dark} strokeWidth="2"/>
      <polygon points="-11,-29 -8,-35 -6,-29" fill={C.terra} stroke="none"/>
      <polygon points="11,-29 8,-35 6,-29" fill={C.terra} stroke="none"/>
      {/* Eyes */}
      <ellipse cx="-6" cy="-20" rx="4" ry="3" fill={C.cream} stroke={C.dark} strokeWidth="1.5"/>
      <ellipse cx="6" cy="-20" rx="4" ry="3" fill={C.cream} stroke={C.dark} strokeWidth="1.5"/>
      <circle cx="-6" cy="-20" r="2" fill={C.dark}/>
      <circle cx="6" cy="-20" r="2" fill={C.dark}/>
      {/* Nose */}
      <ellipse cx="0" cy="-13" rx="4" ry="3" fill={C.terra} stroke={C.dark} strokeWidth="1.5"/>
      {/* Whisker lines */}
      <line x1="-4" y1="-12" x2="-18" y2="-10" stroke={C.dark} strokeWidth="1" opacity="0.7"/>
      <line x1="4" y1="-12" x2="18" y2="-10" stroke={C.dark} strokeWidth="1" opacity="0.7"/>
      {/* Tail */}
      <path d={`M24,10 Q40,${tailWag} 30,${20+tailWag*0.5}`}
        stroke={C.amber} strokeWidth="5" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <line x1="-16" y1="18" x2="-18" y2="36" stroke={C.dark} strokeWidth="4" strokeLinecap="round"/>
      <line x1="-6" y1="20" x2="-8" y2="36" stroke={C.dark} strokeWidth="4" strokeLinecap="round"/>
      <line x1="6" y1="20" x2="8" y2="36" stroke={C.dark} strokeWidth="4" strokeLinecap="round"/>
      <line x1="16" y1="18" x2="18" y2="36" stroke={C.dark} strokeWidth="4" strokeLinecap="round"/>
    </g>
  );
}

function ToucanSVG({ phase }) {
  const bobY = Math.sin(phase * Math.PI * 2) * 5;
  const beakAngle = Math.sin(phase * Math.PI * 2) * 8;
  return (
    <g transform={`translate(0,${bobY})`}>
      {/* Body */}
      <ellipse cx="0" cy="8" rx="20" ry="22" fill={C.dark} stroke={C.darkAlt} strokeWidth="2"/>
      {/* Chest patch */}
      <ellipse cx="0" cy="2" rx="12" ry="14" fill={C.amber}/>
      {/* Head */}
      <circle cx="0" cy="-22" r="14" fill={C.dark} stroke={C.darkAlt} strokeWidth="2"/>
      {/* Eye */}
      <circle cx="5" cy="-24" r="6" fill={C.cream}/>
      <circle cx="6" cy="-24" r="3" fill={C.dark}/>
      <circle cx="7" cy="-25" r="1" fill={C.cream}/>
      {/* Beak - rotates like pecking */}
      <g transform={`rotate(${beakAngle},0,-22)`}>
        <path d="M10,-20 Q34,-16 28,-8 Q20,-4 10,-14 Z" fill={C.terra} stroke={C.dark} strokeWidth="2"/>
        <path d="M10,-20 Q34,-16 28,-8" stroke={C.amber} strokeWidth="2" fill="none"/>
        <path d="M12,-16 Q22,-10 18,-8" stroke={C.amber} strokeWidth="1.5" fill="none" opacity="0.7"/>
      </g>
      {/* Wings spread with phase */}
      <path d={`M-20,4 Q${-36 - Math.sin(phase*Math.PI*2)*8},${-10+Math.cos(phase*Math.PI*2)*8} -16,-8`}
        fill={C.dark} stroke={C.mutedTeal} strokeWidth="2"/>
      <path d={`M20,4 Q${36 + Math.sin(phase*Math.PI*2)*8},${-10+Math.cos(phase*Math.PI*2)*8} 16,-8`}
        fill={C.dark} stroke={C.mutedTeal} strokeWidth="2"/>
      {/* Feet */}
      <line x1="-8" y1="28" x2="-10" y2="40" stroke={C.terra} strokeWidth="3" strokeLinecap="round"/>
      <line x1="8" y1="28" x2="10" y2="40" stroke={C.terra} strokeWidth="3" strokeLinecap="round"/>
      <line x1="-10" y1="40" x2="-18" y2="42" stroke={C.terra} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="-10" y1="40" x2="-8" y2="44" stroke={C.terra} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="40" x2="18" y2="42" stroke={C.terra} strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="10" y1="40" x2="8" y2="44" stroke={C.terra} strokeWidth="2.5" strokeLinecap="round"/>
    </g>
  );
}

function TapirSVG({ phase }) {
  const stomp = Math.abs(Math.sin(phase * Math.PI * 2)) * 6;
  const trunkWag = Math.sin(phase * Math.PI * 3) * 12;
  return (
    <g>
      {/* Body - big and solid */}
      <ellipse cx="0" cy="4" rx="30" ry="18" fill={C.grayGreen} stroke={C.dark} strokeWidth="2.5"/>
      {/* Head */}
      <ellipse cx="-18" cy="-10" rx="16" ry="12" fill={C.grayGreen} stroke={C.dark} strokeWidth="2.5"/>
      {/* Trunk/snout */}
      <path d={`M-28,-8 Q${-42+trunkWag},-4 ${-38+trunkWag},4`}
        stroke={C.dark} strokeWidth="6" fill="none" strokeLinecap="round"/>
      <path d={`M-28,-8 Q${-42+trunkWag},-4 ${-38+trunkWag},4`}
        stroke={C.grayGreen} strokeWidth="3.5" fill="none" strokeLinecap="round"/>
      {/* Eye */}
      <circle cx="-24" cy="-14" r="4" fill={C.cream}/>
      <circle cx="-24" cy="-14" r="2" fill={C.dark}/>
      {/* Ear */}
      <ellipse cx="-10" cy="-20" rx="6" ry="8" fill={C.grayGreen} stroke={C.dark} strokeWidth="2"
        transform="rotate(-20,-10,-20)"/>
      <ellipse cx="-10" cy="-20" rx="3" ry="5" fill={C.terra} stroke="none"
        transform="rotate(-20,-10,-20)"/>
      {/* Stripe pattern - Mayan geometric */}
      <path d="M-5,-5 L5,-5 L8,5 L-8,5 Z" fill={C.mutedTeal} opacity="0.5"/>
      {/* Legs with stomp */}
      <rect x="-22" y="18" width="9" height={14+stomp} rx="3" fill={C.dark}/>
      <rect x="-8" y="18" width="9" height={14-stomp} rx="3" fill={C.dark}/>
      <rect x="6" y="18" width="9" height={14+stomp} rx="3" fill={C.dark}/>
      <rect x="20" y="18" width="9" height={14-stomp} rx="3" fill={C.dark}/>
      {/* Tail */}
      <ellipse cx="30" cy="2" rx="5" ry="4" fill={C.grayGreen} stroke={C.dark} strokeWidth="2"/>
    </g>
  );
}

function SnakeSVG({ phase }) {
  const t = phase * Math.PI * 2;
  // Undulating S-curve
  const pts = Array.from({length:20},(_,i)=>{
    const prog = i/19;
    const x = -40 + prog*80;
    const y = Math.sin(t + prog*Math.PI*3)*18 * (1-prog*0.3);
    return [x,y];
  });
  const pathD = pts.map(([x,y],i)=>i===0?`M${x},${y}`:`L${x},${y}`).join(' ');

  // Band colors: terra / amber / cream pattern
  const bandColors = [C.terra, C.amber, C.cream, C.amber, C.terra];

  return (
    <g>
      {/* Body bands */}
      {pts.slice(0,-1).map(([x,y],i)=>(
        <line key={i} x1={x} y1={y} x2={pts[i+1][0]} y2={pts[i+1][1]}
          stroke={bandColors[i % bandColors.length]}
          strokeWidth="12" strokeLinecap="round"/>
      ))}
      {/* Outline */}
      <path d={pathD} stroke={C.dark} strokeWidth="14" fill="none" strokeLinecap="round" opacity="0.3"/>
      <path d={pathD} stroke="none" fill="none"/>
      {/* Head */}
      <g transform={`translate(${pts[19][0]},${pts[19][1]})`}>
        <ellipse cx="0" cy="0" rx="10" ry="7" fill={C.terra} stroke={C.dark} strokeWidth="2"
          transform={`rotate(${Math.atan2(pts[19][1]-pts[18][1],pts[19][0]-pts[18][0])*180/Math.PI})`}/>
        <circle cx="0" cy="-3" r="2.5" fill={C.cream}/>
        <circle cx="0" cy="-3" r="1" fill={C.dark}/>
        {/* Tongue */}
        <path d={`M4,0 L${12+Math.sin(t*3)*3},${-3+Math.cos(t*2)*2} M${12+Math.sin(t*3)*3},${-3+Math.cos(t*2)*2} L${16+Math.sin(t*3)*3},${-6+Math.cos(t*2)*2} M${12+Math.sin(t*3)*3},${-3+Math.cos(t*2)*2} L${16+Math.sin(t*3)*3},${Math.cos(t*2)*2}`}
          stroke={C.terra} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </g>
    </g>
  );
}

/* ─── UTILS ─────────────────────────────────────────────────────────────────── */
function midiToFreq(m){ return 440*Math.pow(2,(m-69)/12); }

function extractSkyline(canvas, cropY, n=48){
  const ctx=canvas.getContext("2d");
  const w=canvas.width, h=canvas.height;
  const imageData=ctx.getImageData(0,0,w,h).data;
  const getPixel=(x,y)=>{
    const i=(Math.floor(y)*w+Math.floor(x))*4;
    return(imageData[i]*0.299+imageData[i+1]*0.587+imageData[i+2]*0.114)/255;
  };
  let skyBrightness=0;
  for(let sx=0;sx<Math.min(w,40);sx++){
    for(let sy=0;sy<Math.min(h*0.15,30);sy++){
      skyBrightness+=getPixel(sx,sy);
    }
  }
  skyBrightness/=(40*30);
  const threshold=Math.max(0.08,skyBrightness*0.75);
  const rawElevs=Array.from({length:n},(_,i)=>{
    const x=Math.floor((i/n)*w);
    let peakY=h*0.85;
    for(let sy=0;sy<h*0.9;sy++){
      if(getPixel(x,sy)<threshold){peakY=sy;break;}
    }
    return 1-(peakY/h);
  });
  return rawElevs.map((e,i)=>{
    const prev=rawElevs[Math.max(0,i-1)];
    const next=rawElevs[Math.min(rawElevs.length-1,i+1)];
    return(prev+e+next)/3;
  });
}

function elevationToNotes(elevs, genre){
  return elevs.map(e=>{
    const idx=Math.floor(e*(genre.scale.length-1));
    return genre.base+genre.scale[Math.min(idx,genre.scale.length-1)];
  });
}

function playNotes(notes, genre, onProgress, onDone){
  const ctx=new(window.AudioContext||window.webkitAudioContext)();
  const total=notes.length*genre.dur;
  const start=ctx.currentTime+0.05;
  notes.forEach((midi,i)=>{
    const osc=ctx.createOscillator();
    const gain=ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type=genre.synth;
    osc.frequency.setValueAtTime(midiToFreq(midi),start+i*genre.dur);
    gain.gain.setValueAtTime(0,start+i*genre.dur);
    gain.gain.linearRampToValueAtTime(0.15,start+i*genre.dur+0.02);
    gain.gain.linearRampToValueAtTime(0,start+(i+1)*genre.dur-0.02);
    osc.start(start+i*genre.dur);
    osc.stop(start+(i+1)*genre.dur);
  });
  const iv=setInterval(()=>{
    const p=Math.min((ctx.currentTime-start+0.05)/total,1);
    onProgress(p);
    if(p>=1){clearInterval(iv);setTimeout(onDone,300);}
  },50);
  return ()=>{clearInterval(iv);ctx.close();};
}

/* ─── JUNGLE BORDER ─────────────────────────────────────────────────────────── */
function JungleBorder(){
  return (
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 520 300" preserveAspectRatio="none">
      {/* Left foliage */}
      <g opacity="0.85">
        <path d="M0,80 Q20,60 10,40 Q30,55 25,30 Q40,50 35,25 Q50,48 42,20" stroke={C.teal} strokeWidth="2" fill="none"/>
        <ellipse cx="10" cy="40" rx="14" ry="9" fill={C.sageMint} stroke={C.teal} strokeWidth="1.5" transform="rotate(-30,10,40)"/>
        <ellipse cx="25" cy="30" rx="16" ry="8" fill={C.teal} stroke={C.mutedTeal} strokeWidth="1.5" transform="rotate(-50,25,30)"/>
        <ellipse cx="35" cy="25" rx="12" ry="7" fill={C.sageMint} stroke={C.teal} strokeWidth="1.5" transform="rotate(-70,35,25)"/>
        <path d="M0,200 Q18,185 8,165 Q28,178 22,155 Q38,170 30,145" stroke={C.teal} strokeWidth="2" fill="none"/>
        <ellipse cx="8" cy="165" rx="13" ry="8" fill={C.teal} stroke={C.mutedTeal} strokeWidth="1.5" transform="rotate(-25,8,165)"/>
        <ellipse cx="22" cy="155" rx="15" ry="7" fill={C.sageMint} stroke={C.teal} strokeWidth="1.5" transform="rotate(-55,22,155)"/>
        {/* Mayan geometric accent */}
        <rect x="2" y="130" width="12" height="12" fill="none" stroke={C.amber} strokeWidth="1.5" opacity="0.6"/>
        <rect x="5" y="133" width="6" height="6" fill={C.amber} opacity="0.4"/>
      </g>
      {/* Right foliage */}
      <g opacity="0.85">
        <path d="M520,90 Q500,70 510,50 Q490,65 495,40 Q480,58 485,32 Q470,52 478,26" stroke={C.teal} strokeWidth="2" fill="none"/>
        <ellipse cx="510" cy="50" rx="14" ry="9" fill={C.sageMint} stroke={C.teal} strokeWidth="1.5" transform="rotate(30,510,50)"/>
        <ellipse cx="495" cy="40" rx="16" ry="8" fill={C.teal} stroke={C.mutedTeal} strokeWidth="1.5" transform="rotate(50,495,40)"/>
        <ellipse cx="485" cy="32" rx="12" ry="7" fill={C.sageMint} stroke={C.teal} strokeWidth="1.5" transform="rotate(70,485,32)"/>
        <path d="M520,210 Q502,195 512,175 Q492,188 498,165 Q482,178 490,153" stroke={C.teal} strokeWidth="2" fill="none"/>
        <ellipse cx="512" cy="175" rx="13" ry="8" fill={C.teal} stroke={C.mutedTeal} strokeWidth="1.5" transform="rotate(25,512,175)"/>
        <ellipse cx="498" cy="165" rx="15" ry="7" fill={C.sageMint} stroke={C.teal} strokeWidth="1.5" transform="rotate(55,498,165)"/>
        <rect x="506" y="130" width="12" height="12" fill="none" stroke={C.amber} strokeWidth="1.5" opacity="0.6"/>
        <rect x="509" y="133" width="6" height="6" fill={C.amber} opacity="0.4"/>
      </g>
      {/* Top vine */}
      <path d="M60,0 Q140,-8 200,5 Q280,-5 340,3 Q400,-6 460,0" stroke={C.teal} strokeWidth="2" fill="none" opacity="0.6"/>
      {/* Bottom Mayan border strip */}
      <g opacity="0.55">
        {Array.from({length:18},(_,i)=>(
          <g key={i} transform={`translate(${20+i*28},282)`}>
            <rect x="0" y="0" width="16" height="10" fill="none" stroke={C.amber} strokeWidth="1.2"/>
            <rect x="4" y="3" width="8" height="4" fill={C.amber} opacity="0.5"/>
          </g>
        ))}
      </g>
      {/* Top Mayan border strip */}
      <g opacity="0.55">
        {Array.from({length:18},(_,i)=>(
          <g key={i} transform={`translate(${20+i*28},8)`}>
            <rect x="0" y="0" width="16" height="10" fill="none" stroke={C.amber} strokeWidth="1.2"/>
            <rect x="4" y="3" width="8" height="4" fill={C.amber} opacity="0.5"/>
          </g>
        ))}
      </g>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SCREEN 1 — SPLASH
══════════════════════════════════════════════════════════════════════════════ */
function SplashScreen({onDone}){
  const [p,setP]=useState(0);
  useEffect(()=>{
    const ts=[
      setTimeout(()=>setP(1),600),
      setTimeout(()=>setP(2),1500),
      setTimeout(()=>setP(3),2400),
      setTimeout(()=>setP(4),3200),
      setTimeout(onDone,4500),
    ];
    return()=>ts.forEach(clearTimeout);
  },[onDone]);

  return(
    <div style={{
      position:"fixed",inset:0,
      background:`linear-gradient(160deg,${C.bg} 0%,${C.bgMid} 50%,${C.bgCard} 100%)`,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      overflow:"hidden",
    }}>
      <FontLoader/>
      {/* Stars */}
      {Array.from({length:50}).map((_,i)=>(
        <div key={i} style={{
          position:"absolute",
          width:Math.random()*2+1,height:Math.random()*2+1,
          borderRadius:"50%",background:C.cream,
          top:`${Math.random()*65}%`,left:`${Math.random()*100}%`,
          opacity:Math.random()*0.6+0.1,
        }}/>
      ))}

      {/* Mountain SVG animation */}
      <svg viewBox="0 0 520 160" style={{width:"min(92vw,500px)",marginBottom:8}}>
        {/* Mountain silhouette */}
        <path d="M0,130 L80,90 L120,105 L160,60 L200,78 L240,28 L280,55 L320,38 L360,70 L400,48 L440,80 L480,58 L520,90 L520,150 L0,150 Z"
          fill={`${C.cream}15`}
          stroke={`${C.cream}60`} strokeWidth="1.5"
          strokeDasharray="1200"
          strokeDashoffset={p>=1?0:1200}
          style={{transition:"stroke-dashoffset 1.1s ease-out"}}/>
        {/* Melody line */}
        <path d="M0,105 C60,90 100,65 160,72 C200,78 220,40 260,32 C300,24 330,52 370,44 C410,36 450,68 490,58 C505,54 514,72 520,80"
          fill="none" stroke={C.amber} strokeWidth="2.8" strokeLinecap="round"
          strokeDasharray="800"
          strokeDashoffset={p>=2?0:800}
          style={{transition:"stroke-dashoffset 1s ease-out"}}/>
        {/* Note dots */}
        {p>=2&&[[0,105],[80,80],[160,72],[240,32],[320,44],[400,44],[480,58],[520,80]].map(([x,y],i)=>(
          <circle key={i} cx={x} cy={y} r="4.5" fill={C.amber}
            style={{opacity:1,transition:`opacity 0.4s ${i*0.1}s`}}/>
        ))}
        {/* Mayan geometric frame lines */}
        {p>=2&&<>
          <line x1="0" y1="148" x2="520" y2="148" stroke={C.amber} strokeWidth="1" opacity="0.4"/>
          <line x1="0" y1="4" x2="520" y2="4" stroke={C.amber} strokeWidth="1" opacity="0.4"/>
        </>}
      </svg>

      {/* Wordmark */}
      <div style={{
        fontFamily:F.display,
        fontSize:"clamp(2.4rem,9vw,3.8rem)",
        fontStyle:"italic",
        fontWeight:300,
        color:C.cream,
        letterSpacing:"0.14em",
        opacity:p>=3?1:0,
        transform:p>=3?"translateY(0)":"translateY(14px)",
        transition:"opacity 0.9s,transform 0.9s",
        textShadow:`0 0 40px ${C.amber}50`,
      }}>Soundscape</div>

      {/* Tagline */}
      <div style={{
        fontFamily:F.mono,
        fontSize:"clamp(0.62rem,2.2vw,0.78rem)",
        color:C.amber,
        letterSpacing:"0.32em",
        textTransform:"uppercase",
        marginTop:10,
        opacity:p>=4?0.9:0,
        transition:"opacity 0.8s",
      }}>Created by Selva Tierra</div>

      {/* Decorative Mayan border bottom */}
      {p>=3&&<div style={{
        position:"absolute",bottom:20,
        display:"flex",gap:6,opacity:0.4,
      }}>
        {Array.from({length:12}).map((_,i)=>(
          <div key={i} style={{
            width:14,height:10,
            border:`1px solid ${C.amber}`,
            background:`${C.amber}30`,
          }}/>
        ))}
      </div>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SCREEN 2 — COMPOSE
══════════════════════════════════════════════════════════════════════════════ */
function ComposeScreen({onImage}){
  const fileRef=useRef();
  const videoRef=useRef();
  const [camMode,setCamMode]=useState(null);
  const [stream,setStream]=useState(null);
  const [panoFrames,setPanoFrames]=useState([]);

  const stopCam=useCallback(()=>{
    if(stream){stream.getTracks().forEach(t=>t.stop());setStream(null);}
    setCamMode(null);
  },[stream]);

  const startCam=async(mode)=>{
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
      setStream(s);setCamMode(mode);setPanoFrames([]);
    }catch{alert("Camera access denied.");}
  };

  useEffect(()=>{
    if(videoRef.current&&stream)videoRef.current.srcObject=stream;
  },[stream]);

  const capture=()=>{
    const v=videoRef.current;
    const c=document.createElement("canvas");
    c.width=v.videoWidth;c.height=v.videoHeight;
    c.getContext("2d").drawImage(v,0,0);
    stopCam();onImage(c);
  };

  const capturePano=()=>{
    const v=videoRef.current;
    const c=document.createElement("canvas");
    c.width=v.videoWidth;c.height=v.videoHeight;
    c.getContext("2d").drawImage(v,0,0);
    const nf=[...panoFrames,c];
    setPanoFrames(nf);
    if(nf.length>=3){
      const s=document.createElement("canvas");
      s.width=nf.reduce((a,f)=>a+f.width,0);
      s.height=nf[0].height;
      const ctx=s.getContext("2d");
      let x=0;nf.forEach(f=>{ctx.drawImage(f,x,0);x+=f.width;});
      stopCam();onImage(s);
    }
  };

  const handleUpload=e=>{
    const file=e.target.files[0];if(!file)return;
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement("canvas");
      c.width=img.width;c.height=img.height;
      c.getContext("2d").drawImage(img,0,0);
      onImage(c);
    };
    img.src=URL.createObjectURL(file);
  };

  const btns=[
    {label:"Upload Image",icon:"↑",sub:"From camera roll or files",action:()=>fileRef.current.click()},
    {label:"Take Photo",icon:"◉",sub:"Aim at any landscape",action:()=>startCam("photo")},
    {label:"Panorama",icon:"⊞",sub:"3 shots, stitched wide",action:()=>startCam("panorama")},
  ];

  return(
    <div style={{
      minHeight:"100dvh",
      background:`linear-gradient(160deg,${C.bg} 0%,${C.bgMid} 60%,${C.bgCard} 100%)`,
      display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",
      padding:"2rem 1.5rem",
    }}>
      <FontLoader/>
      <div style={{fontFamily:F.mono,color:C.amber,letterSpacing:"0.28em",fontSize:"0.65rem",textTransform:"uppercase",marginBottom:6}}>
        Step 01
      </div>
      <h1 style={{
        fontFamily:F.display,fontStyle:"italic",fontWeight:300,
        color:C.cream,fontSize:"clamp(2rem,7vw,3rem)",
        letterSpacing:"0.1em",marginBottom:6,
      }}>Compose</h1>
      <p style={{fontFamily:F.body,fontWeight:300,color:`${C.cream}85`,fontSize:"0.85rem",marginBottom:36,letterSpacing:"0.04em",textAlign:"center"}}>
        Choose how to capture your landscape
      </p>

      {!camMode?(
        <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:360}}>
          {btns.map(({label,icon,sub,action})=>(
            <button key={label} onClick={action} style={{
              background:`${C.cream}12`,
              border:`1px solid ${C.cream}35`,
              borderRadius:10,color:C.cream,
              padding:"16px 20px",
              cursor:"pointer",display:"flex",alignItems:"center",gap:16,
              transition:"all 0.18s",textAlign:"left",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${C.cream}22`;e.currentTarget.style.borderColor=`${C.cream}70`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${C.cream}12`;e.currentTarget.style.borderColor=`${C.cream}35`;}}
            >
              <span style={{fontSize:"1.6rem",color:C.amber,minWidth:32,textAlign:"center"}}>{icon}</span>
              <div>
                <div style={{fontFamily:F.body,fontWeight:400,fontSize:"0.95rem",letterSpacing:"0.05em"}}>{label}</div>
                <div style={{fontFamily:F.mono,fontSize:"0.65rem",color:C.mutedTeal,letterSpacing:"0.08em",marginTop:2}}>{sub}</div>
              </div>
            </button>
          ))}
          <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleUpload}/>
        </div>
      ):(
        <div style={{width:"100%",maxWidth:480,display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
          <video ref={videoRef} autoPlay playsInline muted style={{
            width:"100%",borderRadius:10,
            border:`1px solid ${C.teal}50`,
            aspectRatio:camMode==="panorama"?"3/1":"4/3",objectFit:"cover",
          }}/>
          {camMode==="panorama"&&(
            <div style={{fontFamily:F.mono,color:C.amber,fontSize:"0.72rem",letterSpacing:"0.1em"}}>
              Frame {panoFrames.length+1} of 3 — pan right between shots
            </div>
          )}
          <div style={{display:"flex",gap:12}}>
            <button onClick={camMode==="panorama"?capturePano:capture} style={{
              background:C.amber,color:C.dark,border:"none",borderRadius:"50%",
              width:64,height:64,fontSize:"1.5rem",cursor:"pointer",fontWeight:"bold",
            }}>◉</button>
            <button onClick={stopCam} style={{
              background:"rgba(163,82,40,0.15)",color:C.terra,
              border:`1px solid ${C.terra}50`,borderRadius:"50%",
              width:64,height:64,fontSize:"1.2rem",cursor:"pointer",
            }}>✕</button>
          </div>
        </div>
      )}

      {/* Bottom brand mark */}
      <div style={{position:"absolute",bottom:20,fontFamily:F.mono,fontSize:"0.6rem",color:`${C.cream}60`,letterSpacing:"0.2em",textTransform:"uppercase"}}>
        Selva Tierra
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SCREEN 3 — GENRE
══════════════════════════════════════════════════════════════════════════════ */
function GenreScreen({onSelect,onBack}){
  const [sel,setSel]=useState(null);
  return(
    <div style={{
      minHeight:"100dvh",
      background:`linear-gradient(160deg,${C.bg} 0%,${C.bgMid} 60%,${C.bgCard} 100%)`,
      display:"flex",flexDirection:"column",
      alignItems:"center",padding:"1.5rem",
    }}>
      <FontLoader/>
      <button onClick={onBack} style={{alignSelf:"flex-start",background:"none",border:"none",color:C.cream,cursor:"pointer",fontFamily:F.mono,fontSize:"0.72rem",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:20}}>
        ← Back
      </button>
      <div style={{fontFamily:F.mono,color:C.amber,letterSpacing:"0.28em",fontSize:"0.65rem",textTransform:"uppercase",marginBottom:6}}>Step 02</div>
      <h1 style={{fontFamily:F.display,fontStyle:"italic",fontWeight:300,color:C.cream,fontSize:"clamp(2rem,7vw,3rem)",letterSpacing:"0.1em",marginBottom:6}}>
        Genre
      </h1>
      <p style={{fontFamily:F.body,fontWeight:300,color:`${C.cream}85`,fontSize:"0.85rem",marginBottom:24,letterSpacing:"0.04em",textAlign:"center"}}>
        Choose how your landscape sounds
      </p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:9,width:"100%",maxWidth:480,marginBottom:28}}>
        {GENRES.map(g=>(
          <button key={g.id} onClick={()=>setSel(g.id)} style={{
            background:sel===g.id?`${C.amber}35`:`${C.cream}08`,
            border:`1px solid ${sel===g.id?C.amber:`${C.cream}20`}`,
            borderRadius:8,
            color:sel===g.id?C.cream:C.grayGreen,
            padding:"12px 10px",cursor:"pointer",textAlign:"left",
            transition:"all 0.15s",
          }}>
            <div style={{fontFamily:F.body,fontWeight:400,fontSize:"0.85rem",letterSpacing:"0.04em",marginBottom:2,color:sel===g.id?C.amber:C.cream}}>
              {g.name}
            </div>
            <div style={{fontFamily:F.mono,fontSize:"0.62rem",color:`${C.cream}70`,letterSpacing:"0.06em"}}>{g.desc}</div>
          </button>
        ))}
      </div>
      <button onClick={()=>sel&&onSelect(GENRES.find(g=>g.id===sel))} disabled={!sel} style={{
        background:sel?C.amber:"transparent",
        color:sel?C.dark:C.mutedTeal,
        border:`1px solid ${sel?C.amber:C.cream+'40'}`,
        borderRadius:8,padding:"14px 44px",
        fontFamily:F.body,fontSize:"0.9rem",letterSpacing:"0.12em",
        textTransform:"uppercase",cursor:sel?"pointer":"not-allowed",
        transition:"all 0.2s",
      }}>Play Landscape →</button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   SCREEN 4 — SOUNDSCAPE
══════════════════════════════════════════════════════════════════════════════ */
function SoundscapeScreen({imageCanvas,genre,onBack,onReset}){
  const bgCanvasRef=useRef();
  const [cropY,setCropY]=useState(0.35);
  const [notes,setNotes]=useState([]);
  const [playing,setPlaying]=useState(false);
  const [progress,setProgress]=useState(0);
  const [animalId,setAnimalId]=useState("frog");
  const [animalPhase,setAnimalPhase]=useState(0);
  const [noteFlash,setNoteFlash]=useState(0);
  const stopRef=useRef(null);
  const animRef=useRef(null);
  const phaseRef=useRef(0);

  // Draw background photo (diffused)
  useEffect(()=>{
    const canvas=bgCanvasRef.current;
    if(!canvas||!imageCanvas)return;
    const ctx=canvas.getContext("2d");
    const w=canvas.width,h=canvas.height;
    ctx.clearRect(0,0,w,h);
    // Draw photo
    const scale=Math.min(w/imageCanvas.width,h/imageCanvas.height);
    const iw=imageCanvas.width*scale,ih=imageCanvas.height*scale;
    const ox=(w-iw)/2,oy=(h-ih)/2;
    ctx.drawImage(imageCanvas,ox,oy,iw,ih);
    // Diffuse overlay — dark tint + slight blur effect via gradient
    ctx.fillStyle=`${C.bgCard}90`;
    ctx.fillRect(0,0,w,h);
    // Vignette
    const vg=ctx.createRadialGradient(w/2,h/2,h*0.2,w/2,h/2,h*0.75);
    vg.addColorStop(0,"transparent");
    vg.addColorStop(1,`${C.bgCard}dd`);
    ctx.fillStyle=vg;
    ctx.fillRect(0,0,w,h);
    // Extract & draw melody line
    const elevs=extractSkyline(imageCanvas,cropY,48);
    const n=elevationToNotes(elevs,genre);
    setNotes(n);
    const nMin=Math.min(...n),nMax=Math.max(...n),nRange=nMax-nMin||1;
    // Melody glow
    ctx.shadowColor=C.amber;ctx.shadowBlur=12;
    ctx.strokeStyle=C.amber;ctx.lineWidth=2.5;
    ctx.beginPath();
    elevs.forEach((e,i)=>{
      const x=(i/(elevs.length-1))*w;
      const y=h-30-((n[i]-nMin)/nRange)*(h*0.55);
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    });
    ctx.stroke();
    ctx.shadowBlur=0;
    // Note dots
    elevs.forEach((_,i)=>{
      if(i%6!==0)return;
      const x=(i/(elevs.length-1))*w;
      const y=h-30-((n[i]-nMin)/nRange)*(h*0.55);
      ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);
      ctx.fillStyle=C.amber;ctx.shadowColor=C.amber;ctx.shadowBlur=8;
      ctx.fill();ctx.shadowBlur=0;
    });
    // Scan line
    const cy=cropY*h;
    ctx.strokeStyle=`${C.teal}70`;ctx.setLineDash([5,4]);ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,cy);ctx.lineTo(w,cy);ctx.stroke();
    ctx.setLineDash([]);
    // Progress line
    if(progress>0){
      const px=progress*w;
      ctx.strokeStyle=`${C.terra}cc`;ctx.lineWidth=2;ctx.setLineDash([]);
      ctx.beginPath();ctx.moveTo(px,0);ctx.lineTo(px,h);ctx.stroke();
    }
  },[imageCanvas,genre,cropY,progress]);

  // Animal animation loop
  useEffect(()=>{
    if(playing){
      const loop=()=>{
        phaseRef.current=(phaseRef.current+0.025)%1;
        setAnimalPhase(phaseRef.current);
        animRef.current=requestAnimationFrame(loop);
      };
      animRef.current=requestAnimationFrame(loop);
    } else {
      if(animRef.current)cancelAnimationFrame(animRef.current);
      setAnimalPhase(0);
    }
    return()=>{if(animRef.current)cancelAnimationFrame(animRef.current);};
  },[playing]);

  const handlePlay=()=>{
    if(playing){if(stopRef.current)stopRef.current();setPlaying(false);setProgress(0);return;}
    setPlaying(true);setProgress(0);
    stopRef.current=playNotes(notes,genre,p=>setProgress(p),()=>{setPlaying(false);setProgress(0);});
  };

  const AnimalComponent={frog:FrogSVG,jaguar:JaguarSVG,toucan:ToucanSVG,tapir:TapirSVG,snake:SnakeSVG}[animalId];

  return(
    <div style={{
      minHeight:"100dvh",
      background:`linear-gradient(160deg,${C.bg} 0%,${C.bgMid} 60%,${C.bgCard} 100%)`,
      display:"flex",flexDirection:"column",
      alignItems:"center",padding:"1.2rem 1rem",
    }}>
      <FontLoader/>
      {/* Nav */}
      <div style={{display:"flex",justifyContent:"space-between",width:"100%",maxWidth:540,marginBottom:10}}>
        <button onClick={onBack} style={{background:"none",border:"none",color:C.cream,cursor:"pointer",fontFamily:F.mono,fontSize:"0.68rem",letterSpacing:"0.18em",textTransform:"uppercase"}}>← Genre</button>
        <div style={{fontFamily:F.display,fontStyle:"italic",color:C.amber,fontSize:"0.9rem",letterSpacing:"0.1em"}}>{genre.name}</div>
        <button onClick={onReset} style={{background:"none",border:"none",color:C.mutedTeal,cursor:"pointer",fontFamily:F.mono,fontSize:"0.68rem",letterSpacing:"0.18em",textTransform:"uppercase"}}>New ↺</button>
      </div>

      {/* Main stage */}
      <div style={{position:"relative",width:"min(100%,540px)",borderRadius:14,overflow:"hidden",border:`1px solid ${C.teal}30`}}>
        {/* Photo background canvas */}
        <canvas ref={bgCanvasRef} width={540} height={300}
          style={{width:"100%",height:"auto",display:"block"}}/>

        {/* Jungle border overlay */}
        <JungleBorder/>

        {/* Animal layer */}
        {animalId!=="off"&&AnimalComponent&&(
          <div style={{
            position:"absolute",
            bottom: animalId==="snake"?"30%":"8%",
            left:"50%",
            transform:"translateX(-50%)",
            pointerEvents:"none",
          }}>
            <svg width={animalId==="snake"?200:100} height={animalId==="tapir"?100:110}
              viewBox={animalId==="snake"?"-50,-30,200,60":animalId==="tapir"?"-40,-30,80,80":"-45,-45,90,90"}>
              <AnimalComponent phase={animalPhase}/>
            </svg>
          </div>
        )}

        {/* Title overlay */}
        <div style={{
          position:"absolute",top:14,left:0,right:0,
          textAlign:"center",pointerEvents:"none",
        }}>
          <div style={{
            fontFamily:F.display,fontStyle:"italic",fontWeight:300,
            fontSize:"clamp(1.4rem,4vw,1.9rem)",
            color:C.cream,letterSpacing:"0.12em",
            textShadow:`0 2px 12px ${C.dark}`,
          }}>Soundscape</div>
        </div>
      </div>

      {/* Scan line slider */}
      <div style={{width:"min(100%,540px)",marginTop:14}}>
        <div style={{fontFamily:F.mono,color:`${C.cream}60`,fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>
          Scan Line — {Math.round(cropY*100)}%
        </div>
        <input type="range" min={5} max={90} value={Math.round(cropY*100)}
          onChange={e=>setCropY(e.target.value/100)}
          style={{width:"100%",accentColor:C.amber}}/>
      </div>

      {/* Animal selector */}
      <div style={{width:"min(100%,540px)",marginTop:14}}>
        <div style={{fontFamily:F.mono,color:`${C.cream}60`,fontSize:"0.62rem",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:8}}>
          Dancing Animal
        </div>
        <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
          {ANIMALS.map(a=>(
            <button key={a.id} onClick={()=>setAnimalId(a.id)} style={{
              background:animalId===a.id?`${C.terra}40`:`${C.teal}10`,
              border:`1px solid ${animalId===a.id?C.terra:`${C.teal}30`}`,
              borderRadius:8,padding:"7px 10px",cursor:"pointer",
              display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              transition:"all 0.15s",
            }}>
              <span style={{fontSize:"1.2rem"}}>{a.emoji}</span>
              <span style={{fontFamily:F.mono,fontSize:"0.55rem",color:animalId===a.id?C.amber:C.cream,letterSpacing:"0.08em",textTransform:"uppercase"}}>{a.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Play button + progress */}
      <div style={{marginTop:20,display:"flex",flexDirection:"column",alignItems:"center",gap:12,width:"min(100%,540px)"}}>
        <button onClick={handlePlay} style={{
          background:playing?`${C.terra}25`:C.amber,
          color:playing?C.terra:C.dark,
          border:playing?`1px solid ${C.terra}60`:"none",
          borderRadius:"50%",width:68,height:68,fontSize:"1.6rem",
          cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",
          transition:"all 0.2s",
          boxShadow:playing?"none":`0 0 28px ${C.amber}50`,
        }}>{playing?"■":"▶"}</button>

        {/* Progress bar */}
        <div style={{width:"100%",height:3,background:`${C.cream}20`,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${progress*100}%`,background:C.amber,transition:"width 0.05s linear"}}/>
        </div>

        {/* BPM info */}
        <div style={{fontFamily:F.mono,fontSize:"0.62rem",color:`${C.cream}65`,letterSpacing:"0.15em"}}>
          {genre.tempo} BPM · {notes.length} NOTES · {genre.desc.toUpperCase()}
        </div>
      </div>

      {/* Share row */}
      <div style={{marginTop:18,display:"flex",gap:10,alignItems:"center"}}>
        <div style={{fontFamily:F.mono,fontSize:"0.6rem",color:`${C.cream}55`,letterSpacing:"0.15em",textTransform:"uppercase"}}>Share</div>
        {["IG","TikTok","↓"].map(s=>(
          <button key={s} style={{
            background:`${C.teal}15`,border:`1px solid ${C.teal}35`,
            borderRadius:6,padding:"5px 10px",
            fontFamily:F.mono,fontSize:"0.65rem",color:C.cream,
            cursor:"pointer",letterSpacing:"0.1em",
          }}>{s}</button>
        ))}
      </div>

      {/* Footer brand */}
      <div style={{marginTop:20,fontFamily:F.mono,fontSize:"0.58rem",color:`${C.cream}45`,letterSpacing:"0.22em",textTransform:"uppercase"}}>
        Created by Selva Tierra
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   APP ROOT
══════════════════════════════════════════════════════════════════════════════ */
export default function App(){
  const [screen,setScreen]=useState("splash");
  const [imgCanvas,setImgCanvas]=useState(null);
  const [genre,setGenre]=useState(null);

  return(
    <div style={{maxWidth:600,margin:"0 auto"}}>
      {screen==="splash"&&<SplashScreen onDone={()=>setScreen("compose")}/>}
      {screen==="compose"&&<ComposeScreen onImage={c=>{setImgCanvas(c);setScreen("genre");}}/>}
      {screen==="genre"&&<GenreScreen onSelect={g=>{setGenre(g);setScreen("soundscape");}} onBack={()=>setScreen("compose")}/>}
      {screen==="soundscape"&&<SoundscapeScreen imageCanvas={imgCanvas} genre={genre} onBack={()=>setScreen("genre")} onReset={()=>{setImgCanvas(null);setGenre(null);setScreen("compose");}}/>}
    </div>
  );
}
