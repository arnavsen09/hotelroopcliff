import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeCanvasProps {
  className?: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 1. Golden Floating Ambient Particles (Gold Dust / Starfield)
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 40;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 26;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 18;
      particleSpeeds[i] = 0.005 + Math.random() * 0.015;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Circular gold stardust particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 235, 170, 1)');
      gradient.addColorStop(0.35, 'rgba(212, 175, 55, 0.8)');
      gradient.addColorStop(0.7, 'rgba(180, 140, 50, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTex = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.75,
      map: particleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: new THREE.Color('#D4AF37'),
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 2. Luxury 3D Rings / Torus Armillary Sphere with Royal Crest Medallion
    const ringGroup = new THREE.Group();

    // Outer golden torus
    const torusGeo1 = new THREE.TorusGeometry(6.6, 0.045, 16, 120);
    const goldMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.32,
    });
    const ring1 = new THREE.Mesh(torusGeo1, goldMaterial);
    ringGroup.add(ring1);

    // Secondary tilted inner torus
    const torusGeo2 = new THREE.TorusGeometry(4.9, 0.035, 16, 100);
    const ring2 = new THREE.Mesh(torusGeo2, goldMaterial);
    ring2.rotation.x = Math.PI / 3;
    ringGroup.add(ring2);

    // Tertiary delicate ring
    const torusGeo3 = new THREE.TorusGeometry(3.4, 0.025, 16, 80);
    const ring3 = new THREE.Mesh(torusGeo3, goldMaterial);
    ring3.rotation.y = Math.PI / 4;
    ringGroup.add(ring3);

    // 3. Central 3D Royal Gold Medallion with Crown & RC Monogram
    const medallionCanvas = document.createElement('canvas');
    medallionCanvas.width = 512;
    medallionCanvas.height = 512;
    const mCtx = medallionCanvas.getContext('2d');
    if (mCtx) {
      // Golden gradient background disk
      const bgGrad = mCtx.createRadialGradient(256, 256, 40, 256, 256, 250);
      bgGrad.addColorStop(0, '#FFE8A3');
      bgGrad.addColorStop(0.5, '#D4AF37');
      bgGrad.addColorStop(0.85, '#8C6718');
      bgGrad.addColorStop(1, '#5E440E');
      mCtx.fillStyle = bgGrad;
      mCtx.beginPath();
      mCtx.arc(256, 256, 240, 0, Math.PI * 2);
      mCtx.fill();

      // Ornate inner ring
      mCtx.strokeStyle = '#FFEAA7';
      mCtx.lineWidth = 8;
      mCtx.beginPath();
      mCtx.arc(256, 256, 220, 0, Math.PI * 2);
      mCtx.stroke();

      mCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      mCtx.lineWidth = 3;
      mCtx.beginPath();
      mCtx.arc(256, 256, 206, 0, Math.PI * 2);
      mCtx.stroke();

      // Crown drawing
      mCtx.fillStyle = '#FFFFFF';
      mCtx.shadowColor = '#000000';
      mCtx.shadowBlur = 10;
      mCtx.beginPath();
      mCtx.moveTo(170, 180);
      mCtx.lineTo(195, 230);
      mCtx.lineTo(256, 190);
      mCtx.lineTo(317, 230);
      mCtx.lineTo(342, 180);
      mCtx.lineTo(326, 245);
      mCtx.lineTo(186, 245);
      mCtx.closePath();
      mCtx.fill();

      // Crown jewels
      mCtx.beginPath();
      mCtx.arc(170, 175, 10, 0, Math.PI * 2);
      mCtx.arc(256, 160, 12, 0, Math.PI * 2);
      mCtx.arc(342, 175, 10, 0, Math.PI * 2);
      mCtx.fill();

      // RC Monogram text
      mCtx.fillStyle = '#FFFFFF';
      mCtx.font = "bold 130px 'Cinzel', 'Playfair Display', serif";
      mCtx.textAlign = 'center';
      mCtx.textBaseline = 'middle';
      mCtx.fillText('RC', 256, 330);

      // Star & dots
      mCtx.font = "bold 20px 'Manrope', sans-serif";
      mCtx.letterSpacing = '8px';
      mCtx.fillText('ROOP CLIFF', 256, 420);
    }

    const medallionTexture = new THREE.CanvasTexture(medallionCanvas);
    medallionTexture.colorSpace = THREE.SRGBColorSpace;

    const medallionGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.08, 64);
    const medallionMat = new THREE.MeshStandardMaterial({
      map: medallionTexture,
      roughness: 0.35,
      metalness: 0.85,
    });
    const medallionMesh = new THREE.Mesh(medallionGeo, medallionMat);
    medallionMesh.rotation.x = Math.PI / 2;
    ringGroup.add(medallionMesh);

    // Warm directional light specifically for the 3D medallion
    const medallionLight = new THREE.PointLight(0xffeedd, 2.2, 30);
    medallionLight.position.set(6, 4, 10);
    scene.add(medallionLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Position the whole ring assembly to the right of the hero
    ringGroup.position.set(7.5, -0.5, -3.5);
    scene.add(ringGroup);

    // Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (event.clientX / innerWidth - 0.5) * 3;
      targetMouseY = (event.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Window Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      camera.position.x = currentMouseX;
      camera.position.y = -currentMouseY;
      camera.lookAt(0, 0, 0);

      // Rotate 3D rings and royal medallion
      ringGroup.rotation.y = elapsedTime * 0.16;
      ringGroup.rotation.x = Math.sin(elapsedTime * 0.08) * 0.22;
      ring2.rotation.z = elapsedTime * 0.12;
      ring3.rotation.x = elapsedTime * 0.18;

      // Drift floating golden particles
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 13) {
          positions[i * 3 + 1] = -13;
          positions[i * 3] = (Math.random() - 0.5) * 40;
        }
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTex.dispose();
      torusGeo1.dispose();
      torusGeo2.dispose();
      torusGeo3.dispose();
      goldMaterial.dispose();
      medallionGeo.dispose();
      medallionMat.dispose();
      medallionTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
};
