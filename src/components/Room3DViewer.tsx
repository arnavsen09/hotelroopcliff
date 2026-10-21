import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Room } from '../types';
import { formatCurrency } from '../context/BookingContext';

interface Room3DViewerProps {
  rooms: Room[];
  selectedRoomName?: string;
  onSelectRoom?: (roomName: string) => void;
  onBookRoom?: (roomName: string) => void;
  className?: string;
}

export const Room3DViewer: React.FC<Room3DViewerProps> = ({
  rooms,
  selectedRoomName,
  onSelectRoom,
  onBookRoom,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeRoomIndex, setActiveRoomIndex] = useState(0);
  const [lightingMode, setLightingMode] = useState<'day' | 'night'>('day');
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  // Sync with prop if selectedRoomName changes
  useEffect(() => {
    if (selectedRoomName) {
      const idx = rooms.findIndex((r) => r.name.toLowerCase() === selectedRoomName.toLowerCase());
      if (idx !== -1) setActiveRoomIndex(idx);
    }
  }, [selectedRoomName, rooms]);

  const currentRoom = rooms[activeRoomIndex] || rooms[0];

  // Refs for three.js state updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);
  const bedGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(lightingMode === 'day' ? 0x0f1c17 : 0x070e0b);
    scene.fog = new THREE.FogExp2(lightingMode === 'day' ? 0x0f1c17 : 0x070e0b, 0.025);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(7.5, 5.2, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = lightingMode === 'day' ? 1.25 : 0.95;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below floor
    controls.target.set(0, 1.2, 0);

    // ==========================================
    // PROCEDURAL TEXTURES (ZERO 404s)
    // ==========================================
    // 1. Luxury Parquet Wood Floor
    const woodCanvas = document.createElement('canvas');
    woodCanvas.width = 512;
    woodCanvas.height = 512;
    const woodCtx = woodCanvas.getContext('2d');
    if (woodCtx) {
      woodCtx.fillStyle = '#2A1D13';
      woodCtx.fillRect(0, 0, 512, 512);
      // Wood planks
      for (let y = 0; y < 512; y += 64) {
        woodCtx.strokeStyle = 'rgba(15, 10, 6, 0.6)';
        woodCtx.lineWidth = 2;
        woodCtx.strokeRect(0, y, 512, 64);
        for (let x = (y % 128 === 0 ? 0 : 64); x < 512; x += 128) {
          woodCtx.strokeRect(x, y, 128, 64);
          // wood grain streaks
          woodCtx.fillStyle = (x + y) % 3 === 0 ? '#332317' : '#261910';
          woodCtx.fillRect(x + 2, y + 2, 124, 60);
        }
      }
    }
    const woodTexture = new THREE.CanvasTexture(woodCanvas);
    woodTexture.wrapS = THREE.RepeatWrapping;
    woodTexture.wrapT = THREE.RepeatWrapping;
    woodTexture.repeat.set(4, 4);
    woodTexture.colorSpace = THREE.SRGBColorSpace;
    woodTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // 2. Silk Persian Accent Rug
    const rugCanvas = document.createElement('canvas');
    rugCanvas.width = 512;
    rugCanvas.height = 512;
    const rugCtx = rugCanvas.getContext('2d');
    if (rugCtx) {
      rugCtx.fillStyle = '#112920';
      rugCtx.fillRect(0, 0, 512, 512);
      // Gold ornate border
      rugCtx.strokeStyle = '#D4AF37';
      rugCtx.lineWidth = 14;
      rugCtx.strokeRect(20, 20, 472, 472);
      rugCtx.lineWidth = 4;
      rugCtx.strokeRect(40, 40, 432, 432);
      // Medallion
      rugCtx.fillStyle = '#AA8222';
      rugCtx.beginPath();
      rugCtx.arc(256, 256, 70, 0, Math.PI * 2);
      rugCtx.fill();
      rugCtx.strokeStyle = '#F2E3B5';
      rugCtx.lineWidth = 6;
      rugCtx.stroke();
    }
    const rugTexture = new THREE.CanvasTexture(rugCanvas);
    rugTexture.colorSpace = THREE.SRGBColorSpace;

    // ==========================================
    // 3D ARCHITECTURAL ROOM MODEL
    // ==========================================
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.MeshStandardMaterial({
      map: woodTexture,
      roughness: 0.35,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Persian Silk Rug
    const rugGeo = new THREE.PlaneGeometry(5.5, 4.2);
    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTexture,
      roughness: 0.85,
      metalness: 0.05,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.02, 0.4);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // Back Accent Wall (Emerald & Gold Trim)
    const backWallGeo = new THREE.BoxGeometry(12, 4.5, 0.2);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x142e25,
      roughness: 0.6,
      metalness: 0.1,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 2.25, -5);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Gold wall molding frieze
    const trimGeo = new THREE.BoxGeometry(12, 0.08, 0.04);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
    });
    const wallTrim1 = new THREE.Mesh(trimGeo, goldMat);
    wallTrim1.position.set(0, 3.8, -4.89);
    roomGroup.add(wallTrim1);

    const wallTrim2 = new THREE.Mesh(trimGeo, goldMat);
    wallTrim2.position.set(0, 1.1, -4.89);
    roomGroup.add(wallTrim2);

    // Left Wall with Archway & City Balcony Glass
    const leftWallGeo = new THREE.BoxGeometry(0.2, 4.5, 12);
    const leftWallMat = new THREE.MeshStandardMaterial({
      color: 0x18372d,
      roughness: 0.7,
    });
    const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
    leftWall.position.set(-5.9, 2.25, 0);
    roomGroup.add(leftWall);

    // Panoramic Window on Right Wall
    const windowFrameGeo = new THREE.BoxGeometry(0.2, 3.8, 6.5);
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.4,
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, windowFrameMat);
    windowFrame.position.set(5.9, 2.2, 0);
    roomGroup.add(windowFrame);

    // Window Glass with City Sunset Glow
    const glassGeo = new THREE.PlaneGeometry(6.2, 3.5);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x90caf9,
      transmission: 0.9,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.rotation.y = -Math.PI / 2;
    glass.position.set(5.8, 2.2, 0);
    roomGroup.add(glass);

    // Distant City Backdrop behind window
    const cityCanvas = document.createElement('canvas');
    cityCanvas.width = 512;
    cityCanvas.height = 256;
    const cityCtx = cityCanvas.getContext('2d');
    if (cityCtx) {
      const skyGrad = cityCtx.createLinearGradient(0, 0, 0, 256);
      skyGrad.addColorStop(0, '#102A43');
      skyGrad.addColorStop(0.6, '#486581');
      skyGrad.addColorStop(1, '#D97706');
      cityCtx.fillStyle = skyGrad;
      cityCtx.fillRect(0, 0, 512, 256);
      // City skyline silhouettes & lights
      cityCtx.fillStyle = '#0B1D2E';
      for (let i = 0; i < 512; i += 28) {
        const h = 50 + Math.sin(i * 0.05) * 40 + (i % 3) * 20;
        cityCtx.fillRect(i, 256 - h, 24, h);
        // glowing windows
        cityCtx.fillStyle = '#FDE68A';
        for (let wy = 256 - h + 10; wy < 250; wy += 14) {
          if ((i + wy) % 5 !== 0) cityCtx.fillRect(i + 4, wy, 4, 6);
        }
        cityCtx.fillStyle = '#0B1D2E';
      }
    }
    const cityTex = new THREE.CanvasTexture(cityCanvas);
    const cityBackdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 7),
      new THREE.MeshBasicMaterial({ map: cityTex })
    );
    cityBackdrop.rotation.y = -Math.PI / 2;
    cityBackdrop.position.set(9.5, 3.2, 0);
    scene.add(cityBackdrop);

    // ==========================================
    // COMPOSITE LUXURY FURNITURE
    // ==========================================
    const bedGroup = new THREE.Group();
    bedGroupRef.current = bedGroup;
    roomGroup.add(bedGroup);

    // 1. Bed Base Frame (Dark Walnut)
    const bedFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.45, 3.4),
      new THREE.MeshStandardMaterial({ color: 0x1e1510, roughness: 0.4 })
    );
    bedFrame.position.set(0, 0.225, -2.5);
    bedFrame.castShadow = true;
    bedFrame.receiveShadow = true;
    bedGroup.add(bedFrame);

    // 2. Deep Royal Tufted Headboard with Gilded Frame
    const headboardFrame = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.4, 0.25),
      goldMat
    );
    headboardFrame.position.set(0, 1.45, -4.2);
    headboardFrame.castShadow = true;
    bedGroup.add(headboardFrame);

    const headboardCushion = new THREE.Mesh(
      new THREE.BoxGeometry(3.35, 2.15, 0.2),
      new THREE.MeshStandardMaterial({
        color: 0x1b3c31,
        roughness: 0.8,
        metalness: 0.1,
      })
    );
    headboardCushion.position.set(0, 1.45, -4.08);
    bedGroup.add(headboardCushion);

    // 3. Mattress (Crisp White Egyptian Linen)
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 0.45, 3.1),
      new THREE.MeshStandardMaterial({ color: 0xfaf8f5, roughness: 0.9 })
    );
    mattress.position.set(0, 0.65, -2.55);
    mattress.castShadow = true;
    bedGroup.add(mattress);

    // 4. Emerald Silk Duvet & Gold Throw Blanket
    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(2.92, 0.18, 2.1),
      new THREE.MeshStandardMaterial({ color: 0x142e25, roughness: 0.6 })
    );
    duvet.position.set(0, 0.8, -1.9);
    duvet.castShadow = true;
    bedGroup.add(duvet);

    const goldThrow = new THREE.Mesh(
      new THREE.BoxGeometry(2.94, 0.08, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.4, metalness: 0.4 })
    );
    goldThrow.position.set(0, 0.86, -1.2);
    bedGroup.add(goldThrow);

    // 5. Plush Pillows (4x)
    const pillowGeo = new THREE.BoxGeometry(0.9, 0.25, 0.6);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.95 });
    const p1 = new THREE.Mesh(pillowGeo, pillowMat);
    p1.position.set(-0.75, 0.95, -3.5);
    p1.rotation.x = 0.25;
    bedGroup.add(p1);

    const p2 = new THREE.Mesh(pillowGeo, pillowMat);
    p2.position.set(0.75, 0.95, -3.5);
    p2.rotation.x = 0.25;
    bedGroup.add(p2);

    const pillowAccentMat = new THREE.MeshStandardMaterial({ color: 0xaa8222, roughness: 0.7 });
    const p3 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.4), pillowAccentMat);
    p3.position.set(-0.65, 0.98, -3.15);
    p3.rotation.x = 0.35;
    bedGroup.add(p3);

    const p4 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.2, 0.4), pillowAccentMat);
    p4.position.set(0.65, 0.98, -3.15);
    p4.rotation.x = 0.35;
    bedGroup.add(p4);

    // 6. Bedside Nightstands (Pair)
    const standGeo = new THREE.BoxGeometry(0.8, 0.75, 0.7);
    const standMat = new THREE.MeshStandardMaterial({ color: 0x18100c, roughness: 0.4 });

    const standL = new THREE.Mesh(standGeo, standMat);
    standL.position.set(-2.2, 0.375, -3.7);
    standL.castShadow = true;
    roomGroup.add(standL);

    const standR = new THREE.Mesh(standGeo, standMat);
    standR.position.set(2.2, 0.375, -3.7);
    standR.castShadow = true;
    roomGroup.add(standR);

    // 7. Glowing Warm Bedside Lamps with Gold Bases
    const createLamp = (x: number, z: number) => {
      const lamp = new THREE.Group();
      lamp.position.set(x, 0.75, z);

      // Gold base
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.4, 24), goldMat);
      base.position.y = 0.2;
      lamp.add(base);

      // Shade
      const shade = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.3, 0.35, 24),
        new THREE.MeshStandardMaterial({
          color: 0xffeedd,
          emissive: 0xffbb66,
          emissiveIntensity: lightingMode === 'night' ? 0.7 : 0.3,
          roughness: 0.9,
        })
      );
      shade.position.y = 0.52;
      lamp.add(shade);

      // PointLight
      const pLight = new THREE.PointLight(0xffaa44, lightingMode === 'night' ? 1.6 : 0.8, 4.5);
      pLight.position.y = 0.5;
      lamp.add(pLight);

      return lamp;
    };

    roomGroup.add(createLamp(-2.2, -3.7));
    roomGroup.add(createLamp(2.2, -3.7));

    // 8. Luxury Lounge Armchair & Side Table
    const chairGroup = new THREE.Group();
    chairGroup.position.set(3.2, 0, 0.8);
    chairGroup.rotation.y = -Math.PI / 4;

    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.35, 1.1),
      new THREE.MeshStandardMaterial({ color: 0x1b3c31, roughness: 0.7 })
    );
    seat.position.y = 0.38;
    chairGroup.add(seat);

    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.9, 0.25),
      new THREE.MeshStandardMaterial({ color: 0x1b3c31, roughness: 0.7 })
    );
    backrest.position.set(0, 0.85, -0.45);
    chairGroup.add(backrest);

    // Gold tapered legs
    const legGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.38);
    const leg1 = new THREE.Mesh(legGeo, goldMat);
    leg1.position.set(0.5, 0.19, 0.45);
    chairGroup.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, goldMat);
    leg2.position.set(-0.5, 0.19, 0.45);
    chairGroup.add(leg2);
    const leg3 = new THREE.Mesh(legGeo, goldMat);
    leg3.position.set(0.5, 0.19, -0.45);
    chairGroup.add(leg3);
    const leg4 = new THREE.Mesh(legGeo, goldMat);
    leg4.position.set(-0.5, 0.19, -0.45);
    chairGroup.add(leg4);

    roomGroup.add(chairGroup);

    // Marble drinks table
    const tableBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.2, 0.65, 20),
      goldMat
    );
    tableBase.position.set(2.1, 0.325, 1.8);
    roomGroup.add(tableBase);

    const marbleTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.45, 0.45, 0.05, 32),
      new THREE.MeshStandardMaterial({ color: 0xeeeeee, roughness: 0.2, metalness: 0.1 })
    );
    marbleTop.position.set(2.1, 0.65, 1.8);
    roomGroup.add(marbleTop);

    // ==========================================
    // LIGHTING RIG
    // ==========================================
    const lightsGroup = new THREE.Group();
    lightsGroupRef.current = lightsGroup;
    scene.add(lightsGroup);

    // Ambient light
    const hemiLight = new THREE.HemisphereLight(
      lightingMode === 'day' ? 0xfff3e0 : 0x1d3f33,
      0x0a1612,
      lightingMode === 'day' ? 0.75 : 0.45
    );
    lightsGroup.add(hemiLight);

    // Window sunlight (Key light)
    const sunLight = new THREE.DirectionalLight(
      lightingMode === 'day' ? 0xfffaed : 0xffaa44,
      lightingMode === 'day' ? 1.6 : 0.6
    );
    sunLight.position.set(8, 6, 2);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 20;
    sunLight.shadow.bias = -0.001;
    lightsGroup.add(sunLight);

    // Soft ceiling fill light
    const ceilingFill = new THREE.PointLight(0xffeacc, 0.6, 12);
    ceilingFill.position.set(0, 4, 0);
    lightsGroup.add(ceilingFill);

    // Gold floating dust particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 1] = Math.random() * 3.5 + 0.5;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const dustParticles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        size: 0.08,
        color: 0xd4af37,
        transparent: true,
        opacity: 0.65,
      })
    );
    scene.add(dustParticles);

    // ==========================================
    // ANIMATION & RENDER LOOP
    // ==========================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (isAutoRotate && controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.65;
      } else if (controls) {
        controls.autoRotate = false;
      }

      controls.update();

      // Gentle floating dust animation
      const pos = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(elapsedTime + i) * 0.002;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
      woodTexture.dispose();
      rugTexture.dispose();
      cityTex.dispose();
    };
  }, [lightingMode, isAutoRotate]);

  // Hotspots info
  const HOTSPOTS = [
    {
      id: 'bed',
      label: 'King Posturepedic Bed',
      desc: '300-thread-count Egyptian cotton linens, dual goose-feather pillows and custom upholstered headboard.',
      x: '50%',
      y: '58%',
    },
    {
      id: 'bath',
      label: 'Italian Marble Bath',
      desc: 'Rainforest walk-in shower, backlit vanity mirrors and organic botanical toiletries.',
      x: '24%',
      y: '45%',
    },
    {
      id: 'view',
      label: 'Bhopal City View',
      desc: 'Double-glazed soundproof acoustic glass overlooking MP Nagar skyline and evening sunsets.',
      x: '78%',
      y: '42%',
    },
    {
      id: 'climate',
      label: 'Smart Climate & Butler',
      desc: 'Whisper-quiet Daikin VRV air conditioning, high-speed Wi-Fi 6, and 24/7 in-room dining.',
      x: '64%',
      y: '68%',
    },
  ];

  return (
    <div className={`relative w-full overflow-hidden rounded-2xl border border-[rgba(212,175,55,0.35)] shadow-2xl bg-[#091510] ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[520px] md:h-[620px] cursor-grab active:cursor-grabbing"
      />

      {/* Top Header Bar HUD (Glassmorphic) */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3 pointer-events-none z-10">
        {/* Room Spec Badge */}
        <div className="pointer-events-auto inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[rgba(13,30,24,0.75)] backdrop-blur-xl border border-[rgba(212,175,55,0.3)] shadow-lg text-white">
          <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
          <div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-[#D4AF37] font-semibold">
              3D VIRTUAL SUITE EXPLORER
            </div>
            <div className="text-sm md:text-base font-bold font-serif">
              {currentRoom.name}
            </div>
          </div>
          <div className="hidden sm:block border-l border-[rgba(212,175,55,0.3)] pl-3 text-xs text-white/70">
            <span>{currentRoom.area}</span> · <span>{currentRoom.bed}</span>
          </div>
        </div>

        {/* Action Pills */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Day / Night Toggle */}
          <button
            type="button"
            onClick={() => setLightingMode(lightingMode === 'day' ? 'night' : 'day')}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-[rgba(13,30,24,0.75)] backdrop-blur-xl border border-[rgba(212,175,55,0.3)] text-white hover:text-[#D4AF37] transition-all shadow-md flex items-center gap-1.5"
            title="Toggle lighting mood"
          >
            <span>{lightingMode === 'day' ? '☀️ Golden Hour' : '🌙 Midnight'}</span>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            type="button"
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`px-3 py-2 text-xs font-medium rounded-lg backdrop-blur-xl border border-[rgba(212,175,55,0.3)] transition-all shadow-md ${
              isAutoRotate ? 'bg-[#D4AF37] text-[#0D1E18] font-semibold' : 'bg-[rgba(13,30,24,0.75)] text-white'
            }`}
          >
            {isAutoRotate ? '360° Orbiting' : 'Paused'}
          </button>

          {/* Collapse Controls Toggle */}
          <button
            type="button"
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-3 py-2 text-xs font-medium rounded-lg bg-[rgba(13,30,24,0.75)] backdrop-blur-xl border border-[rgba(212,175,55,0.3)] text-white/80 hover:text-white transition-all shadow-md"
            aria-label="Toggle controls dock"
          >
            {isControlsCollapsed ? 'Show Suite Controls' : 'Zen View'}
          </button>
        </div>
      </div>

      {/* Interactive 3D Hotspot Markers on Canvas */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {HOTSPOTS.map((hotspot) => (
          <div
            key={hotspot.id}
            className="pointer-events-auto absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: hotspot.x, top: hotspot.y }}
          >
            <button
              type="button"
              onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
              className="group relative flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(13,30,24,0.85)] border border-[#D4AF37] text-[#D4AF37] shadow-xl hover:scale-110 transition-transform"
              aria-label={`Inspect ${hotspot.label}`}
            >
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="absolute inset-0 rounded-full border border-[#D4AF37] animate-ping opacity-40" />
            </button>

            {/* Hotspot Popover Detail */}
            {activeHotspot === hotspot.id && (
              <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-64 p-3.5 rounded-xl bg-[rgba(13,30,24,0.95)] backdrop-blur-2xl border border-[rgba(212,175,55,0.4)] shadow-2xl text-white text-xs z-30 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-[#D4AF37]">{hotspot.label}</span>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-white/60 hover:text-white text-sm leading-none"
                  >
                    ×
                  </button>
                </div>
                <p className="text-white/80 leading-relaxed text-[11px]">{hotspot.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Orbit Gesture Hint (Centered Subtle Pill) */}
      <div className="pointer-events-none absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-white/60 tracking-wider uppercase border border-white/10 z-10">
        Drag to Orbit 360° · Scroll to Zoom
      </div>

      {/* Collapsible Bottom Luxury Glassmorphic Control Dock */}
      {!isControlsCollapsed && (
        <div className="absolute bottom-4 left-4 right-4 z-20 transition-all duration-300">
          <div className="max-w-4xl mx-auto p-3.5 md:p-4 rounded-2xl bg-[rgba(13,30,24,0.85)] backdrop-blur-2xl border border-[rgba(212,175,55,0.35)] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Suite Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              {rooms.map((room, idx) => (
                <button
                  key={room.id || room.name}
                  type="button"
                  onClick={() => {
                    setActiveRoomIndex(idx);
                    if (onSelectRoom) onSelectRoom(room.name);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    activeRoomIndex === idx
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#B89332] text-[#0D1E18] font-bold shadow-md'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>

            {/* Price & Book Direct Button */}
            <div className="flex items-center justify-between w-full md:w-auto gap-4 pt-2 md:pt-0 border-t md:border-t-0 border-white/10 shrink-0">
              <div className="text-left">
                <div className="text-[9px] uppercase tracking-wider text-white/60">
                  Best Direct Rate
                </div>
                <div className="text-base md:text-lg font-bold text-[#F2E3B5] font-serif">
                  {formatCurrency(currentRoom.rate)}
                  <small className="text-[10px] text-white/60 font-sans font-normal"> / night</small>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onBookRoom) onBookRoom(currentRoom.name);
                }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ECC870] via-[#D4AF37] to-[#AA8222] text-[#0D1E18] font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-1.5"
              >
                <span>Book This Suite</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
