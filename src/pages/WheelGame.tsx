import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import instagramIcon from '@/assets/instagram.webp';
import googleReviewIcon from '@/assets/google-review.webp';
import tiktokIcon from '@/assets/tiktok.webp';
import axios from 'axios';

const API_URL = "https://api.revwheel.fr/api";

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

export default function WheelGame() {
  const { wheelId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Lot | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);
  const [config, setConfig] = useState<WheelConfig | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [showCongratulationsPopup, setShowCongratulationsPopup] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSpinningRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wheelOwner, setWheelOwner] = useState<any>(null);
  const [isSubscriptionExpired, setIsSubscriptionExpired] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  
  // Check subscription status helper function
  const checkSubscriptionStatus = (userData: any) => {
    if (!userData || !userData.lastPaymentDate || !userData.subscriptionRemaining) {
      return false;
    }

    const lastPaymentDate = new Date(userData.lastPaymentDate);
    const currentDate = new Date();
    const daysSinceLastPayment = Math.floor((currentDate.getTime() - lastPaymentDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // If days since last payment is greater than subscription remaining, subscription is expired
    return daysSinceLastPayment > userData.subscriptionRemaining;
  };

  // Fetch wheel data from backend
  useEffect(() => {
    const fetchWheel = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_URL}/wheel/getSingleWheel/${wheelId}`
        );

        if (response.data.data) {
          const wheelData = response.data.data;
          setConfig({
            businessName: wheelData.businessName,
            googleReviewLink: wheelData.googleReviewLink,
            socialMediaLink: wheelData.socialMediaLink,
            customerInstruction: wheelData.customerInstruction,
            mainColors: wheelData.mainColors,
            lots: wheelData.lots,
            logoUrl: wheelData.logoUrl
          });
          setLogoPreview(wheelData.logoUrl);
          
          // Fetch user data after getting wheel data
          if (wheelData.userId) {
            setIsCheckingSubscription(true);
            try {
              const userResponse = await axios.get(
                `${API_URL}/user/getUserById/${wheelData.userId}`
              );
              
              if (userResponse.data.data) {
                setWheelOwner(userResponse.data.data);
                const isExpired = checkSubscriptionStatus(userResponse.data.data);
                setIsSubscriptionExpired(isExpired);
                
                if (isExpired) {
                  console.log("Wheel owner subscription is expired");
                  return;
                }
              }
            } catch (userErr) {
              console.error("Error fetching user data:", userErr);
              setIsSubscriptionExpired(false);
            } finally {
              setIsCheckingSubscription(false);
            }
          }
        } else {
          setError("Wheel not found");
        }
      } catch (err) {
        console.error("Error fetching wheel:", err);
        setError("Failed to load wheel game");
        toast({
          title: "Failed to load wheel game",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (wheelId) {
      fetchWheel();
    }
  }, [wheelId, toast]);

  // Update wheel scan count when page loads - only if subscription is not expired
  useEffect(() => {
    const updateScanCount = async () => {
      try {
        if (wheelId && !isSubscriptionExpired) {
          await axios.put(`${API_URL}/wheel/updateWheelScans/${wheelId}`);
          console.log("Wheel scan count updated");
        }
      } catch (err) {
        console.error("Error updating wheel scan count:", err);
      }
    };

    updateScanCount();
  }, [wheelId, isSubscriptionExpired]);

  const displayLots = config?.lots.filter(lot => lot.name.trim() !== '') || [];

  // Draw wheel lines on canvas
  useEffect(() => {
    const drawWheelLines = () => {
      const canvas = canvasRef.current;
      if (!canvas || !config) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const size = canvas.width = canvas.offsetWidth;
      canvas.height = size;
      const center = size / 2;
      const sections = 8;
      const angleStep = (2 * Math.PI) / sections;

      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = `${config.mainColors.color1}30`;
      ctx.lineWidth = 2;

      for (let i = 0; i < sections; i++) {
        const angle = i * angleStep;
        const x = center + Math.cos(angle) * center;
        const y = center + Math.sin(angle) * center;

        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    drawWheelLines();
    window.addEventListener('resize', drawWheelLines);
    
    return () => {
      window.removeEventListener('resize', drawWheelLines);
    };
  }, [config]);


  
  const handlePlayClick = () => {
    // Open Google Review link
    if (config?.googleReviewLink) {
      window.open(config.googleReviewLink, '_blank');
    }
    
    setShowInstructions(false);
    setShowReviewPopup(true);
    
    // After 9 seconds, close review popup
    setTimeout(() => {
      setShowReviewPopup(false);
    }, 9000);
  };

  const scrollToForm = () => {
    // Prevent spam clicks
    if (isSpinning || isSpinningRef.current) return;
    
    // If form is already filled and valid, verify and spin the wheel
    if (isFormValid) {
      if (!email.includes('@')) {
      toast({
        title: "Oups ! Il manque un \"@\" dans ton adresse e-mail 😅",
        variant: "destructive",
        duration: 5000,
        className: "!z-[9999999]"
      });
        return;
      }
      // Call the verification handler which will verify and then spin
      handleSpinFromForm();
      return;
    }
    // Otherwise scroll to form
    const formElement = document.getElementById('wheel-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToWheel = () => {
    const wheelElement = document.getElementById('wheel-container');
    if (wheelElement) {
      wheelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const isFormValid = firstName && email && phone && acceptTerms;

  const handleSpinFromForm = async () => {
    // Prevent spam clicks
    if (isSpinning || isSpinningRef.current) return;
    
    if (!email.includes('@')) {
      toast({
        title: "Oups ! Il manque un \"@\" dans ton adresse e-mail 😅",
        variant: "destructive",
        duration: 5000,
        className: "!z-[9999999]"
      });
      return;
    }
    if (!isFormValid) return;
    
    // Verify user with backend
    if (!acceptTerms) {
      toast({
        title: language === 'fr' 
          ? "Veuillez accepter les conditions de partage d'informations"
          : "Please agree to the information sharing terms",
        variant: "destructive",
      });
      return;
    }

    try {
      const userData = {
        firstName,
        email,
        phone,
        wheelId,
      };

      console.log("Verifying user with backend:", userData);
      const response = await axios.post(
        `${API_URL}/customer/verify`,
        userData
      );

      console.log("Verification response:", response.data);

      if (response.data && response.data.verified) {
        toast({
          title: language === 'fr'
            ? "Vérification réussie ! Vous pouvez maintenant jouer."
            : "Verification successful! You can now play.",
        });

        console.log("User verified successfully, setting isVerified to true");
        setIsVerified(true);
        scrollToWheel();
        setTimeout(() => {
          console.log("Starting wheel spin with verified user...");
          // Pass true as second parameter to indicate user is verified
          spinWheel(true, true);
        }, 500);
      } else {
        console.warn("Verification failed - response not verified");
      }
    } catch (err: any) {
      console.error("Error verifying user:", err);
      
      if (err.response && err.response.data && err.response.data.error) {
        const errorMsg = err.response.data.error;
        
        if (errorMsg === "Email already registered") {
          toast({
            title: language === 'fr'
              ? "Cet email est déjà enregistré ! Veuillez utiliser une adresse différente."
              : "This email is already registered! Please use a different email.",
            variant: "destructive",
          });
        } else if (errorMsg === "Phone number already registered") {
          toast({
            title: language === 'fr'
              ? "Ce numéro de téléphone est déjà enregistré ! Veuillez utiliser un numéro différent."
              : "This phone number is already registered! Please use a different number.",
            variant: "destructive",
          });
        } else {
          toast({
            title: language === 'fr' ? `Erreur: ${errorMsg}` : `Error: ${errorMsg}`,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: language === 'fr'
            ? "Échec de la vérification. Veuillez réessayer."
            : "Verification failed. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const spinWheel = (forceStart = false, userVerified = false) => {
    console.log("spinWheel called with:", {
      forceStart,
      userVerified,
      isSpinning,
      isVerified,
      firstName,
      email,
      phone,
      wheelId
    });

    if (isSpinning || isSpinningRef.current) return;
    if (!forceStart && !isVerified && !userVerified) return;
    
    // Capture user data at spin time to ensure it's available in the closure
    const capturedUserData = {
      firstName,
      email,
      phone,
      wheelId,
      verified: userVerified || isVerified
    };

    console.log("Captured user data for this spin:", capturedUserData);

    setIsSpinning(true);
    isSpinningRef.current = true;
    setResult(null);
    
    const totalOdds = displayLots.reduce((sum, lot) => sum + (parseInt(lot.odds) || 1), 0);
    let randomValue = Math.random() * totalOdds;
    let winner = 0;
    
    for (let i = 0; i < displayLots.length; i++) {
      randomValue -= (parseInt(displayLots[i].odds) || 1);
      if (randomValue <= 0) {
        winner = i;
        break;
      }
    }
    
    const segmentSize = 360 / displayLots.length;
    const rotations = 5 + Math.floor(Math.random() * 5);
    // Calculate target angle - align winner segment to top (0 degrees)
    const targetAngle = winner * segmentSize + (segmentSize / 2);
    const spinDegrees = (360 * rotations) + (360 - targetAngle);
    const randomOffset = Math.random() * (segmentSize * 0.2) - (segmentSize * 0.1);
    const targetRotation = rotationDegrees + spinDegrees + randomOffset;
    
    setRotationDegrees(targetRotation);
    
    try {
      const spinSound = new Audio();
      spinSound.src = "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3";
      spinSound.volume = 0.5;
      spinSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) {
      console.log("Audio play failed:", e);
    }
    
    setTimeout(async () => {
      const winningResult = displayLots[winner];
      setResult(winningResult);
      setIsSpinning(false);
      isSpinningRef.current = false;
      setShowCongratulationsPopup(true);
      
      // Trigger confetti if won (not "Perdu" or "Lost")
      const prizeName = winningResult.name.toLowerCase();
      if (!prizeName.includes('perdu') && !prizeName.includes('lost')) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      // Save customer data with prize information to backend using captured data
      try {
        console.log("=== ATTEMPTING TO SAVE CUSTOMER DATA ===");
        console.log("Captured user data:", capturedUserData);
        console.log("Prize:", winningResult.name);

        if (capturedUserData.wheelId && capturedUserData.verified && 
            capturedUserData.firstName && capturedUserData.email && capturedUserData.phone) {
          
          const customerData = {
            firstName: capturedUserData.firstName,
            email: capturedUserData.email,
            phone: capturedUserData.phone,
            wheelId: capturedUserData.wheelId,
            prize: winningResult.name || "No Prize",
          };

          console.log("Sending customer data to backend:", customerData);
          console.log("API URL:", `${API_URL}/customer/create`);
          
          const response = await axios.post(`${API_URL}/customer/create`, customerData);
          console.log("✅ User data saved successfully:", response.data);
        } else {
          console.error("❌ Cannot save customer data - missing required fields:", {
            hasWheelId: !!capturedUserData.wheelId,
            hasVerified: !!capturedUserData.verified,
            hasFirstName: !!capturedUserData.firstName,
            hasEmail: !!capturedUserData.email,
            hasPhone: !!capturedUserData.phone
          });
        }
      } catch (err: any) {
        console.error("❌ Error saving user data with prize:", err);
        console.error("Error details:", err.response?.data || err.message);
      }
    }, 4700);
  };
  
  if (isLoading || isCheckingSubscription) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
          <p className="text-xl font-medium text-foreground">
            {isCheckingSubscription 
              ? (language === "fr" ? "Vérification de l'abonnement..." : "Checking subscription...")
              : (language === "fr" ? "Chargement de votre roue..." : "Loading your prize wheel...")
            }
          </p>
        </div>
      </div>
    );
  }

  // Show subscription expired interface
  if (isSubscriptionExpired && wheelOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center border-2 border-destructive">
          <div className="text-destructive text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {language === "fr" ? "Abonnement Expiré" : "Subscription Expired"}
          </h2>
          <p className="text-foreground mb-6">
            {language === "fr" 
              ? "Le propriétaire de cette roue a un abonnement expiré. Veuillez contacter le propriétaire pour renouveler son abonnement."
              : "The owner of this wheel has an expired subscription. Please contact the owner to renew their subscription."
            }
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            {language === "fr" ? "Retour à l'accueil" : "Go Home"}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card p-8 rounded-xl shadow-lg max-w-md w-full text-center border-2 border-destructive">
          <div className="text-destructive text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Wheel Not Found
          </h2>
          <p className="text-foreground mb-6">
            Sorry, we couldn't find the prize wheel you're looking for.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const translations = {
    fr: {
      howItWorks: "Comment ca marche 😍",
      step1: "Vous allez être redirigé vers notre page Google",
      step2: config?.customerInstruction || "Donnez-nous un avis ⭐",
      step3: "Revenez sur cet onglet et profitez de vos cadeaux 🎁",
      playButton: "À vous de jouer !",
      gameRules: "Règles du Jeu",
      spinWheel: "Jouer",
      spinning: "TOURNE...",
      congratulations: "FÉLICITATIONS !",
      lostTitle: "Dommage ! 😅",
      lostMessage: "Cette fois-ci, c'est perdu…",
      promoCode: "Code Promo :",
      leaveReview: "Laisser un avis",
      dropLogo: "Déposez\nvotre logo",
      awaitingValidation: "En attente de validation...",
      leaveReviewAndWin: "Laissez-nous un avis et gagnez le gros lot",
      verificationRequired: "Vérification Requise",
      verificationSubtitle: "Veuillez entrer vos coordonnées pour participer au jeu de la roue",
      firstName: "Prénom",
      emailLabel: "E-mail",
      phoneLabel: "Téléphone",
      acceptOffers: "J'accepte de recevoir les offres de",
      unsubscribeNote: "avec possibilité de me désinscrire à tout moment.",
      verify: "Vérifier",
      cancel: "Annuler",
      youWon: "Vous avez gagné:",
      retrievePrize: "Vous pourrez récupérer votre lot lors de votre prochaine visite chez",
      close: "Fermer",
      wheelTitle: "Fais tourner la roue 🔥",
      wheelSubtitle: "dis-nous qui tu es pour qu'on te régale",
      launchWheel: "Lancer la roue"
    },
    en: {
      howItWorks: "How it works😍",
      step1: "You will be redirected to our Google page",
      step2: config?.customerInstruction || "Donnez-nous un avis ⭐",
      step3: "Come back to this tab and enjoy your gifts 🎁",
      playButton: "Let's play!",
      gameRules: "Game Rules",
      spinWheel: "Play",
      spinning: "SPINNING...",
      congratulations: "CONGRATULATIONS!",
      lostTitle: "Too bad! 😅",
      lostMessage: "This time, you lost…",
      promoCode: "Promo Code:",
      leaveReview: "Leave a Review",
      dropLogo: "Drop your\nlogo here",
      awaitingValidation: "Awaiting validation...",
      leaveReviewAndWin: "Leave us a review and win the grand prize",
      verificationRequired: "Verification Required",
      verificationSubtitle: "Please enter your details to participate in the wheel game",
      firstName: "First Name",
      emailLabel: "Email",
      phoneLabel: "Phone",
      acceptOffers: "I agree to receive offers from",
      unsubscribeNote: "with the option to unsubscribe at any time.",
      verify: "Verify",
      cancel: "Cancel",
      youWon: "You won:",
      retrievePrize: "You can claim your prize on your next visit to",
      close: "Close",
      wheelTitle: "Spin the wheel 🔥",
      wheelSubtitle: "Tell us who you are so we can treat you.",
      launchWheel: "Spin the wheel"
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen flex items-center justify-center p-2 relative overflow-hidden"
         style={{ 
           background: 'radial-gradient(circle at center, #ffffff 0%, hsl(var(--neon-bg)) 100%)'
         }}>
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setLanguage('fr')}
          className="w-8 h-6 rounded overflow-hidden border-2 transition-all"
          style={{
            borderColor: language === 'fr' ? config.mainColors.color1 : '#d1d5db',
            transform: language === 'fr' ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
            <rect width="900" height="600" fill="#ED2939"/>
            <rect width="600" height="600" fill="#fff"/>
            <rect width="300" height="600" fill="#002395"/>
          </svg>
        </button>
        <button
          onClick={() => setLanguage('en')}
          className="w-8 h-6 rounded overflow-hidden border-2 transition-all"
          style={{
            borderColor: language === 'en' ? config.mainColors.color1 : '#d1d5db',
            transform: language === 'en' ? 'scale(1.1)' : 'scale(1)'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30">
            <clipPath id="t">
              <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
            </clipPath>
            <path d="M0,0 v30 h60 v-30 z" fill="#00247d"/>
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#cf142b" strokeWidth="4"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
            <path d="M30,0 v30 M0,15 h60" stroke="#cf142b" strokeWidth="6"/>
          </svg>
        </button>
      </div>

      {/* Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-2xl p-6 max-w-md w-full shadow-card relative"
            >

              <h2 className="text-2xl font-bold text-center mb-6 font-poppins text-foreground">{t.howItWorks}</h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                    style={{ backgroundColor: config.mainColors.color1 }}
                  >
                    1
                  </div>
                  <p className="text-foreground font-poppins text-sm pt-1">{t.step1}</p>
                </div>

                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                    style={{ backgroundColor: config.mainColors.color1 }}
                  >
                    2
                  </div>
                  <p className="text-foreground font-poppins text-sm pt-1">{t.step2}</p>
                </div>

                <div className="flex items-start gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
                    style={{ backgroundColor: config.mainColors.color1 }}
                  >
                    3
                  </div>
                  <p className="text-foreground font-poppins text-sm pt-1">{t.step3}</p>
                </div>
              </div>

              {/* Social Icons */}
              <div className="flex justify-center items-center gap-6 mb-6">
                <img src={instagramIcon} alt="Instagram" className="w-12 h-12 object-contain" />
                <img src={googleReviewIcon} alt="Google Reviews" className="h-12 w-auto object-contain" />
                <img src={tiktokIcon} alt="TikTok" className="w-12 h-12 object-contain" />
              </div>

              <button
                onClick={handlePlayClick}
                className="w-full py-3 rounded-full font-bold transition-all mb-3 font-poppins"
                style={{ 
                  backgroundColor: config.mainColors.color1,
                  color: '#fff',
                  boxShadow: `0 10px 25px ${config.mainColors.color1}50`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = `0 10px 35px ${config.mainColors.color1}70`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 10px 25px ${config.mainColors.color1}50`;
                }}
              >
                {t.playButton}
              </button>

              <button 
                onClick={() => window.open('/terms', '_blank')}
                className="w-full text-center text-sm text-muted-foreground hover:text-foreground underline font-nunito"
              >
                {t.gameRules}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logo in top left corner - Absolute position, scrolls with page */}
      {logoPreview && (
        <div 
          style={{
            position: 'absolute',
            top: '8px',
            left: '24px',
            width: '90px',
            height: '90px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            zIndex: 10
          }}
        >
          <img 
            src={logoPreview} 
            alt="Logo" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
      )}

      <div className="flex flex-col items-center justify-center max-w-md mx-auto text-center">
        {/* Scroll to form button - moved above wheel */}
        <button
          className="px-8 py-3.5 font-bold rounded-full transition-all text-base relative overflow-hidden font-poppins flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-32 mb-16 cursor-pointer"
          style={{ 
            backgroundColor: config.mainColors.color1,
            color: '#fff',
            boxShadow: `0 10px 25px ${config.mainColors.color1}50`
          }}
          onClick={scrollToForm}
          disabled={isSpinning}
          onMouseEnter={(e) => {
            if (!isSpinning) {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = `0 10px 35px ${config.mainColors.color1}70`;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 10px 25px ${config.mainColors.color1}50`;
          }}
          onMouseDown={(e) => {
            if (!isSpinning) {
              e.currentTarget.style.transform = 'scale(0.97)';
            }
          }}
          onMouseUp={(e) => {
            if (!isSpinning) {
              e.currentTarget.style.transform = 'scale(1.05)';
            }
          }}
        >
          <span className="text-xl">🎯</span>
          {t.spinWheel}
        </button>

        {/* Wheel wrapper */}
        <div id="wheel-container" className="relative w-[90vw] h-[90vw] max-w-[380px] max-h-[380px]">
          {/* Pointer (triangle en haut, sur le bord) */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-3 z-10 pointer-events-none">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 32 32"
              style={{
                filter: `drop-shadow(0 0 8px ${config.mainColors.color1}70) drop-shadow(0 0 16px ${config.mainColors.color1}50)`,
                transform: 'rotate(180deg)',
                display: 'block'
              }}
            >
              <path
                d="M 16 4 L 28 28 L 16 24 L 4 28 Z"
                fill={config.mainColors.color1}
                stroke="#000000"
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Wheel */}
          <motion.div
            ref={wheelRef}
            className="relative w-full h-full rounded-full overflow-hidden"
            initial={{ rotate: 0 }}
            animate={{ rotate: rotationDegrees }}
            transition={{ 
              duration: isSpinning ? 4.6 : 0,
              ease: [0.1, 0.7, 0.1, 1],
              type: "tween"
            }}
            style={{
              border: `8px solid ${config.mainColors.color1}`,
              boxShadow: `0 0 35px ${config.mainColors.color1}40, 0 0 90px ${config.mainColors.color1}25, inset 0 0 30px ${config.mainColors.color1}10`,
              background: `conic-gradient(${config.mainColors.color3} 0deg 45deg, ${config.mainColors.color2} 45deg 90deg, ${config.mainColors.color3} 90deg 135deg, ${config.mainColors.color2} 135deg 180deg, ${config.mainColors.color3} 180deg 225deg, ${config.mainColors.color2} 225deg 270deg, ${config.mainColors.color3} 270deg 315deg, ${config.mainColors.color2} 315deg 360deg)`
            }}
          >
            {/* Canvas lines */}
            <canvas 
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 3 }}
            />

            {/* Lot labels */}
            {displayLots.map((lot, index) => {
              const angle = (index * 360 / displayLots.length) - 90 + (360 / displayLots.length / 2);
              const radius = 108;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                    zIndex: 2,
                    width: '100px',
                  }}
                >
                  <div 
                    className="text-[15px] sm:text-[17px] font-bold text-black text-center px-1 leading-tight break-words font-poppins"
                  >
                    {lot.name}
                  </div>
                </div>
              );
            })}

            {/* Center hole for logo */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(8px)',
                border: `3px solid ${config.mainColors.color1}30`,
                boxShadow: `inset 0 2px 8px ${config.mainColors.color1}20`,
                zIndex: 4
              }}
            >
              {logoPreview && (
                <img 
                  src={logoPreview} 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center' }}
                />
              )}
            </div>
          </motion.div>

          {/* Neon halo */}
          <div 
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${config.mainColors.color1}15, transparent 70%)`,
              boxShadow: `0 0 40px ${config.mainColors.color1}60, 0 0 120px ${config.mainColors.color1}35`
            }}
          />
        </div>

        {/* Form Section */}
        <div id="wheel-form" className="w-full max-w-md mt-12 bg-card rounded-2xl p-6 shadow-lg border-2 border-primary/20">
          <h3 className="text-2xl font-bold text-center mb-1 font-poppins text-foreground">
            {t.wheelTitle}
          </h3>
          <p className="text-sm text-center mb-4 text-foreground font-nunito font-semibold">
            {t.wheelSubtitle}
          </p>
          
          <div className="space-y-4">
            <input
              type="text"
              placeholder={t.firstName}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
            />
            <input
              type="email"
              placeholder={t.emailLabel}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
            />
            <input
              type="tel"
              placeholder={t.phoneLabel}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-nunito"
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 flex-shrink-0"
              />
              <label htmlFor="acceptTerms" className="text-[11px] text-muted-foreground font-nunito leading-relaxed max-w-[300px]">
                {t.acceptOffers} {config.businessName} {t.unsubscribeNote}
              </label>
            </div>
          </div>

          {/* Spin button */}
          <button
            onClick={handleSpinFromForm}
            className="w-full mt-6 py-3 rounded-full font-bold transition-all font-poppins disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            style={{ 
              backgroundColor: isFormValid ? config.mainColors.color1 : '#9ca3af',
              color: '#fff',
              boxShadow: isFormValid ? `0 10px 25px ${config.mainColors.color1}50` : 'none'
            }}
            disabled={!isFormValid || isSpinning}
          >
            <span className="text-xl">🎯</span>
            <span>{isSpinning ? t.spinning : t.launchWheel}</span>
          </button>
        </div>

        {/* Review Popup */}
        <AnimatePresence>
          {showReviewPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card rounded-2xl p-8 max-w-md w-full shadow-card relative text-center"
              >
                <h2 className="text-2xl font-bold mb-4 font-poppins text-foreground">{t.awaitingValidation}</h2>
                
                {/* Loading spinner */}
                <div className="w-16 h-16 mx-auto mb-6">
                  <div className="w-full h-full border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                </div>

                <p className="text-foreground font-nunito mb-6">{t.leaveReviewAndWin}</p>

                <a
                  href={config.googleReviewLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all font-poppins"
                  style={{ 
                    backgroundColor: config.mainColors.color1,
                    color: '#fff',
                    boxShadow: `0 10px 25px ${config.mainColors.color1}50`
                  }}
                >
                  <span className="w-5 h-5 bg-white rounded-full"></span>
                  {t.leaveReview}
                </a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>


        {/* Congratulations Popup */}
        <AnimatePresence>
          {showCongratulationsPopup && result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card rounded-2xl p-8 max-w-md w-full shadow-card relative text-center"
              >
                {/* Star icon */}
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: config.mainColors.color1,
                    boxShadow: `0 10px 25px ${config.mainColors.color1}50`
                  }}
                >
                  <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" />
                  </svg>
                </div>

                {result.name.toLowerCase().includes('perdu') || result.name.toLowerCase().includes('lost') ? (
                  <>
                    <h2 className="text-2xl font-bold mb-2 font-poppins" style={{ color: config.mainColors.color1 }}>
                      {t.lostTitle}
                    </h2>
                    <p className="text-lg font-bold mb-2 font-poppins text-foreground">
                      {t.lostMessage}
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold mb-2 font-poppins" style={{ color: config.mainColors.color1 }}>
                      {t.congratulations} 🎉
                    </h2>
                    <p className="text-lg font-bold mb-2 font-poppins text-foreground">
                      {t.youWon} <span style={{ color: config.mainColors.color1 }}>{result.name}</span>
                    </p>
                    <p className="text-sm text-muted-foreground font-nunito">
                      {t.retrievePrize} {config.businessName}.
                    </p>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-2 left-0 right-0 text-center mt-12">
        <a 
          href="https://revwheel.fr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground font-nunito hover:text-foreground transition-colors"
        >
          © 2025 Revwheel.fr All Rights Reserved.
        </a>
      </footer>
    </div>
  );
}
