import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { API_BASE_URL } from '@/config/api';
import { useTranslation } from '@/components/TranslationProvider';

type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState<VerificationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');

      if (!token) {
        setStatus('error');
        setErrorMessage(t('invalidVerificationLink') || 'Invalid verification link');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/user/verify-email/${token}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
        } else {
          if (data.error?.includes('expired')) {
            setStatus('expired');
            setErrorMessage(t('verificationLinkExpired') || 'Verification link has expired');
          } else {
            setStatus('error');
            setErrorMessage(data.error || t('verificationFailed') || 'Verification failed');
          }
        }
      } catch (error) {
        setStatus('error');
        setErrorMessage(t('verificationFailed') || 'Verification failed. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, t]);

  const handleGoToLogin = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-background p-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img 
            src="/lovable-uploads/revwheel-logo.webp" 
            alt="RevWheel logo" 
            className="h-12 w-auto" 
          />
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <>
            <div className="flex justify-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('verifyingEmail') || 'Vérification en cours...'}
              </h1>
              <p className="text-muted-foreground">
                {t('pleaseWait') || 'Veuillez patienter pendant que nous vérifions votre email.'}
              </p>
            </div>
          </>
        )}

        {/* Success State */}
        {status === 'success' && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('emailVerified') || 'Email vérifié avec succès !'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t('emailVerifiedDescription') || 'Votre compte a été activé. Vous pouvez maintenant vous connecter et accéder à toutes les fonctionnalités de RevWheel.'}
              </p>
              <Button onClick={handleGoToLogin} className="w-full" size="lg">
                {t('goToLogin') || 'Se connecter'}
              </Button>
            </div>
          </>
        )}

        {/* Error State */}
        {status === 'error' && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('verificationError') || 'Erreur de vérification'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {errorMessage}
              </p>
              <Button onClick={handleGoToLogin} variant="outline" className="w-full" size="lg">
                {t('backToHome') || "Retour à l'accueil"}
              </Button>
            </div>
          </>
        )}

        {/* Expired State */}
        {status === 'expired' && (
          <>
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center">
                <XCircle className="w-12 h-12 text-orange-600" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t('linkExpired') || 'Lien expiré'}
              </h1>
              <p className="text-muted-foreground mb-6">
                {t('linkExpiredDescription') || 'Ce lien de vérification a expiré. Veuillez vous inscrire à nouveau ou demander un nouveau lien de vérification.'}
              </p>
              <Button onClick={handleGoToLogin} variant="outline" className="w-full" size="lg">
                {t('backToHome') || "Retour à l'accueil"}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

