import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Upload, Copy, Download, Eye } from 'lucide-react';
import googleReviewHelp from '@/assets/google-review-help.webp';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthContext } from '@/hooks/useAuthContext';
import { wheelApi } from '@/utils/wheelApi';
interface Lot {
  name: string;
  odds: string;
  promoCode: string;
}
interface WheelConfig {
  businessName: string;
  googleReviewLink: string;
  socialMediaLink: string;
  customerInstruction: string;
  mainColors: {
    color1: string;
    color2: string;
    color3: string;
  };
  lots: Lot[];
  logoUrl: string | null;
}
export default function Settings() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, isInitialized } = useAuthContext();
  const [wheelId, setWheelId] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [socialMediaLink, setSocialMediaLink] = useState('');
  const [customerInstruction, setCustomerInstruction] = useState('Donnez-nous un avis ⭐');
  const [mainColors, setMainColors] = useState({
    color1: '#66c4ff',
    color2: '#ffffff',
    color3: '#ece2c1'
  });
  const [lots, setLots] = useState<Lot[]>([{
    name: '',
    odds: '1',
    promoCode: ''
  }, {
    name: '',
    odds: '1',
    promoCode: ''
  }, {
    name: '',
    odds: '1',
    promoCode: ''
  }, {
    name: '',
    odds: '1',
    promoCode: ''
  }, {
    name: '',
    odds: '1',
    promoCode: ''
  }, {
    name: '',
    odds: '1',
    promoCode: ''
  }, {
    name: '',
    odds: '1',
    promoCode: ''
  }, {
    name: '',
    odds: '1',
    promoCode: ''
  }]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoBackgroundColor, setLogoBackgroundColor] = useState<string>('rgba(255,255,255,0.95)');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch user's wheel configuration from API
  const fetchUserWheel = useCallback(async () => {
    if (!isInitialized || !user?.user?._id) {
      setIsFetching(false);
      return;
    }

    try {
      setIsFetching(true);
      const response = await wheelApi.getWheelsByUserId(user.user._id);

      if (response.wheels && response.wheels.length > 0) {
        // User has at least one wheel saved
        const wheel = response.wheels[0]; // Get the first wheel

        // Update state with wheel data
        setWheelId(wheel._id);
        setBusinessName(wheel.businessName || '');
        setGoogleReviewLink(wheel.googleReviewLink || '');
        setSocialMediaLink(wheel.socialMediaLink || '');
        setCustomerInstruction(wheel.customerInstruction || 'Donnez-nous un avis ⭐');

        // Set colors
        if (wheel.mainColors) {
          setMainColors(wheel.mainColors);
        }

        // Set lots (ensure we have exactly 8)
        if (wheel.lots && wheel.lots.length > 0) {
          const wheelLots = [...wheel.lots];
          while (wheelLots.length < 8) {
            wheelLots.push({ name: '', odds: '1', promoCode: '' });
          }
          setLots(wheelLots.slice(0, 8));
        }

        // Set logo preview if available
        if (wheel.logoUrl) {
          setLogoPreview(wheel.logoUrl);
        }
      }
    } catch (error) {
      console.error("Error fetching wheel:", error);
    } finally {
      setIsFetching(false);
    }
  }, [isInitialized, user?.user?._id, t]);

  // Load config from API on mount
  useEffect(() => {
    fetchUserWheel();
  }, [fetchUserWheel]);

  // Draw wheel lines in preview
  useEffect(() => {
    if (!showPreview) return;
    const drawWheelLines = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const size = canvas.width = canvas.offsetWidth;
      canvas.height = size;
      const center = size / 2;
      const sections = 8;
      const angleStep = 2 * Math.PI / sections;
      ctx.clearRect(0, 0, size, size);
      for (let i = 0; i < sections; i++) {
        const angle = i * angleStep - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + size / 2 * Math.cos(angle), center + size / 2 * Math.sin(angle));
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };
    drawWheelLines();
    window.addEventListener('resize', drawWheelLines);
    return () => window.removeEventListener('resize', drawWheelLines);
  }, [showPreview]);

  // Detect logo background color from corner pixels
  useEffect(() => {
    if (!logoPreview) return;

    const detectBackgroundColor = () => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Sample corners and edges to detect background color
          const samplePoints = [
            { x: 0, y: 0 },                           // Top-left
            { x: img.width - 1, y: 0 },               // Top-right
            { x: 0, y: img.height - 1 },              // Bottom-left
            { x: img.width - 1, y: img.height - 1 },  // Bottom-right
            { x: 2, y: 2 },                           // Near top-left
            { x: img.width - 3, y: 2 },               // Near top-right
            { x: 2, y: img.height - 3 },              // Near bottom-left
            { x: img.width - 3, y: img.height - 3 },  // Near bottom-right
          ];

          const colors: { r: number; g: number; b: number; a: number }[] = [];
          
          for (const point of samplePoints) {
            const pixelData = ctx.getImageData(point.x, point.y, 1, 1).data;
            colors.push({
              r: pixelData[0],
              g: pixelData[1],
              b: pixelData[2],
              a: pixelData[3]
            });
          }

          // Find the most common color (mode) among corners
          const colorMap = new Map<string, { count: number; color: typeof colors[0] }>();
          
          for (const color of colors) {
            // Round colors to reduce variance from anti-aliasing
            const key = `${Math.round(color.r / 10) * 10}-${Math.round(color.g / 10) * 10}-${Math.round(color.b / 10) * 10}-${Math.round(color.a / 10) * 10}`;
            const existing = colorMap.get(key);
            if (existing) {
              existing.count++;
            } else {
              colorMap.set(key, { count: 1, color });
            }
          }

          // Get the most frequent color
          let dominantColor = colors[0];
          let maxCount = 0;
          
          for (const [, value] of colorMap) {
            if (value.count > maxCount) {
              maxCount = value.count;
              dominantColor = value.color;
            }
          }

          // If alpha is very low (transparent), use white
          if (dominantColor.a < 50) {
            setLogoBackgroundColor('rgba(255, 255, 255, 0.95)');
          } else {
            setLogoBackgroundColor(`rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.98)`);
          }
        } catch (error) {
          console.log('Could not detect logo background color, using default white');
          setLogoBackgroundColor('rgba(255, 255, 255, 0.95)');
        }
      };

      img.onerror = () => {
        console.log('Could not load logo for color detection');
        setLogoBackgroundColor('rgba(255, 255, 255, 0.95)');
      };

      img.src = logoPreview;
    };

    detectBackgroundColor();
  }, [logoPreview]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleResetForm = () => {
    setLots([{
      name: '',
      odds: '1',
      promoCode: ''
    }, {
      name: '',
      odds: '1',
      promoCode: ''
    }, {
      name: '',
      odds: '1',
      promoCode: ''
    }, {
      name: '',
      odds: '1',
      promoCode: ''
    }, {
      name: '',
      odds: '1',
      promoCode: ''
    }, {
      name: '',
      odds: '1',
      promoCode: ''
    }, {
      name: '',
      odds: '1',
      promoCode: ''
    }, {
      name: '',
      odds: '1',
      promoCode: ''
    }]);
    toast.success(t('settings.resetSuccess'));
  };
  const handleSaveWheel = async () => {
    if (!user?.user?._id) {
      toast.error(t('settings.loginRequired') || "You must be logged in to save a wheel");
      return;
    }

    // Validation
    if (!businessName.trim()) {
      toast.error(t('settings.businessNameRequired'));
      return;
    }
    if (!googleReviewLink.trim()) {
      toast.error(t('settings.googleReviewLinkRequired'));
      return;
    }
    if (!customerInstruction.trim()) {
      toast.error(t('settings.customerInstructionRequired'));
      return;
    }
    if (!logoPreview) {
      toast.error(t('settings.logoRequired'));
      return;
    }
    const hasEmptyLots = lots.some(lot => !lot.name.trim() || !lot.odds.trim());
    if (hasEmptyLots) {
      toast.error(t('settings.lotNameRequired'));
      return;
    }

    try {
      setIsLoading(true);

      // First, upload the logo if a new one is selected
      let logoUrl = logoPreview;
      if (logoFile) {
        try {
          const uploadResponse = await wheelApi.uploadFile(logoFile);
          if (uploadResponse.filePath) {
            logoUrl = uploadResponse.filePath;
            setLogoPreview(logoUrl);
          }
        } catch (uploadError) {
          console.error("Error uploading logo:", uploadError);
          toast.error(t('settings.logoUploadFailed') || "Failed to upload logo image");
          // Continue with the wheel save even if logo upload fails
        }
      }

      // Prepare wheel data
      const wheelData = {
        userId: user.user._id,
        businessName,
        googleReviewLink,
        socialMediaLink,
        customerInstruction,
        mainColors,
        lots,
        logoUrl
      };

      // Either create a new wheel or update an existing one
      let response;
      if (wheelId) {
        // Update existing wheel
        response = await wheelApi.updateWheel(wheelId, wheelData);
        toast.success(t('settings.wheelUpdateSuccess') || "Wheel updated successfully");
      } else {
        // Create new wheel
        response = await wheelApi.createWheel(wheelData);
        if (response.wheel?._id) {
          setWheelId(response.wheel._id);
        }
        toast.success(t('settings.wheelCreateSuccess') || "Wheel created successfully");
      }

      // Clear logo file after successful save
      setLogoFile(null);
    } catch (error) {
      console.error("Error saving wheel:", error);
      toast.error(error instanceof Error ? error.message : (t('settings.saveFailed') || "Failed to save wheel"));
    } finally {
      setIsLoading(false);
    }
  };
  const getQrCodeUrl = () => {
    if (!wheelId) {
      return '';
    }
    // Use the backend API to generate the game URL, or construct it manually
    return `${window.location.origin}/wheelGame/${wheelId}`;
  };
  const downloadQRCodeAsSVG = () => {
    if (!wheelId) {
      toast.error("Please save your wheel first");
      return;
    }
    const svgElement = document.getElementById('wheel-qr-code');
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8'
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `wheel-qr-code-${wheelId}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
      toast.success(t('settings.qrCodeDownloadedSVG'));
    }
  };
  const downloadQRCodeAsPNG = () => {
    if (!wheelId) {
      toast.error("Please save your wheel first");
      return;
    }
    const svgElement = document.getElementById('wheel-qr-code');
    if (svgElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const img = new Image();
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8'
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = 'wheel-qr-code.webp';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(svgUrl);
        toast.success(t('settings.qrCodeDownloadedPNG'));
      };
      img.src = svgUrl;
    }
  };
  const generatePDF = (canvas: HTMLCanvasElement, language: string) => {
    try {
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      let finalWidth, finalHeight;
      if (ratio > pdfWidth / pdfHeight) {
        finalWidth = pdfWidth;
        finalHeight = pdfWidth / ratio;
      } else {
        finalHeight = pdfHeight;
        finalWidth = pdfHeight * ratio;
      }
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      pdf.save(`wheel-poster-${language.toLowerCase()}.pdf`);
      const message = language === 'English' ? t('settings.englishPosterDownloaded') : t('settings.posterDownloaded');
      toast.success(message);
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error(t('settings.pdfGenerationError'));
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `wheel-poster-${language.toLowerCase()}.webp`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } finally {
      setIsLoading(false);
    }
  };
  const downloadEnglishPoster = () => {
    if (!wheelId) {
      toast.error("Please save your wheel first");
      return;
    }
    setIsLoading(true);
    toast.info(t('settings.preparingEnglishPoster'));
    const getQRCodeImage = (): Promise<string | null> => {
      return new Promise(resolve => {
        const svgElement = document.getElementById('wheel-qr-code');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8'
          });
          const svgUrl = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            }
            URL.revokeObjectURL(svgUrl);
          };
          img.src = svgUrl;
        } else {
          resolve(null);
        }
      });
    };
    const templateImg = new Image();
    templateImg.crossOrigin = 'Anonymous';
    templateImg.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(templateImg, 0, 0);
      const qrCodeDataUrl = await getQRCodeImage();
      if (qrCodeDataUrl) {
        const qrImg = new Image();
        qrImg.onload = () => {
          const qrSize = templateImg.width * 0.22;
          const qrX = templateImg.width * 0.72 - qrSize / 2;
          const qrY = templateImg.height * 0.78;
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          if (logoPreview) {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            logoImg.onload = () => {
              const logoWidth = 260;
              const logoHeight = 260;
              const logoX = (templateImg.width - logoWidth) / 2;
              const logoY = templateImg.height * 0.05;
              ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
              generatePDF(canvas, 'English');
            };
            logoImg.onerror = () => {
              toast.error(t('settings.logoLoadError'));
              generatePDF(canvas, 'English');
            };
            logoImg.src = logoPreview;
          } else {
            generatePDF(canvas, 'English');
          }
        };
        qrImg.onerror = () => {
          toast.error(t('settings.qrCodeLoadError'));
          setIsLoading(false);
        };
        qrImg.src = qrCodeDataUrl;
      }
    };
    templateImg.onerror = () => {
      toast.error(t('settings.posterTemplateErrorEnglish'));
      setIsLoading(false);
    };
    templateImg.src = '/lovable-uploads/english-poster.webp';
  };
  const downloadFrenchPoster = () => {
    if (!wheelId) {
      toast.error("Please save your wheel first");
      return;
    }
    setIsLoading(true);
    toast.info(t('settings.preparingPoster'));
    const getQRCodeImage = (): Promise<string | null> => {
      return new Promise(resolve => {
        const svgElement = document.getElementById('wheel-qr-code');
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          const svgBlob = new Blob([svgData], {
            type: 'image/svg+xml;charset=utf-8'
          });
          const svgUrl = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL('image/png'));
            }
            URL.revokeObjectURL(svgUrl);
          };
          img.src = svgUrl;
        } else {
          resolve(null);
        }
      });
    };
    const templateImg = new Image();
    templateImg.crossOrigin = 'Anonymous';
    templateImg.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = templateImg.width;
      canvas.height = templateImg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(templateImg, 0, 0);
      const qrCodeDataUrl = await getQRCodeImage();
      if (qrCodeDataUrl) {
        const qrImg = new Image();
        qrImg.onload = () => {
          const qrSize = templateImg.width * 0.22;
          const qrX = templateImg.width * 0.72 - qrSize / 2;
          const qrY = templateImg.height * 0.78;
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
          if (logoPreview) {
            const logoImg = new Image();
            logoImg.crossOrigin = 'Anonymous';
            logoImg.onload = () => {
              const logoWidth = 260;
              const logoHeight = 260;
              const logoX = (templateImg.width - logoWidth) / 2;
              const logoY = templateImg.height * 0.05;
              ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
              generatePDF(canvas, 'French');
            };
            logoImg.onerror = () => {
              toast.error(t('settings.logoLoadError'));
              generatePDF(canvas, 'French');
            };
            logoImg.src = logoPreview;
          } else {
            generatePDF(canvas, 'French');
          }
        };
        qrImg.onerror = () => {
          toast.error(t('settings.qrCodeLoadError'));
          setIsLoading(false);
        };
        qrImg.src = qrCodeDataUrl;
      }
    };
    templateImg.onerror = () => {
      toast.error(t('settings.posterTemplateError'));
      setIsLoading(false);
    };
    templateImg.src = '/lovable-uploads/french-poster-new.webp';
  };
  const copyLinkToClipboard = () => {
    if (!wheelId) {
      toast.error("Please save your wheel first");
      return;
    }
    navigator.clipboard.writeText(getQrCodeUrl());
    toast.success(t('settings.linkCopied'));
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-5xl mx-auto md:px-6 py-4 md:py-6 px-px">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-center">{t('settings.title')}</h1>
          <Button onClick={() => setShowPreview(true)} className="text-center mx-auto md:mx-0 px-4 py-2">
            <span className="inline-flex items-center gap-2">
              <Eye className="w-4 h-4" />
              {t('settings.previewGame')}
            </span>
          </Button>
        </div>

        <div className="space-y-4 md:space-y-6">
          {/* Business Name */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <label className="font-semibold text-lg">
                  {t('settings.businessName')} <span className="text-red-500">*</span>
                  <span className="text-sm font-normal text-muted-foreground ml-2 mx-[11px]">{t('settings.businessNameMaxChars')}</span>
                </label>
              </div>
              <div className="relative">
                <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder={t('settings.businessNamePlaceholder')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" maxLength={25} disabled={isLoading} />
                <span className="absolute right-3 top-3 text-sm text-muted-foreground text-right px-0 mx-0 my-0 py-[20px]">
                  {businessName.length}/25
                </span>
              </div>
            </div>
          </Card>

          {/* Google Review Link */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <label className="font-semibold text-lg">
                {t('settings.googleReviewLink')} <span className="text-red-500">*</span>
              </label>
              <input type="url" value={googleReviewLink} onChange={e => setGoogleReviewLink(e.target.value)} placeholder={t('settings.googleReviewLinkPlaceholder')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" disabled={isLoading} />
              <div className="mt-2">
                <img 
                  src={googleReviewHelp} 
                  alt="Google Review Link Help" 
                  className="w-full max-w-md mx-auto rounded-lg border shadow-sm"
                  width={448}
                  height={252}
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                />
                <p className="text-xs text-muted-foreground italic text-center mt-2">
                  {t('settings.googleReviewHelper')}
                </p>
              </div>
            </div>
          </Card>

          {/* Customer Instruction */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <label className="font-semibold text-lg">
                {t('settings.customerInstruction')} <span className="text-red-500">*</span>
                <span className="text-sm font-normal text-muted-foreground ml-2">{t('settings.customerInstructionMaxChars')}</span>
              </label>
              <div className="relative">
                <input type="text" value={customerInstruction} onChange={e => setCustomerInstruction(e.target.value)} placeholder={t('settings.customerInstructionPlaceholder')} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" maxLength={40} disabled={isLoading} />
                <span className="absolute right-3 top-3 text-sm text-muted-foreground">
                  {customerInstruction.length}/40
                </span>
              </div>
            </div>
          </Card>

          {/* Main Colors */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-red-400 via-green-400 to-yellow-400 rounded-full"></div>
              <label className="font-semibold text-base md:text-lg">{t('settings.mainColors')}</label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="font-medium mb-1">{t('settings.color1')}</div>
                  <div className="text-xs text-muted-foreground">{t('settings.color1Desc')}</div>
                </div>
                <div className="w-full h-16 rounded-lg shadow-inner" style={{
                backgroundColor: mainColors.color1
              }} />
                <input type="color" value={mainColors.color1} onChange={e => setMainColors({
                ...mainColors,
                color1: e.target.value
              })} className="w-full h-10 cursor-pointer rounded-lg" disabled={isLoading} />
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="font-medium mb-1">{t('settings.color2')}</div>
                  <div className="text-xs text-muted-foreground">{t('settings.color2Desc')}</div>
                </div>
                <div className="w-full h-16 rounded-lg shadow-inner" style={{
                backgroundColor: mainColors.color2
              }} />
                <input type="color" value={mainColors.color2} onChange={e => setMainColors({
                ...mainColors,
                color2: e.target.value
              })} className="w-full h-10 cursor-pointer rounded-lg" disabled={isLoading} />
              </div>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="font-medium mb-1">{t('settings.color3')}</div>
                  <div className="text-xs text-muted-foreground">{t('settings.color3Desc')}</div>
                </div>
                <div className="w-full h-16 rounded-lg shadow-inner" style={{
                backgroundColor: mainColors.color3
              }} />
                <input type="color" value={mainColors.color3} onChange={e => setMainColors({
                ...mainColors,
                color3: e.target.value
              })} className="w-full h-10 cursor-pointer rounded-lg" disabled={isLoading} />
              </div>
            </div>
          </Card>

          {/* Logo */}
          <Card className="p-4 md:p-6">
            <div className="flex flex-col gap-3 md:gap-4">
              <label className="font-semibold text-lg">
                {t('settings.logo')} <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <label className="flex-1 cursor-pointer flex flex-col items-center justify-center bg-muted border-2 border-dashed rounded-lg py-8 px-4 hover:border-primary transition">
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} disabled={isLoading} />
                  <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-muted-foreground font-medium">{t('settings.logoUpload')}</span>
                </label>
                {/* Logo preview frame - circular to match wheel center */}
                <div 
                  className="w-28 h-28 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden relative"
                  style={{ backgroundColor: logoPreview ? logoBackgroundColor : undefined }}
                >
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-[140%] h-[140%] object-cover" 
                      style={{ 
                        objectPosition: 'center',
                        transform: 'scale(1)'
                      }}
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm text-center px-2 bg-muted w-full h-full flex items-center justify-center">{t('settings.noLogo')}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Lots Configuration */}
          <Card className="p-4 md:p-6">
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎁</span>
              </div>
              <label className="font-semibold text-base md:text-lg">
                {t('settings.lots')} <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="mb-4 md:mb-6 bg-blue-50 rounded-lg p-3 md:p-4 border border-blue-100">
              <div className="space-y-2 text-sm text-blue-900">
                <p>{t('settings.lotsInstructions1')}</p>
                <p>{t('settings.lotsInstructions2')}</p>
                <p className="whitespace-pre-line px-0">{t('settings.lotsInstructions3')}</p>
                <p>{t('settings.lotsInstructions4')}</p>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-2 md:gap-4 mb-3 md:mb-4 font-medium text-xs md:text-sm text-muted-foreground">
              <div className="col-span-5">{t('settings.lotName')} *</div>
              <div className="col-span-3 md:col-span-2">{t('settings.lotOdds')} *</div>
              <div className="col-span-4 md:col-span-5">{t('settings.lotPromoCode')}</div>
            </div>

            <div className="space-y-2 md:space-y-3">
              {lots.map((lot, index) => <div key={index} className="grid grid-cols-12 gap-2 md:gap-4">
                  <div className="col-span-5 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-muted rounded-full w-6 h-6 flex items-center justify-center font-medium text-sm">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <input type="text" value={lot.name} onChange={e => {
                  const newLots = [...lots];
                  newLots[index].name = e.target.value;
                  setLots(newLots);
                }} placeholder={t('settings.lotName') + ` ${index + 1}`} className="w-full p-3 pl-12 border rounded-lg focus:ring-2 focus:ring-primary" disabled={isLoading} />
                  </div>
                  <div className="col-span-3 md:col-span-2">
                    <input type="text" value={lot.odds} onChange={e => {
                  const newLots = [...lots];
                  newLots[index].odds = e.target.value;
                  setLots(newLots);
                }} className="w-full p-3 text-center border rounded-lg focus:ring-2 focus:ring-primary" disabled={isLoading} />
                  </div>
                  <div className="col-span-4 md:col-span-5">
                    <input type="text" value={lot.promoCode} onChange={e => {
                  const newLots = [...lots];
                  newLots[index].promoCode = e.target.value;
                  setLots(newLots);
                }} placeholder="Code Promo" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary" disabled={isLoading} />
                  </div>
                </div>)}
            </div>

            <div className="mt-4 md:mt-6 flex justify-end">
              <Button variant="outline" onClick={handleResetForm} disabled={isLoading}>
                {t('settings.resetValues')}
              </Button>
            </div>
          </Card>

          {/* Save Button and QR Code */}
          <Card className="p-4 md:p-6">
            <div className="space-y-4 md:space-y-6">
              <Button onClick={handleSaveWheel} disabled={isLoading} className="w-full h-12 text-lg">
                {t('settings.saveWheel')}
              </Button>

              {logoPreview && wheelId && <div className="border-t pt-4 md:pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {/* Left: QR Code */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="bg-white p-4 rounded-lg border">
                        <QRCodeSVG id="wheel-qr-code" value={getQrCodeUrl()} size={200} level="H" includeMargin={true} />
                      </div>
                      <p className="text-sm font-medium text-center">{t('settings.scanToPlay')}</p>
                      <p className="text-xs text-muted-foreground text-center break-all px-2">{getQrCodeUrl()}</p>
                    </div>

                    {/* Right: Options */}
                    <div className="space-y-4">
                      {/* Display Options */}
                      <div>
                        <h3 className="font-semibold text-base mb-3">{t('settings.displayOptions')}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            onClick={downloadEnglishPoster}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
                          >
                            <span className="inline-flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
                              <Download className="w-4 h-4 md:w-5 md:h-5" />
                              {t('settings.englishPoster')}
                            </span>
                          </Button>
                          <Button
                            onClick={downloadFrenchPoster}
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700 text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
                          >
                            <span className="inline-flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
                              <Download className="w-4 h-4 md:w-5 md:h-5" />
                              {t('settings.frenchPoster')}
                            </span>
                          </Button>
                        </div>
                      </div>

                      {/* Download Options */}
                      <div>
                        <h3 className="font-semibold text-base mb-3">{t('settings.downloadOptions')}</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={downloadQRCodeAsSVG}
                            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
                          >
                            <span className="inline-flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
                              <Download className="w-4 h-4 md:w-5 md:h-5" />
                              {t('settings.downloadSVG')}
                            </span>
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={downloadQRCodeAsPNG}
                            className="text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
                          >
                            <span className="inline-flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
                              <Download className="w-4 h-4 md:w-5 md:h-5" />
                              {t('settings.downloadPNG')}
                            </span>
                          </Button>
                        </div>
                      </div>

                      {/* Copy Link Button */}
                      <Button
                        variant="outline"
                        className="w-full text-sm md:text-base py-2 md:py-3"
                        onClick={copyLinkToClipboard}
                      >
                        <span className="inline-flex items-center gap-1.5 md:gap-2 whitespace-nowrap">
                          <Copy className="w-4 h-4 md:w-5 md:h-5" />
                          {t('settings.copyLink')}
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>}
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('settings.previewGame')}</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center gap-6 py-6">
            {/* Wheel Preview - Identical to WheelGame */}
            <div className="relative w-[90vw] h-[90vw] max-w-[380px] max-h-[380px]">
              {/* Pointer (triangle en haut, sur le bord) */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-10" style={{
              width: 0,
              height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: `28px solid ${mainColors.color1}`,
              filter: `drop-shadow(0 0 8px ${mainColors.color1}70) drop-shadow(0 0 16px ${mainColors.color1}50)`
            }} />

              {/* Wheel */}
              <div className="relative w-full h-full rounded-full overflow-hidden" style={{
              border: `8px solid ${mainColors.color1}`,
              boxShadow: `0 0 35px ${mainColors.color1}40, 0 0 90px ${mainColors.color1}25, inset 0 0 30px ${mainColors.color1}10`,
              background: `conic-gradient(${mainColors.color3} 0deg 45deg, ${mainColors.color2} 45deg 90deg, ${mainColors.color3} 90deg 135deg, ${mainColors.color2} 135deg 180deg, ${mainColors.color3} 180deg 225deg, ${mainColors.color2} 225deg 270deg, ${mainColors.color3} 270deg 315deg, ${mainColors.color2} 315deg 360deg)`
            }}>
                {/* Canvas lines */}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{
                zIndex: 3
              }} />

                {/* Lot labels */}
                {lots.filter(lot => lot.name.trim() !== '').map((lot, index) => {
                const angle = index * 360 / 8 - 90 + 360 / 8 / 2;
                const radius = 108;
                const x = Math.cos(angle * Math.PI / 180) * radius;
                const y = Math.sin(angle * Math.PI / 180) * radius;
                return <div key={index} className="absolute top-1/2 left-1/2 pointer-events-none" style={{
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                  zIndex: 2,
                  width: '100px'
                }}>
                      <div className="text-[15px] sm:text-[17px] font-bold text-black text-center px-1 leading-tight break-words font-poppins">
                        {lot.name}
                      </div>
                    </div>;
              })}

                {/* Center hole for logo - scaled to fit inner circular content */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[75px] h-[75px] rounded-full flex items-center justify-center overflow-hidden" style={{
                background: logoBackgroundColor,
                border: `3px solid ${mainColors.color1}`,
                boxShadow: `0 0 10px ${mainColors.color1}50, inset 0 2px 8px ${mainColors.color1}20`,
                zIndex: 4
              }}>
                  {logoPreview && (
                    <img 
                      src={logoPreview} 
                      alt="Logo" 
                      className="w-[140%] h-[140%] object-cover" 
                      style={{ objectPosition: 'center' }}
                    />
                  )}
                </div>
              </div>

              {/* Neon halo */}
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{
              background: `radial-gradient(circle at 50% 50%, ${mainColors.color1}15, transparent 70%)`,
              boxShadow: `0 0 40px ${mainColors.color1}60, 0 0 120px ${mainColors.color1}35`
            }} />
            </div>

            {/* Info */}
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold">{businessName}</p>
              <p className="text-sm text-muted-foreground">
                {t('settings.previewDescription')}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>;
}