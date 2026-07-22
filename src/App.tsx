import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Download, Sparkles, RotateCw, Trash2, Palette, Check, 
  Type, Sliders, Coffee, Shirt, ShoppingBag, 
  Info, RefreshCw, Target, Maximize2, 
  Compass, Heart, Flame, Shield, Trophy, Globe, Leaf, Eye, EyeOff
} from 'lucide-react';

// Static mockup image imports from assets
import tshirtMockup from './assets/images/mockup_tshirt_1784731758251.jpg';
import mugMockup from './assets/images/mockup_mug_1784731774655.jpg';
import totebagMockup from './assets/images/mockup_totebag_1784731787272.jpg';

// Preset SVGs to play with out of the box
const PRESET_LOGOS = [
  {
    id: 'sunset',
    name: 'Aesthetic Sunset',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#fef3c7" />
      <path d="M20 70C30 55 45 55 55 70" stroke="#f97316" stroke-width="4" stroke-linecap="round"/>
      <path d="M45 78C55 65 70 65 80 78" stroke="#ea580c" stroke-width="4" stroke-linecap="round"/>
      <circle cx="50" cy="40" r="14" fill="#f59e0b" />
      <path d="M25 88H75" stroke="#d97706" stroke-width="3" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'coffee',
    name: 'Retro Coffee Club',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="42" stroke="#1e293b" stroke-width="3" fill="#fafaf9"/>
      <circle cx="50" cy="50" r="36" stroke="#1e293b" stroke-dasharray="4 4" stroke-width="1" />
      <path d="M35 44H65V54C65 59 60 64 50 64C40 64 35 59 35 54V44Z" fill="#b45309" stroke="#1e293b" stroke-width="3" />
      <path d="M65 47H70C73 47 75 49 75 52C75 55 73 57 70 57H65" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
      <path d="M42 34Q45 29 43 24" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
      <path d="M50 34Q53 29 51 24" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
      <text x="50" y="80" text-anchor="middle" font-family="sans-serif" font-size="7" font-weight="bold" fill="#1e293b" letter-spacing="1">BREW CO.</text>
    </svg>`
  },
  {
    id: 'leaf',
    name: 'Zen Wellness',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 15C50 15 25 35 25 55C25 68.8 36.2 80 50 80C63.8 80 75 68.8 75 55C75 35 50 15 50 15Z" fill="#ecfdf5" stroke="#10b981" stroke-width="3" />
      <path d="M50 80V25" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M50 40C40 45 35 52 35 60" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M50 55C60 60 65 67 65 72" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'cyber',
    name: 'Sleek Apex',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="15" width="70" height="70" rx="12" fill="#0f172a" />
      <path d="M35 65L50 35L65 65" stroke="#38bdf8" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M43 55H57" stroke="#38bdf8" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="35" r="3" fill="#f43f5e" />
    </svg>`
  }
];

const FABRIC_COLORS = [
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Heather Grey', hex: '#d1d5db' },
  { name: 'Charcoal Black', hex: '#2d3748' },
  { name: 'Royal Navy', hex: '#1a365d' },
  { name: 'Forest Green', hex: '#1c4532' },
  { name: 'Soft Sage', hex: '#a3b899' },
  { name: 'Dusty Rose', hex: '#e8b4b8' },
  { name: 'Mustard Yellow', hex: '#ecc94b' },
  { name: 'Retro Orange', hex: '#dd6b20' },
  { name: 'Lilac Cloud', hex: '#d6bcfa' }
];

interface MockupTemplate {
  id: string;
  name: string;
  image: string;
  icon: any;
  safeZone: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

const TEMPLATES: MockupTemplate[] = [
  {
    id: 'tshirt',
    name: 'Cotton T-Shirt',
    image: tshirtMockup,
    icon: Shirt,
    safeZone: { top: 22, left: 28, width: 44, height: 48 }
  },
  {
    id: 'mug',
    name: 'Ceramic Mug',
    image: mugMockup,
    icon: Coffee,
    safeZone: { top: 24, left: 22, width: 32, height: 50 }
  },
  {
    id: 'totebag',
    name: 'Canvas Tote Bag',
    image: totebagMockup,
    icon: ShoppingBag,
    safeZone: { top: 30, left: 28, width: 44, height: 42 }
  }
];

export default function App() {
  // App states
  const [activeTab, setActiveTab] = useState<'upload' | 'builder' | 'ai-helper'>('upload');
  const [selectedTemplate, setSelectedTemplate] = useState<MockupTemplate>(TEMPLATES[0]);
  const [fabricColor, setFabricColor] = useState<string>('#ffffff');
  const [customColorInput, setCustomColorInput] = useState<string>('#ffffff');
  const [colorTintIntensity, setColorTintIntensity] = useState<number>(0.85);
  const [showFabricOverlay, setShowFabricOverlay] = useState<boolean>(true);

  // Logo config
  const [logoSource, setLogoSource] = useState<'upload' | 'preset' | 'builder'>('preset');
  const [activeLogoData, setActiveLogoData] = useState<string>(''); // Data URL
  const [presetLogoId, setPresetLogoId] = useState<string>('sunset');
  
  // Placement coordinates within SAFE ZONE (0-100)
  const [logoX, setLogoX] = useState<number>(50);
  const [logoY, setLogoY] = useState<number>(45);
  const [logoScale, setLogoScale] = useState<number>(50);
  const [logoRotation, setLogoRotation] = useState<number>(0);
  const [logoOpacity, setLogoOpacity] = useState<number>(100);
  const [logoColorMode, setLogoColorMode] = useState<'original' | 'white' | 'black'>('original');
  const [showSafeZoneBorder, setShowSafeZoneBorder] = useState<boolean>(true);

  // Logo Builder States
  const [builderBrandName, setBuilderBrandName] = useState<string>('NORDIC');
  const [builderSubtext, setBuilderSubtext] = useState<string>('OUTDOORS');
  const [builderIcon, setBuilderIcon] = useState<string>('compass');
  const [builderFont, setBuilderFont] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [builderBadge, setBuilderBadge] = useState<'none' | 'circle' | 'shield' | 'hexagon'>('circle');
  const [builderColor, setBuilderColor] = useState<string>('#1e293b');
  const [builderBgColor, setBuilderBgColor] = useState<string>('transparent');

  // AI assistant states
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [aiError, setAiError] = useState<string>('');

  // AI brand generator states
  const [aiBrandName, setAiBrandName] = useState<string>('');
  const [aiIndustry, setAiIndustry] = useState<string>('Eco Fashion');
  const [aiVibe, setAiVibe] = useState<string>('Minimalist, Premium');
  const [isGeneratingConcepts, setIsGeneratingConcepts] = useState<boolean>(false);
  const [brandConcepts, setBrandConcepts] = useState<any[]>([]);

  // Dragging state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const safeZoneRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({ mouseX: 0, mouseY: 0, startX: 50, startY: 45 });

  // Load default preset logo
  useEffect(() => {
    if (logoSource === 'preset') {
      const p = PRESET_LOGOS.find(item => item.id === presetLogoId) || PRESET_LOGOS[0];
      const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(p.svg);
      setActiveLogoData(dataUrl);
    }
  }, [presetLogoId, logoSource]);

  // Update builder SVG logo
  useEffect(() => {
    if (logoSource === 'builder') {
      const svg = generateBuilderSvg();
      const dataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      setActiveLogoData(dataUrl);
    }
  }, [builderBrandName, builderSubtext, builderIcon, builderFont, builderBadge, builderColor, builderBgColor, logoSource]);

  // Generate customized vector SVG based on user configuration
  const generateBuilderSvg = () => {
    let iconPath = '';
    switch (builderIcon) {
      case 'compass':
        iconPath = `<path d="M50 15C30.7 15 15 30.7 15 50C15 69.3 30.7 85 50 85C69.3 85 85 69.3 85 50C85 30.7 69.3 15 50 15ZM50 78C34.6 78 22 65.4 22 50C22 34.6 34.6 22 50 22C65.4 22 78 34.6 78 50C78 65.4 65.4 78 50 78Z" fill="${builderColor}"/><path d="M58.5 41.5L52 52L41.5 58.5L48 48L58.5 41.5Z" fill="${builderColor}"/>`;
        break;
      case 'heart':
        iconPath = `<path d="M50 75L44.8 70.3C26.4 53.6 15 43.3 15 30.5C15 20.1 23.1 12 33.5 12C39.4 12 45 14.8 50 19.1C55 14.8 60.6 12 66.5 12C76.9 12 85 20.1 85 30.5C85 43.3 73.6 53.6 55.2 70.3L50 75Z" fill="${builderColor}"/>`;
        break;
      case 'leaf':
        iconPath = `<path d="M50 12C50 12 25 32 25 52C25 65.8 36.2 77 50 77C63.8 77 75 65.8 75 52C75 32 50 12 50 12Z" fill="${builderColor}" opacity="0.15"/><path d="M50 77V22" stroke="${builderColor}" stroke-width="4" stroke-linecap="round"/><path d="M50 37C40 42 35 49 35 57" stroke="${builderColor}" stroke-width="4" stroke-linecap="round"/><path d="M50 52C60 57 65 64 65 69" stroke="${builderColor}" stroke-width="4" stroke-linecap="round"/>`;
        break;
      case 'flame':
        iconPath = `<path d="M50 12C50 12 30 28 30 50C30 63.8 41.2 75 50 75C58.8 75 70 63.8 70 50C70 28 50 12 50 12Z" fill="${builderColor}" opacity="0.2"/><path d="M47.7 13.1C47.7 13.1 55.4 30.2 46.2 44.1C37 58 45.4 72 54.6 74.3C63.8 76.6 68.4 67.4 68.4 58.2C68.4 49 54.6 30.6 47.7 13.1Z" fill="${builderColor}"/>`;
        break;
      case 'shield':
        iconPath = `<path d="M50 15L20 25V55C20 71.6 32.8 86.8 50 91C67.2 86.8 80 71.6 80 55V25L50 15ZM50 82C37.6 78.4 28 66 28 55V32L50 24.7L72 32V55C72 66 62.4 78.4 50 82Z" fill="${builderColor}"/>`;
        break;
      case 'trophy':
        iconPath = `<path d="M30 15H70V30C70 41 61 50 50 50C39 50 30 41 30 30V15Z" fill="${builderColor}" opacity="0.2"/><path d="M25 12H75V15H25V12ZM30 18V28C30 39 39 48 50 48C61 48 70 39 70 28V18H30ZM20 20V26C20 31.5 24.5 36 30 36H32" stroke="${builderColor}" stroke-width="4" stroke-linecap="round"/><path d="M80 20V26C80 31.5 75.5 36 70 36H68" stroke="${builderColor}" stroke-width="4" stroke-linecap="round"/><path d="M50 48V65M40 65H60M35 70H65" stroke="${builderColor}" stroke-width="4" stroke-linecap="round"/>`;
        break;
      case 'globe':
        iconPath = `<path d="M50 15C30.7 15 15 30.7 15 50C15 69.3 30.7 85 50 85C69.3 85 85 69.3 85 50C85 30.7 69.3 15 50 15ZM50 78C34.6 78 22 65.4 22 50C22 34.6 34.6 22 50 22C65.4 22 78 34.6 78 50C78 65.4 65.4 78 50 78Z" fill="${builderColor}"/><path d="M50 15C59.3 24 64.6 36.5 64.6 50C64.6 63.5 59.3 76 50 85C40.7 76 35.4 63.5 35.4 50C35.4 36.5 40.7 24 50 15Z" stroke="${builderColor}" stroke-width="3" fill="none"/><path d="M15 50H85M18.4 32.5H81.6M18.4 67.5H81.6" stroke="${builderColor}" stroke-width="3"/>`;
        break;
      default:
        iconPath = `<circle cx="50" cy="50" r="10" fill="${builderColor}"/>`;
    }

    const fontFamily = builderFont === 'serif' ? 'Georgia, serif' : builderFont === 'mono' ? 'monospace' : 'sans-serif';
    const fontWeight = '800';

    let badgeOverlay = '';
    if (builderBadge === 'circle') {
      badgeOverlay = `<circle cx="50" cy="50" r="46" stroke="${builderColor}" stroke-width="3" fill="none"/>`;
    } else if (builderBadge === 'shield') {
      badgeOverlay = `<path d="M50 4L10 16V50C10 71.5 27 91 50 96C73 91 90 71.5 90 50V16L50 4Z" stroke="${builderColor}" stroke-width="3" fill="none"/>`;
    } else if (builderBadge === 'hexagon') {
      badgeOverlay = `<path d="M50 4L88 26V70L50 92L12 70V26L50 4Z" stroke="${builderColor}" stroke-width="3" fill="none"/>`;
    }

    return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" fill="${builderBgColor}" />
      ${badgeOverlay}
      <g transform="translate(0, -10)">
        <g transform="scale(0.48) translate(54, 30)">
          ${iconPath}
        </g>
      </g>
      <text x="50" y="70" text-anchor="middle" font-family="${fontFamily}" font-size="10" font-weight="${fontWeight}" fill="${builderColor}" letter-spacing="1">${builderBrandName}</text>
      <text x="50" y="82" text-anchor="middle" font-family="${fontFamily}" font-size="5" font-weight="600" fill="${builderColor}" letter-spacing="3">${builderSubtext}</text>
    </svg>`;
  };

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoSource('upload');
          setActiveLogoData(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop Placement
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: logoX,
      startY: logoY
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      setIsDragging(true);
      dragStartRef.current = {
        mouseX: e.touches[0].clientX,
        mouseY: e.touches[0].clientY,
        startX: logoX,
        startY: logoY
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !safeZoneRef.current) return;
      
      const rect = safeZoneRef.current.getBoundingClientRect();
      const deltaX = e.clientX - dragStartRef.current.mouseX;
      const deltaY = e.clientY - dragStartRef.current.mouseY;

      // Convert pixel delta to safe zone coordinates percent
      const percentDeltaX = (deltaX / rect.width) * 100;
      const percentDeltaY = (deltaY / rect.height) * 100;

      setLogoX(Math.max(0, Math.min(100, dragStartRef.current.startX + percentDeltaX)));
      setLogoY(Math.max(0, Math.min(100, dragStartRef.current.startY + percentDeltaY)));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !safeZoneRef.current || !e.touches[0]) return;

      const rect = safeZoneRef.current.getBoundingClientRect();
      const deltaX = e.touches[0].clientX - dragStartRef.current.mouseX;
      const deltaY = e.touches[0].clientY - dragStartRef.current.mouseY;

      const percentDeltaX = (deltaX / rect.width) * 100;
      const percentDeltaY = (deltaY / rect.height) * 100;

      setLogoX(Math.max(0, Math.min(100, dragStartRef.current.startX + percentDeltaX)));
      setLogoY(Math.max(0, Math.min(100, dragStartRef.current.startY + percentDeltaY)));
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  // Handle Preset Position Alignments
  const applyPresetPlacement = (position: 'center' | 'left-chest' | 'pocket' | 'bottom-right') => {
    switch (position) {
      case 'center':
        setLogoX(50);
        setLogoY(45);
        setLogoScale(50);
        break;
      case 'left-chest':
        setLogoX(28);
        setLogoY(28);
        setLogoScale(25);
        break;
      case 'pocket':
        setLogoX(26);
        setLogoY(38);
        setLogoScale(24);
        break;
      case 'bottom-right':
        setLogoX(75);
        setLogoY(75);
        setLogoScale(30);
        break;
    }
  };

  // AI assistant calls
  const analyzeLogoWithAI = async () => {
    if (!activeLogoData) {
      setAiError('Please load or create a logo first.');
      return;
    }
    
    setIsAnalyzing(true);
    setAiError('');
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoImageBase64: activeLogoData })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to connect to the server.');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Error occurred while analyzing the logo.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateAIConcepts = async () => {
    if (!aiBrandName.trim()) {
      alert('Please enter a Brand Name first.');
      return;
    }

    setIsGeneratingConcepts(true);
    try {
      const response = await fetch('/api/generate-logo-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: aiBrandName,
          industry: aiIndustry,
          styleDescription: aiVibe
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to generate ideas.');
      }

      const data = await response.json();
      setBrandConcepts(data.concepts || []);
    } catch (err: any) {
      alert(err.message || 'Error creating AI concepts.');
    } finally {
      setIsGeneratingConcepts(false);
    }
  };

  // Automatically apply AI suggestion
  const applyAISuggestions = (bgHex: string, placementName: string, scale: string) => {
    setFabricColor(bgHex);
    setCustomColorInput(bgHex);
    
    // Parse placement coordinates from name
    const lowerName = placementName.toLowerCase();
    if (lowerName.includes('left') || lowerName.includes('chest')) {
      applyPresetPlacement('left-chest');
    } else if (lowerName.includes('center') || lowerName.includes('large')) {
      applyPresetPlacement('center');
    } else {
      setLogoX(50);
      setLogoY(48);
    }

    // Parse scale
    const numScale = parseInt(scale);
    if (!isNaN(numScale)) {
      setLogoScale(Math.max(10, Math.min(100, numScale)));
    }
  };

  // Composite canvas export engine
  const exportMockupCanvas = (type: 'preview' | 'print-file') => {
    const mockupImg = new Image();
    mockupImg.crossOrigin = 'anonymous';

    // Wait for mockup template image to load
    mockupImg.onload = () => {
      const canvas = document.createElement('canvas');
      
      if (type === 'preview') {
        // High quality preview export (full resolution of flat lay)
        canvas.width = mockupImg.naturalWidth || 1024;
        canvas.height = mockupImg.naturalHeight || 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Draw original base flat lay
        ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);

        // 2. Draw fabric color overlay using Multiply blend mode
        if (showFabricOverlay && fabricColor !== '#ffffff') {
          ctx.save();
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = fabricColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Retain shadows and transparency by masking
          ctx.save();
          ctx.globalCompositeOperation = 'destination-in';
          ctx.drawImage(mockupImg, 0, 0, canvas.width, canvas.height);
          ctx.restore();
        }

        // 3. Draw Logo on top of product safe zone
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          // Calculate pixel boundaries of the active template safe zone
          const sz = selectedTemplate.safeZone;
          const szX = (sz.left / 100) * canvas.width;
          const szY = (sz.top / 100) * canvas.height;
          const szW = (sz.width / 100) * canvas.width;
          const szH = (sz.height / 100) * canvas.height;

          // Determine pixel position of logo center
          const logoPixelX = szX + (logoX / 100) * szW;
          const logoPixelY = szY + (logoY / 100) * szH;

          // Max size of logo is restricted by safe zone width
          const maxLogoW = szW * (logoScale / 100);
          // Scale height proportionally based on logo image natural aspect ratio
          const aspect = logoImg.naturalHeight / logoImg.naturalWidth || 1;
          const logoW = maxLogoW;
          const logoH = maxLogoW * aspect;

          // Create temporary offscreen canvas for applying logo styling/color overlays (white/black)
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = logoImg.naturalWidth || logoImg.width;
          tempCanvas.height = logoImg.naturalHeight || logoImg.height;
          const tempCtx = tempCanvas.getContext('2d');
          
          if (tempCtx) {
            tempCtx.drawImage(logoImg, 0, 0);
            if (logoColorMode === 'white') {
              tempCtx.globalCompositeOperation = 'source-in';
              tempCtx.fillStyle = '#ffffff';
              tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            } else if (logoColorMode === 'black') {
              tempCtx.globalCompositeOperation = 'source-in';
              tempCtx.fillStyle = '#000000';
              tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            }
          }

          // Render onto main canvas with rotation & scale
          ctx.save();
          ctx.translate(logoPixelX, logoPixelY);
          ctx.rotate((logoRotation * Math.PI) / 180);
          ctx.globalAlpha = logoOpacity / 100;
          ctx.drawImage(tempCtx ? tempCanvas : logoImg, -logoW / 2, -logoH / 2, logoW, logoH);
          ctx.restore();

          // Download composite preview
          const link = document.createElement('a');
          link.download = `${selectedTemplate.id}_mockup_preview.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
        };
        logoImg.src = activeLogoData;
      } else {
        // High resolution transparent print-ready vector file
        const logoImg = new Image();
        logoImg.crossOrigin = 'anonymous';
        logoImg.onload = () => {
          canvas.width = 2400; // Standard professional 300 DPI print dimension
          canvas.height = 2400;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          // Clear transparent backdrop
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Render styled logo centered in the high-res frame
          const logoW = canvas.width * 0.75;
          const aspect = logoImg.naturalHeight / logoImg.naturalWidth || 1;
          const logoH = logoW * aspect;

          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((logoRotation * Math.PI) / 180);

          // Color filters on high res canvas
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = logoImg.naturalWidth;
          tempCanvas.height = logoImg.naturalHeight;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(logoImg, 0, 0);
            if (logoColorMode === 'white') {
              tempCtx.globalCompositeOperation = 'source-in';
              tempCtx.fillStyle = '#ffffff';
              tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            } else if (logoColorMode === 'black') {
              tempCtx.globalCompositeOperation = 'source-in';
              tempCtx.fillStyle = '#000000';
              tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            }
          }

          ctx.drawImage(tempCtx ? tempCanvas : logoImg, -logoW / 2, -logoH / 2, logoW, logoH);
          ctx.restore();

          const link = document.createElement('a');
          link.download = `print_ready_vector_logo.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        };
        logoImg.src = activeLogoData;
      }
    };

    // Trigger image load
    mockupImg.src = selectedTemplate.image;
  };

  // Convert concept to builder template
  const applyAIConceptToBuilder = (concept: any) => {
    setBuilderBrandName(aiBrandName.toUpperCase());
    if (concept.colors && concept.colors.length > 0) {
      setBuilderColor(concept.colors[0].hex);
    }
    setLogoSource('builder');
    setActiveTab('builder');
  };

  // Get active logo css color overlay filter (for browser preview styling only)
  const getFilterStyle = () => {
    if (logoColorMode === 'white') {
      return 'brightness(0) invert(1)';
    }
    if (logoColorMode === 'black') {
      return 'brightness(0)';
    }
    return 'none';
  };

  return (
    <div className="min-h-screen bg-[#fcfcfb] text-[#1e293b] font-sans antialiased flex flex-col">
      {/* Sleek Top Banner */}
      <header className="border-b border-[#e2e8f0] bg-white py-4 px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-[#1e293b] text-white p-2.5 rounded-xl flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#1e293b]">Studio Mockups</h1>
            <p className="text-xs text-[#64748b]">On-demand design workspace & print engine</p>
          </div>
        </div>
        
        {/* Merchandise Category Quick Selectors */}
        <div className="flex gap-2 bg-[#f1f5f9] p-1.5 rounded-2xl border border-[#e2e8f0]">
          {TEMPLATES.map((tmpl) => {
            const IconComponent = tmpl.icon;
            const isSelected = selectedTemplate.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isSelected 
                    ? 'bg-white text-[#1e293b] shadow-sm' 
                    : 'text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isSelected ? 'text-amber-500' : 'text-[#64748b]'}`} />
                <span>{tmpl.name}</span>
              </button>
            );
          })}
        </div>

        {/* Global Export Controls */}
        <div className="flex gap-2.5">
          <button
            onClick={() => exportMockupCanvas('preview')}
            className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] hover:bg-[#e2e8f0] border border-[#e2e8f0] text-sm font-semibold rounded-xl text-[#1e293b] transition duration-300 shadow-sm"
          >
            <Download className="w-4 h-4 text-[#1e293b]" />
            <span>Save Mockup</span>
          </button>
          <button
            onClick={() => exportMockupCanvas('print-file')}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition duration-300 shadow-md hover:shadow-lg"
          >
            <Maximize2 className="w-4 h-4" />
            <span>Print-Ready PNG</span>
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* LEFT COLUMN: Logo Input & Design Panel (4 Columns) */}
        <div className="xl:col-span-4 flex flex-col gap-5 h-fit">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
            
            {/* Tabs Header */}
            <div className="grid grid-cols-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
              <button
                onClick={() => { setActiveTab('upload'); setLogoSource('preset'); }}
                className={`py-3 text-xs font-bold text-center border-b-2 transition duration-300 ${
                  activeTab === 'upload' 
                    ? 'border-[#1e293b] text-[#1e293b]' 
                    : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                Upload & Presets
              </button>
              <button
                onClick={() => { setActiveTab('builder'); setLogoSource('builder'); }}
                className={`py-3 text-xs font-bold text-center border-b-2 transition duration-300 ${
                  activeTab === 'builder' 
                    ? 'border-[#1e293b] text-[#1e293b]' 
                    : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                Logo Builder
              </button>
              <button
                onClick={() => setActiveTab('ai-helper')}
                className={`py-3 text-xs font-bold text-center border-b-2 transition duration-300 ${
                  activeTab === 'ai-helper' 
                    ? 'border-[#1e293b] text-[#1e293b]' 
                    : 'border-transparent text-[#64748b] hover:text-[#1e293b]'
                }`}
              >
                ✨ AI Hub
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-5">
              
              {/* TAB 1: UPLOAD & PRESETS */}
              {activeTab === 'upload' && (
                <div className="space-y-5">
                  {/* File Upload zone */}
                  <div>
                    <span className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-2">Upload transparent logo</span>
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#cbd5e1] rounded-xl cursor-pointer hover:bg-[#f8fafc] transition-colors duration-300">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <Upload className="w-8 h-8 text-[#64748b] mb-2" />
                        <p className="text-sm font-semibold text-[#475569] mb-1">Click to select or drag</p>
                        <p className="text-xs text-[#94a3b8]">PNG, SVG, JPG (Transparent recommended)</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoUpload} 
                      />
                    </label>
                  </div>

                  {/* Built-in Preset library */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="block text-xs font-bold text-[#64748b] uppercase tracking-wider">Or choose a design preset</span>
                      {logoSource === 'preset' && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">Selected</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {PRESET_LOGOS.map((logo) => (
                        <button
                          key={logo.id}
                          onClick={() => {
                            setPresetLogoId(logo.id);
                            setLogoSource('preset');
                          }}
                          className={`flex flex-col items-center p-3 border rounded-xl transition duration-300 bg-[#f8fafc] hover:bg-white ${
                            logoSource === 'preset' && presetLogoId === logo.id
                              ? 'border-[#1e293b] ring-2 ring-[#1e293b]/10 bg-white'
                              : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                          }`}
                        >
                          <div 
                            className="w-16 h-16 mb-2 flex items-center justify-center p-1 bg-white rounded-lg shadow-sm"
                            dangerouslySetInnerHTML={{ __html: logo.svg }}
                          />
                          <span className="text-xs font-semibold text-[#1e293b]">{logo.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VECTOR LOGO BUILDER */}
              {activeTab === 'builder' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">Brand Text</label>
                    <input
                      type="text"
                      value={builderBrandName}
                      onChange={(e) => setBuilderBrandName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
                      placeholder="e.g. ADVENTURE"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">Subtext</label>
                    <input
                      type="text"
                      value={builderSubtext}
                      onChange={(e) => setBuilderSubtext(e.target.value)}
                      className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
                      placeholder="e.g. EST. 2026"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">Mascot Icon</label>
                      <select
                        value={builderIcon}
                        onChange={(e) => setBuilderIcon(e.target.value)}
                        className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
                      >
                        <option value="compass">Compass</option>
                        <option value="heart">Heart</option>
                        <option value="leaf">Zen Leaf</option>
                        <option value="flame">Flame</option>
                        <option value="shield">Shield</option>
                        <option value="trophy">Trophy</option>
                        <option value="globe">Globe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">Font Style</label>
                      <select
                        value={builderFont}
                        onChange={(e) => setBuilderFont(e.target.value as any)}
                        className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
                      >
                        <option value="sans">Modern Sans</option>
                        <option value="serif">Classic Serif</option>
                        <option value="mono">Tech Mono</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">Badge Shape</label>
                      <select
                        value={builderBadge}
                        onChange={(e) => setBuilderBadge(e.target.value as any)}
                        className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1e293b]/20"
                      >
                        <option value="none">No Border</option>
                        <option value="circle">Circular Ring</option>
                        <option value="shield">Shield</option>
                        <option value="hexagon">Hexagon</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">Vector Color</label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={builderColor}
                          onChange={(e) => setBuilderColor(e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                        />
                        <input
                          type="text"
                          value={builderColor}
                          onChange={(e) => setBuilderColor(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 border border-[#cbd5e1] rounded-xl text-xs uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: AI BRAND GENERATOR */}
              {activeTab === 'ai-helper' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 leading-relaxed">
                      Enter your brand information to receive 3 curated design concepts, exact print color schemes, and customized placement instructions.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">Company/Brand Name</label>
                    <input
                      type="text"
                      value={aiBrandName}
                      onChange={(e) => setAiBrandName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                      placeholder="e.g. GreenPath"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">Industry</label>
                      <input
                        type="text"
                        value={aiIndustry}
                        onChange={(e) => setAiIndustry(e.target.value)}
                        className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        placeholder="e.g. Eco Goods"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-1">Style/Vibe</label>
                      <input
                        type="text"
                        value={aiVibe}
                        onChange={(e) => setAiVibe(e.target.value)}
                        className="w-full px-3 py-2 border border-[#cbd5e1] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                        placeholder="e.g. Modern, Minimal"
                      />
                    </div>
                  </div>

                  <button
                    onClick={generateAIConcepts}
                    disabled={isGeneratingConcepts || !aiBrandName}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm rounded-xl transition duration-300 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGeneratingConcepts ? 'Brainstorming...' : 'Generate Brand Concepts'}</span>
                  </button>

                  {/* Brand Concept Results */}
                  {brandConcepts.length > 0 && (
                    <div className="space-y-3.5 mt-4 pt-4 border-t border-slate-100">
                      <span className="block text-xs font-bold text-[#1e293b] uppercase tracking-wider">AI Design Proposals</span>
                      {brandConcepts.map((concept, idx) => (
                        <div key={idx} className="border border-slate-100 bg-slate-50/50 p-3 rounded-xl space-y-2 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#1e293b]">{concept.name}</span>
                            <button
                              onClick={() => applyAIConceptToBuilder(concept)}
                              className="text-[10px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded-md transition"
                            >
                              Apply to Builder
                            </button>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{concept.description}</p>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className="text-[10px] font-medium text-slate-400 mr-1">Palette:</span>
                            {concept.colors?.map((c: any, i: number) => (
                              <div key={i} className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-100">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.hex }} />
                                <span className="text-[9px] font-semibold text-slate-600 uppercase">{c.hex}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Quick Info Tip Card */}
          <div className="bg-[#f8fafc] border border-[#e2e8f0] p-4.5 rounded-2xl flex gap-3 text-xs leading-relaxed text-[#475569] shadow-sm">
            <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-[#1e293b] block mb-0.5">Mockup Customization</span>
              You can drag the logo directly on the workspace to position it, or refine settings below like color override, size, and fabric textures.
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Interactive Mockup Studio Workstation (5 Columns) */}
        <div className="xl:col-span-5 flex flex-col gap-5">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-md flex-1 flex flex-col relative min-h-[480px]">
            
            {/* Action Bar / Studio Controls */}
            <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#1e293b]">Workspace Preview</span>
              </div>

              {/* Fabric Overlay Control and Safe Zone Outline Toggles */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSafeZoneBorder(!showSafeZoneBorder)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    showSafeZoneBorder
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
                  }`}
                  title="Toggle safe boundaries border outline"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Safe Zone</span>
                </button>
                
                <button
                  onClick={() => setShowFabricOverlay(!showFabricOverlay)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                    showFabricOverlay
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-white text-slate-500 border-slate-200 hover:text-slate-700'
                  }`}
                  title="Toggle Realistic Fabric Color Multiply Tinting"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Tint Blend</span>
                </button>
              </div>
            </div>

            {/* Interactive Mockup Container */}
            <div className="flex-1 flex items-center justify-center p-6 bg-[#f1f5f9] select-none relative overflow-hidden min-h-[400px]">
              
              {/* Product Layout Wrapper */}
              <div id="mockup-studio-canvas" className="relative w-full max-w-[400px] aspect-square bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
                
                {/* 1. Base Mockup Image of Product (T-Shirt, Mug, Tote Bag) */}
                <img 
                  src={selectedTemplate.image} 
                  alt={selectedTemplate.name}
                  className="w-full h-full object-cover pointer-events-none"
                  draggable={false}
                />

                {/* 2. Fabric Color Tint Filter Layer (Multiply Blend Mode) */}
                {showFabricOverlay && fabricColor !== '#ffffff' && (
                  <div 
                    className="absolute inset-0 pointer-events-none mix-blend-multiply transition-colors duration-300"
                    style={{ 
                      backgroundColor: fabricColor,
                      opacity: colorTintIntensity
                    }}
                  />
                )}

                {/* 3. Interactive Safe Placement Zone */}
                <div 
                  ref={safeZoneRef}
                  className={`absolute transition-all duration-300 ${
                    showSafeZoneBorder ? 'border-2 border-dashed border-amber-500/40' : 'border-transparent'
                  }`}
                  style={{
                    top: `${selectedTemplate.safeZone.top}%`,
                    left: `${selectedTemplate.safeZone.left}%`,
                    width: `${selectedTemplate.safeZone.width}%`,
                    height: `${selectedTemplate.safeZone.height}%`,
                  }}
                >
                  {/* Safe Zone Watermark (Only shows when empty or hovering) */}
                  {showSafeZoneBorder && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[9px] font-bold text-amber-600/20 uppercase tracking-widest">Print Area</span>
                    </div>
                  )}

                  {/* 4. Draggable Logo Element */}
                  {activeLogoData ? (
                    <div
                      onMouseDown={handleMouseDown}
                      onTouchStart={handleTouchStart}
                      className={`absolute cursor-move origin-center group flex items-center justify-center ${
                        isDragging ? 'ring-2 ring-amber-500 bg-amber-500/5' : 'hover:ring-1 hover:ring-amber-500/50'
                      }`}
                      style={{
                        left: `${logoX}%`,
                        top: `${logoY}%`,
                        width: `${logoScale}%`,
                        transform: `translate(-50%, -50%) rotate(${logoRotation}deg)`,
                        opacity: logoOpacity / 100,
                        transition: isDragging ? 'none' : 'left 0.15s ease-out, top 0.15s ease-out, transform 0.1s linear'
                      }}
                    >
                      {/* Interactive Handles */}
                      <img 
                        src={activeLogoData} 
                        alt="Placed Design Logo"
                        className="w-full h-auto pointer-events-none select-none max-h-full"
                        style={{ filter: getFilterStyle() }}
                        draggable={false}
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-slate-300 rounded">
                      <span className="text-xs text-slate-400">Loading Logo...</span>
                    </div>
                  )}
                </div>

              </div>

            </div>

            {/* Quick Presets Positioning Buttons */}
            <div className="bg-[#f8fafc] border-t border-[#e2e8f0] px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-slate-500">Quick Align:</span>
              <div className="flex gap-1.5 flex-wrap">
                <button
                  onClick={() => applyPresetPlacement('center')}
                  className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 font-semibold rounded text-slate-600 transition"
                >
                  Centered
                </button>
                {selectedTemplate.id === 'tshirt' && (
                  <>
                    <button
                      onClick={() => applyPresetPlacement('left-chest')}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 font-semibold rounded text-slate-600 transition"
                    >
                      Left Chest
                    </button>
                    <button
                      onClick={() => applyPresetPlacement('pocket')}
                      className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 font-semibold rounded text-slate-600 transition"
                    >
                      Pocket Size
                    </button>
                  </>
                )}
                {selectedTemplate.id === 'totebag' && (
                  <button
                    onClick={() => applyPresetPlacement('bottom-right')}
                    className="px-2.5 py-1 bg-white border border-slate-200 hover:border-slate-300 font-semibold rounded text-slate-600 transition"
                  >
                    Bottom Corner
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: Configuration Knobs, Color Selectors & AI Analysis (3 Columns) */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          
          {/* Section 1: Color & Appearance */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm space-y-4">
            <span className="block text-xs font-bold text-[#64748b] uppercase tracking-wider">Fabric / Base Color</span>
            
            {/* Color Swatch Matrix */}
            <div className="grid grid-cols-5 gap-2.5">
              {FABRIC_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => { setFabricColor(color.hex); setCustomColorInput(color.hex); }}
                  className={`w-full aspect-square rounded-full border relative transition-all duration-300 shadow-sm ${
                    fabricColor.toLowerCase() === color.hex.toLowerCase()
                      ? 'ring-2 ring-offset-2 ring-[#1e293b] scale-105 border-slate-400'
                      : 'border-slate-200 hover:scale-105'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {fabricColor.toLowerCase() === color.hex.toLowerCase() && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Check className={`w-3.5 h-3.5 ${color.hex === '#ffffff' ? 'text-slate-900' : 'text-white'}`} />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Custom Hex Color Picker */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Custom:</span>
              <div className="flex gap-2 flex-1">
                <input
                  type="color"
                  value={customColorInput}
                  onChange={(e) => { setFabricColor(e.target.value); setCustomColorInput(e.target.value); }}
                  className="w-7 h-7 rounded cursor-pointer border border-slate-200 p-0"
                />
                <input
                  type="text"
                  value={customColorInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomColorInput(val);
                    if (val.match(/^#[0-9A-Fa-f]{6}$/)) {
                      setFabricColor(val);
                    }
                  }}
                  className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs uppercase"
                />
              </div>
            </div>

            {/* Tint Opacity slider */}
            {fabricColor !== '#ffffff' && (
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Fabric Blend Opacity</span>
                  <span>{Math.round(colorTintIntensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={colorTintIntensity * 100}
                  onChange={(e) => setColorTintIntensity(parseFloat(e.target.value) / 100)}
                  className="w-full accent-[#1e293b]"
                />
              </div>
            )}
          </div>

          {/* Section 2: Logo Placement Precision Controls */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm space-y-4">
            <span className="block text-xs font-bold text-[#64748b] uppercase tracking-wider">Placement Knobs</span>
            
            <div className="space-y-3.5">
              
              {/* Logo Print Mode */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500">Ink Color Override</label>
                <div className="grid grid-cols-3 gap-1 bg-[#f1f5f9] p-1 rounded-xl border border-slate-200">
                  {(['original', 'white', 'black'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setLogoColorMode(mode)}
                      className={`py-1 text-[10px] font-bold rounded-lg uppercase transition ${
                        logoColorMode === mode
                          ? 'bg-white text-[#1e293b] shadow-sm'
                          : 'text-slate-500 hover:text-[#1e293b]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 1: Scaling */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Print Scale</span>
                  <span>{logoScale}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={logoScale}
                  onChange={(e) => setLogoScale(parseInt(e.target.value))}
                  className="w-full accent-[#1e293b]"
                />
              </div>

              {/* Slider 2: Rotation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Rotate</span>
                  <span>{logoRotation}°</span>
                </div>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={logoRotation}
                  onChange={(e) => setLogoRotation(parseInt(e.target.value))}
                  className="w-full accent-[#1e293b]"
                />
              </div>

              {/* Slider 3: Opacity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Opacity</span>
                  <span>{logoOpacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={logoOpacity}
                  onChange={(e) => setLogoOpacity(parseInt(e.target.value))}
                  className="w-full accent-[#1e293b]"
                />
              </div>

            </div>
          </div>

          {/* Section 3: AI Style and Placement Analyzer Panel */}
          <div className="bg-white border border-[#e2e8f0] p-5 rounded-2xl shadow-sm space-y-3 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="block text-xs font-bold text-[#64748b] uppercase tracking-wider">AI Design Assistant</span>
                <span className="bg-emerald-100 text-emerald-800 text-[9px] px-2 py-0.5 rounded-full font-bold">Smart Analysis</span>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Scan your design layout with Gemini to obtain perfect color pairing, optimal dimension grids, and styling briefs.
              </p>

              {aiError && (
                <div className="bg-red-50 text-red-700 p-2.5 rounded-lg text-xs font-medium">
                  {aiError}
                </div>
              )}

              {/* Display analysis feedback results */}
              {analysisResult && (
                <div className="space-y-3 pt-2.5 border-t border-slate-100 text-xs">
                  <div>
                    <span className="font-bold text-slate-700 block">Identified Logo Style:</span>
                    <span className="text-slate-600 leading-relaxed">{analysisResult.logoStyle}</span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Recommended Backdrops:</span>
                    <div className="space-y-1.5">
                      {analysisResult.suggestedBackgrounds?.map((bg: any, i: number) => (
                        <div key={i} className="flex justify-between items-center bg-[#f8fafc] border border-slate-100 p-2 rounded-lg gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: bg.hex }} />
                            <div>
                              <span className="font-semibold block text-slate-700 text-[10px]">{bg.name}</span>
                              <span className="text-[9px] text-slate-500 leading-none">{bg.reason}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => applyAISuggestions(bg.hex, analysisResult.placements?.[0]?.name || 'center', analysisResult.placements?.[0]?.scale || '50%')}
                            className="bg-[#1e293b] hover:bg-black text-white text-[9px] font-bold px-2 py-1 rounded transition whitespace-nowrap"
                          >
                            Apply
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-700 block mb-0.5">💡 Marketing/Styling Tip:</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{analysisResult.stylingTip}</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={analyzeLogoWithAI}
              disabled={isAnalyzing || !activeLogoData}
              className="w-full flex items-center justify-center gap-2 py-2 bg-[#1e293b] hover:bg-black text-white disabled:bg-slate-200 disabled:text-slate-400 text-xs font-bold rounded-xl transition duration-300 shadow-sm mt-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAnalyzing ? 'Scanning design...' : 'Analyze Logo Style'}</span>
            </button>
          </div>

        </div>

      </div>

      {/* Styled Footer */}
      <footer className="border-t border-[#e2e8f0] bg-white py-4 text-center text-xs text-[#94a3b8] mt-auto">
        <span>© 2026 Studio Mockups Inc. All templates are high-fidelity vector mapped. Print engine operates at 300 DPI.</span>
      </footer>
    </div>
  );
}
