'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Float } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import Lottie from 'lottie-react';
import { ArrowDown, ArrowUpRight, Menu } from 'lucide-react';

const sparkleAnimation = {
  v: '5.7.4', fr: 30, ip: 0, op: 60, w: 80, h: 80, nm: 'Éclat doré', ddd: 0, assets: [],
  layers: [{
    ddd: 0, ind: 1, ty: 4, nm: 'Étoile', sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ i: { x: [.167], y: [1] }, o: { x: [.333], y: [0] }, t: 0, s: [0], e: [90] }, { t: 60, s: [90] }] },
      p: { a: 0, k: [40, 40, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] },
    }, ao: 0,
    shapes: [{ ty: 'gr', it: [
      { d: 1, ty: 'sr', s: { a: 0, k: 39 }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, pt: { a: 0, k: 4 }, or: { a: 0, k: 36 }, os: { a: 0, k: 0 }, ir: { a: 0, k: 12 }, is: { a: 0, k: 0 }, nm: 'Étoile à quatre branches', sy: 1 },
      { ty: 'fl', c: { a: 0, k: [.91, .78, .55, 1] }, o: { a: 0, k: 100 }, r: 1, bm: 0, nm: 'Or' },
      { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, nm: 'Transformation' },
    ], nm: 'Étoile', np: 3, cix: 2, bm: 0, ix: 1, hd: false }],
    ip: 0, op: 60, st: 0, bm: 0,
  }],
};

function FallbackBottle() {
  return <group position={[0, -.22, 0]}>
    <mesh castShadow><boxGeometry args={[1.18, 1.8, .62]} /><meshPhysicalMaterial color="#a20b19" metalness={.28} roughness={.18} clearcoat={1} /></mesh>
    <mesh position={[0, -.05, .326]}><boxGeometry args={[.88, .83, .018]} /><meshStandardMaterial color="#f5e9d5" /></mesh>
    <mesh position={[0, .99, 0]} castShadow><cylinderGeometry args={[.16, .17, .38, 32]} /><meshPhysicalMaterial color="#d6b477" metalness={.85} roughness={.2} /></mesh>
    <mesh position={[0, 1.25, 0]} castShadow><cylinderGeometry args={[.26, .25, .28, 32]} /><meshPhysicalMaterial color="#e5c88c" metalness={.76} roughness={.22} /></mesh>
  </group>;
}

function Bottle({ progress }: { progress: React.MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  useEffect(() => {
    let active = true;
    new GLTFLoader().load('/parfum.glb', (gltf) => {
      if (!active) return;
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const size = box.getSize(new THREE.Vector3());
      const scale = 3.2 / Math.max(size.x, size.y, size.z);
      const center = box.getCenter(new THREE.Vector3());
      gltf.scene.scale.setScalar(scale);
      gltf.scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      setModel(gltf.scene);
    }, undefined, () => { if (active) setModel(null); });
    return () => { active = false; };
  }, []);
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = progress.current * Math.PI * 2 + state.clock.elapsedTime * .035;
      group.current.rotation.x = Math.sin(progress.current * Math.PI) * -.08;
    }
  });
  return <group ref={group}>{model ? <primitive object={model} /> : <FallbackBottle />}</group>;
}

function ProductStage({ progress }: { progress: React.MutableRefObject<number> }) {
  return <Canvas camera={{ position: [0, .15, 5.8], fov: 36 }} dpr={[1, 1.7]} gl={{ alpha: true, antialias: true }} shadows>
    <ambientLight intensity={1.2} /><spotLight position={[4, 5, 5]} intensity={80} angle={.36} penumbra={1} castShadow />
    <pointLight position={[-4, 0, 2]} intensity={28} color="#ff7a68" /><Environment preset="studio" />
    <Float speed={1.2} rotationIntensity={.08} floatIntensity={.14}><Bottle progress={progress} /></Float>
    <ContactShadows position={[0, -2.03, 0]} opacity={.35} scale={5} blur={2.8} far={4} />
  </Canvas>;
}

function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = performance.now(); let frame = 0;
    const tick = () => { const next = Math.min(100, Math.round((performance.now() - start) / 15)); setCount(next); if (next < 100) frame = requestAnimationFrame(tick); else window.setTimeout(onDone, 380); };
    frame = requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [onDone]);
  return <motion.div className="preloader" initial={{ y: 0 }} exit={{ y: '-100%' }} transition={{ duration: .85, ease: [.76, 0, .24, 1] }}>
    <span className="preloader-mark">J<span>•</span></span>
    <div className="loader-bottom"><span>EAU DE PARFUM</span><span>{String(count).padStart(2, '0')}<small> / 100</small></span></div>
    <motion.div className="loader-line" style={{ scaleX: count / 100 }} />
  </motion.div>;
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const progress = useRef(0);
  const { scrollYProgress } = useScroll();
  const modelY = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);
  useEffect(() => scrollYProgress.on('change', (value) => { progress.current = value; }), [scrollYProgress]);

  return <main className="site-shell">
    <AnimatePresence>{loading && <Preloader onDone={() => setLoading(false)} />}</AnimatePresence>
    <div className="grain" aria-hidden="true" />
    <header className="topbar"><a className="wordmark" href="#top">JULIA<span> PARFUMS</span></a><span className="edition">PARIS · ÉDITION Nº 01</span><a className="menu-link" href="#newsletter">ÊTRE INFORMÉ <ArrowUpRight size={14} /></a><button className="mobile-menu" aria-label="Ouvrir le menu"><Menu size={20} /></button></header>
    <div className="product-fixed" aria-hidden="true"><motion.div className="product-canvas" style={{ y: modelY }}><ProductStage progress={progress} /></motion.div><span className="model-caption">01 — JULIA, EXTRAIT DE PARFUM</span></div>
    <section id="top" className="hero section-pad"><div className="hero-kicker"><span className="tiny-star">✳</span> UNE NOUVELLE SIGNATURE OLFACTIVE</div><div className="hero-title"><h1>JUL<span className="letter-i">I</span>A</h1><span className="hero-asterisk">✳</span></div><p className="hero-copy">Le rouge d’un instant.<br />La trace d’une vie.</p><div className="launch-date"><span className="date-line" /><div><small>RENDEZ-VOUS DANS</small><strong>02 <i>MOIS</i></strong></div></div><a className="scroll-cue" href="#story"><span>FAIRE DÉFILER</span><ArrowDown size={15} /></a><span className="hero-index">01 / 03</span></section>
    <section id="story" className="story section-pad"><div className="section-index">02 <span>—</span> L’INTENTION</div><div className="story-copy"><p className="eyebrow">UN PARFUM COMME UNE RENCONTRE</p><h2>Le souvenir<br />d’un <em>premier</em><br />regard.</h2><p className="story-detail">Un sillage de rose ardente, de poivre rose et de bois ambrés. Une présence douce, une empreinte inoubliable.</p><div className="notes"><span>ROSE DAMASCENA</span><span>POIVRE ROSE</span><span>BOIS AMBRÉS</span></div></div><span className="vertical-note">LA BEAUTÉ DU CONTRASTE</span></section>
    <section id="newsletter" className="closing section-pad"><span className="section-index">03 <span>—</span> BIENTÔT</span><div className="closing-center"><Lottie animationData={sparkleAnimation} loop className="lottie-sparkle" aria-label="Étoile animée" /><p>LE DÉCOMPTE A COMMENCÉ</p><h2>À très<br /><em>bientôt.</em></h2><a href="mailto:bonjour@juliaparfums.fr?subject=Me%20pr%C3%A9venir%20du%20lancement" className="notify-link">ME PRÉVENIR DU LANCEMENT <ArrowUpRight size={15} /></a></div><footer className="footer"><a className="wordmark" href="#top">JULIA<span> PARFUMS</span></a><span>COMPOSÉ À PARIS, AVEC AMOUR.</span><span>© JULIA 2026</span></footer></section>
  </main>;
}
