import { Card, CardContent } from "@/components/ui/card";
import starIcon from "@/assets/star-icon.webp";
import { useLanguage } from "@/contexts/LanguageContext";

interface ClientPopupProps {
  count: number;
}

export function ClientPopup({ count }: ClientPopupProps) {
  const { t } = useLanguage();
  const plural = count > 1 ? t('reviewAlert.newReviews') : t('reviewAlert.newReview');
  const message = t('reviewAlert.message')
    .replace('{count}', count.toString())
    .replace('{plural}', plural);
  
  return (
    <Card aria-live="polite" className="w-fit border-border shadow-lg">
      <CardContent className="p-4 flex items-start gap-3">
        <img src={starIcon} alt="Star" className="w-8 h-8 mt-2" />
        <div>
          <h3 className="font-bold text-foreground text-lg">{t('reviewAlert.title')}</h3>
          <p className="text-muted-foreground text-sm">
            {message}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
