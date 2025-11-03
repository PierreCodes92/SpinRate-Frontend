import { useState, useCallback } from 'react';

export type Language = 'fr' | 'en';

const translations = {
  fr: {
    // Header
    home: 'Accueil',
    pricing: 'Tarification',
    proSpace: 'Espace Pro',
    contact: 'Contact',
    blog: 'Blog',
    startFreeTrial: 'COMMENCER L\'ESSAI GRATUIT',
    
    // Notifications
    freeTrialActivated: 'Essai gratuit activé !',
    redirectingToAccount: 'Redirection vers la création de votre compte...',
    
    // Auth Modal
    login: 'Se connecter',
    register: 'S\'inscrire',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    forgotPassword: 'Mot de passe oublié ?',
    rememberMe: 'Se souvenir de moi',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    noAccountYet: 'Pas encore de compte ?',
    loginHere: 'Connectez-vous ici',
    registerHere: 'Inscrivez-vous ici',
    
    // Form labels and texts
    wheelReadyText: 'En seulement 4 clics, votre roue est prête.',
    fullName: 'Nom complet',
    emailAddress: 'Adresse e-mail',
    phoneNumber: 'Numéro de téléphone',
    passwordField: 'Mot de passe',
    
    // Contact page
    contactTitle: 'Contact',
    contactQuestion: 'Une question ? Contactez-nous :',
    contactSchedule: 'Ou prenez un rendez-vous gratuit et rapide',
    contactScheduleSubtext: 'pour en discuter directement.',
    scheduleCall: 'Planifier un appel',
    
    // NotFound page
    pageNotFound: 'Oops! Page introuvable',
    returnToHome: 'Retour à l\'accueil',
    
    // Blog page
    blogTitle: 'Blog',
    comingSoon: 'Arrive bientôt',
    blogSubtext: 'Nous préparons du contenu exclusif pour vous aider à maximiser vos avis Google et fidéliser vos clients.',
    
    // Footer
    footerDescription: 'La solution parfaite pour collecter des avis Google positifs et booster votre visibilité locale.',
    navigation: 'Navigation',
    getStarted: 'Commencer',
    readyToBoost: 'Prêt à booster vos avis Google ?',
    contactUs: 'Contactez-nous',
    allRightsReserved: 'Tous droits réservés.',
    termsOfService: 'Conditions d\'utilisation',
    privacyPolicy: 'Politique de confidentialité',
    legalNotices: 'Mentions légales',
    
    // FAQ
    faqTitle: 'Questions Fréquentes',
    faqSubtitle: 'Tout ce que vous devez savoir sur RevWheel',
    moreQuestions: 'Vous avez d\'autres questions ?',
    
    // BeforeAfter Section
    in7DaysWith: 'En 7 jours avec',
    googleReviewsEffortless: 'Gagnez des avis Google',
    withoutEffort: 'sans effort',
    collectClientContacts: 'Récupérez les coordonnées clients',
    emailsAndPhones: 'emails et téléphones pour vos campagnes',
    bringBackClients: 'Faites revenir vos clients',
    thanksToWonPrizes: 'grâce aux lots gagnés',
    startNow: 'Commencer maintenant',
    
    // Benefits Section
    retainClientsSimply: 'Fidélisez vos clients',
    simply: 'simplement',
    reviewsPerMonth: 'avis par mois',
    gainOnRating: 'gain sur leur note',
    satisfied: 'satisfaits',
    with7DaysFree: 'avec 7 jours offert',
    startHere: 'Commencer ici',
    
    // Hero Section
    collectGoogleReviews: 'Collectez des Avis Google',
    effortlessly: '(sans effort)',
    bestSolutionForReviews: 'La meilleure solution pour avoir des avis positifs sur Google de la part de tous vos clients pour être premier dans les recherches.',
    tryFreeDesktop: 'Essayez gratuitement',
    tryFreeMobile: 'Essayez gratuitement',
    sevenDaysFree: '7 jours gratuits',
    noCreditCard: 'Pas de CB requise',
    noCommitment: 'Sans Engagement',
    setupIn5Min: 'Mise en place en 5min',
    
    // Stats Section
    reviewsObtainedToday: 'Le nombre d\'avis obtenus par nos clients aujourd\'hui',
    
    // Process Section
    explodeGoogleReviews: 'Faites exploser vos avis Google',
    doingNothing: 'sans rien faire',
    configureWheel: 'Configurez votre roue',
    generatePosterAuto: 'on vous génère automatiquement une affiche.',
    exposeQRPoster: 'Exposez l\'affiche QR Code',
    accessibleToClients: 'à portée de vos clients : comptoir, tables, WC.',
    letClientsScan: 'Laissez vos clients scanner',
    reviewChanceWin: 'un avis laissé, une chance de remporter un cadeau.',
    outCompeteRivals: 'Devancez vos concurrents',
    googleFavorsReviews: 'Google met en avant les commerces avec le plus d\'avis.',
    sevenDaysFreeCTA: '7 jours gratuits',
    
    // Pricing Section
    satisfiedOrRefunded: 'Satisfait ou',
    refunded: 'Remboursé',
    monthly: 'Mensuel',
    annualSavings: 'Annuel -25% d\'économie',
    perMonth: 'par mois',
    setupIn5Minutes: 'Configuration en 5 minutes',
    boostGoogleReviews: 'Booster vos avis Google',
    customWheel: 'Votre roue sur-mesure',
    customPosterQR: 'Votre affiche personnalisée avec QR Code',
    performanceTracking: 'Suivi des performances',
    dataExtraction: 'Extraction des données (email/tél.)',
    customerSupport247: 'Support Client 7/7j',
    noCommitmentFee: 'Sans engagement',
    noSetupFee: 'Sans frais de mise en service',
    noTerminationFee: 'Sans frais de résiliation',
    startNowCTA: 'Démarrer maintenant',
    merchantsInFrance: 'Commerçants en France',
    reviewsCollected: 'Avis collectés',
    averageRating: 'Note moyenne clients',
    
    // Testimonials Section
    theyTrustUs: 'Ils nous font',
    trust: 'confiance',
    
    // Video Player
    watchTheRest: 'Écouter la suite',
    
    // Testimonials
    testimonial1Name: 'Marie D.',
    testimonial1Business: 'Gérant, Le Bistrot Parisien',
    testimonial1Text: 'Nos clients laissent enfin des avis sans qu\'on ait besoin de leur demander. Et en plus, ils reviennent pour tenter leur chance à la roue ! RevWheel est un vrai game-changer.',
    testimonial2Name: 'Sophie L.',
    testimonial2Business: 'Directrice, Café de la Plage',
    testimonial2Text: 'Notre score Google a explosé en quelques semaines ! Le système de récompenses motive vraiment les clients, et nous avons récupéré des centaines d\'emails pour nos campagnes marketing.',
    testimonial3Name: 'Jérôme M.',
    testimonial3Business: 'Gérant, Burger Avenue',
    testimonial3Text: 'Grâce à RevWheel, nous avons triplé nos avis Google en un mois ! Les clients adorent le concept du jeu et reviennent plus souvent. Simple et efficace !',
    
    // FAQ Questions & Answers
    faq1Question: 'Cela fonctionnera-t-il pour mon entreprise (restaurant, salon de coiffure, boutique, café, hôtel, etc.) ?',
    faq1Answer: 'Absolument ! RevWheel est conçu pour tout type d\'entreprise locale ou de commerce de proximité. Tant que vos clients ont un téléphone, vous êtes prêt à démarrer.',
    faq2Question: 'Pourquoi choisir RevWheel ?',
    faq2Answer: 'C\'est simple : RevWheel vous aide à augmenter l\'engagement, la fidélisation et la visibilité de vos clients avec un minimum d\'effort.\n\nAugmentez vos avis Google sans même avoir à demander — les clients laissent un avis pour accéder à la roue, ce qui améliore instantanément votre visibilité en ligne.\n\nFaites revenir vos clients et attirez-en de nouveaux — chaque réclamation de prix génère du trafic : les clients reviennent pour récupérer leur gain, consomment à nouveau ou reviennent accompagnés. Résultat : plus de visites, plus de ventes, plus d\'avis.\n\nCollectez des données précieuses à chaque spin — emails, numéros de téléphone, profils clients... Idéal pour les recontacter lors de vos événements, promotions ou campagnes marketing et les inciter à revenir.\n\nTableau de bord analytique : visualisez vos performances en un coup d\'œil et suivez les métriques clés (scans de QR codes, prix distribués, taux de rédemption, profils enrichis). Utilisez ces insights pour affiner vos stratégies marketing et commerciales.\n\nJuste et sécurisé : un seul spin par client — pas de triche, pas d\'abus.',
    faq3Question: 'Comment l\'installer ?',
    faq3Answer: 'C\'est super simple. Créez votre compte RevWheel, personnalisez votre roue à prix, et téléchargez votre QR code. Collez le QR code sur un poster dans votre magasin, et le tour est joué !',
    faq4Question: 'Puis-je personnaliser la roue ?',
    faq4Answer: 'Oui – entièrement. Vous pouvez modifier les couleurs, les prix, les probabilités de prix, le texte, le logo, et plus encore. Vous avez un contrôle total sur ce que dit votre roue et les récompenses que vous proposez.',
    faq5Question: 'Les clients doivent-ils installer une application ?',
    faq5Answer: 'Non. Tout fonctionne directement dans le navigateur. Les clients n\'ont qu\'à scanner le QR code avec leur téléphone, et l\'expérience RevWheel commence immédiatement.',
    faq6Question: 'Quelles données est-ce que je collecte ?',
    faq6Answer: 'Vous collectez les prénoms, adresses e-mail et numéros de téléphone à chaque spin. Vous pouvez également enrichir ces données plus tard en ajoutant des informations comme des dates de naissance, des préférences, ou l\'historique des visites pour améliorer vos campagnes marketing.',
    faq7Question: 'Puis-je suivre les résultats ?',
    faq7Answer: 'Bien sûr. Votre tableau de bord affiche toutes les statistiques clés en un seul endroit. Vous pouvez suivre les scans des QR codes, les avis laissés, les prix distribués, les taux de rédemption, les comptes créés, et les profils clients enrichis. Vous pouvez également exporter vos données à tout moment pour créer des campagnes et ramener vos clients.',
    faq8Question: 'Est-ce que ça fonctionne sur mobile ?',
    faq8Answer: 'Absolument. RevWheel est conçu en priorité pour mobile et fonctionne parfaitement sur les smartphones.',
    faq9Question: 'Les clients vont-ils faire tourner la roue à chaque fois ?',
    faq9Answer: 'Non, chaque e-mail et numéro de téléphone ne peuvent être utilisés qu\'une seule fois. Si un client essaie de tourner la roue avec les mêmes informations, cela ne fonctionnera pas. Cela garantit l\'équité et la sécurité. Une fois qu\'ils ont tourné la roue, ils doivent entrer leur prénom, et si nécessaire, vous pouvez toujours vérifier leur identité lorsqu\'ils viennent réclamer leur prix.',
    faq10Question: 'Est-ce conforme au RGPD ?',
    faq10Answer: 'Oui ! Nous veillons à ce que vous soyez conforme. Chaque client doit accepter vos conditions avant de soumettre ses informations.',
    faq11Question: 'Comment les clients réclament-ils leur prix ?',
    faq11Answer: 'Lors de leur prochaine visite, les clients peuvent facilement réclamer leur lot. Il vous suffit de vous connecter à RevWheel, d\'accéder à l\'onglet "Clients", puis de retrouver la personne — soit directement, soit en effectuant une recherche par prénom, numéro de téléphone ou e-mail. Vous verrez immédiatement si un lot a été gagné, et lequel. Il ne vous reste plus qu\'à le marquer comme "récupéré" grâce à notre fonctionnalité dédiée en un clic… et c\'est terminé !',
    faq12Question: 'Puis-je le traduire ?',
    faq12Answer: 'Oui – à 100%. Tout le texte de l\'application est modifiable, vous pouvez donc l\'utiliser en français ou anglais.',
  },
  en: {
    // Header
    home: 'Home',
    pricing: 'Pricing',
    proSpace: 'Pro Space',
    contact: 'Contact',
    blog: 'Blog',
    startFreeTrial: 'START FREE TRIAL',
    
    // Notifications
    freeTrialActivated: 'Free trial activated!',
    redirectingToAccount: 'Redirecting to your account creation...',
    
    // Auth Modal
    login: 'Login',
    register: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot password?',
    rememberMe: 'Remember me',
    alreadyHaveAccount: 'Already have an account?',
    noAccountYet: 'No account yet?',
    loginHere: 'Login here',
    registerHere: 'Sign up here',
    
    // Form labels and texts
    wheelReadyText: 'In just 4 clicks, your wheel is ready.',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    phoneNumber: 'Phone Number',
    passwordField: 'Password',
    
    // Contact page
    contactTitle: 'Contact',
    contactQuestion: 'Have a question? Contact us:',
    contactSchedule: 'Or schedule a free and quick appointment',
    contactScheduleSubtext: 'to discuss it directly.',
    scheduleCall: 'Schedule a Call',
    
    // NotFound page
    pageNotFound: 'Oops! Page not found',
    returnToHome: 'Return to Home',
    
    // Blog page
    blogTitle: 'Blog',
    comingSoon: 'Coming Soon',
    blogSubtext: 'We are preparing exclusive content to help you maximize your Google reviews and build customer loyalty.',
    
    // Footer
    footerDescription: 'The perfect solution to collect positive Google reviews and boost your local visibility.',
    navigation: 'Navigation',
    getStarted: 'Get Started',
    readyToBoost: 'Ready to boost your Google reviews?',
    contactUs: 'Contact Us',
    allRightsReserved: 'All rights reserved.',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    legalNotices: 'Legal Notices',
    
    // FAQ
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know about RevWheel',
    moreQuestions: 'Do you have more questions?',
    
    // BeforeAfter Section
    in7DaysWith: 'In 7 days with',
    googleReviewsEffortless: 'Get Google reviews',
    withoutEffort: 'effortlessly',
    collectClientContacts: 'Collect client contacts',
    emailsAndPhones: 'emails and phones for your campaigns',
    bringBackClients: 'Bring back your clients',
    thanksToWonPrizes: 'thanks to won prizes',
    startNow: 'Start Now',
    
    // Benefits Section
    retainClientsSimply: 'Retain your clients',
    simply: 'simply',
    reviewsPerMonth: 'reviews per month',
    gainOnRating: 'gain on their rating',
    satisfied: 'satisfied',
    with7DaysFree: 'with 7 days free',
    startHere: 'Start Here',
    
    // Hero Section
    collectGoogleReviews: 'Get Google Reviews',
    effortlessly: '(effortlessly)',
    bestSolutionForReviews: 'The best solution to get positive Google reviews from all your customers and be first in searches.',
    tryFreeDesktop: 'Try for free',
    tryFreeMobile: 'Try for free',
    sevenDaysFree: '7 days free',
    noCreditCard: 'No credit card required',
    noCommitment: 'No commitment',
    setupIn5Min: '5min setup',
    
    // Stats Section
    reviewsObtainedToday: 'Number of reviews obtained by our customers today',
    
    // Process Section
    explodeGoogleReviews: 'Explode your Google reviews',
    doingNothing: 'without doing anything',
    configureWheel: 'Configure your wheel',
    generatePosterAuto: 'we automatically generate a poster for you.',
    exposeQRPoster: 'Display QR Code poster',
    accessibleToClients: 'within reach of your customers: counter, tables, restrooms.',
    letClientsScan: 'Let your customers scan',
    reviewChanceWin: 'a review left, a chance to win a gift.',
    outCompeteRivals: 'Outpace your competitors',
    googleFavorsReviews: 'Google highlights businesses with the most reviews.',
    sevenDaysFreeCTA: '7 days free',
    
    // Pricing Section
    satisfiedOrRefunded: 'Satisfied or',
    refunded: 'Refunded',
    monthly: 'Monthly',
    annualSavings: 'Annual -25% savings',
    perMonth: 'per month',
    setupIn5Minutes: '5-minute setup',
    boostGoogleReviews: 'Boost your Google reviews',
    customWheel: 'Your custom wheel',
    customPosterQR: 'Your personalized poster with QR Code',
    performanceTracking: 'Performance tracking',
    dataExtraction: 'Data extraction (email/phone)',
    customerSupport247: '24/7 Customer Support',
    noCommitmentFee: 'No commitment',
    noSetupFee: 'No setup fee',
    noTerminationFee: 'No termination fee',
    startNowCTA: 'Start Now',
    merchantsInFrance: 'Merchants in France',
    reviewsCollected: 'Reviews collected',
    averageRating: 'Average customer rating',
    
    // Testimonials Section
    theyTrustUs: 'They',
    trust: 'trust us',
    
    // Video Player
    watchTheRest: 'Watch the rest',
    
    // Testimonials
    testimonial1Name: 'Marie D.',
    testimonial1Business: 'Manager, Le Bistrot Parisien',
    testimonial1Text: 'Our customers finally leave reviews without us having to ask. Plus, they come back to try their luck at the wheel! RevWheel is a real game-changer.',
    testimonial2Name: 'Sophie L.',
    testimonial2Business: 'Director, Café de la Plage',
    testimonial2Text: 'Our Google score exploded in just a few weeks! The rewards system really motivates customers, and we\'ve collected hundreds of emails for our marketing campaigns.',
    testimonial3Name: 'Jérôme M.',
    testimonial3Business: 'Manager, Burger Avenue',
    testimonial3Text: 'Thanks to RevWheel, we tripled our Google reviews in one month! Customers love the game concept and come back more often. Simple and effective!',
    
    // FAQ Questions & Answers
    faq1Question: 'Will this work for my business (restaurant, hair salon, shop, café, hotel, etc.)?',
    faq1Answer: 'Absolutely! RevWheel is designed for any type of local business or neighborhood store. As long as your customers have a phone, you\'re ready to start.',
    faq2Question: 'Why choose RevWheel?',
    faq2Answer: 'It\'s simple: RevWheel helps you increase customer engagement, loyalty, and visibility with minimal effort.\n\nIncrease your Google reviews without even asking — customers leave a review to access the wheel, instantly improving your online visibility.\n\nBring your customers back and attract new ones — each prize claim generates traffic: customers return to collect their prize, consume again, or bring someone along. Result: more visits, more sales, more reviews.\n\nCollect valuable data with each spin — emails, phone numbers, customer profiles... Perfect for contacting them about your events, promotions, or marketing campaigns and encouraging them to return.\n\nAnalytics dashboard: visualize your performance at a glance and track key metrics (QR code scans, prizes distributed, redemption rates, enriched profiles). Use these insights to refine your marketing and sales strategies.\n\nFair and secure: one spin per customer — no cheating, no abuse.',
    faq3Question: 'How do I install it?',
    faq3Answer: 'It\'s super simple. Create your RevWheel account, customize your prize wheel, and download your QR code. Stick the QR code on a poster in your store, and you\'re done!',
    faq4Question: 'Can I customize the wheel?',
    faq4Answer: 'Yes – completely. You can modify the colors, prizes, prize probabilities, text, logo, and more. You have complete control over what your wheel says and the rewards you offer.',
    faq5Question: 'Do customers need to install an app?',
    faq5Answer: 'No. Everything works directly in the browser. Customers just need to scan the QR code with their phone, and the RevWheel experience starts immediately.',
    faq6Question: 'What data do I collect?',
    faq6Answer: 'You collect first names, email addresses, and phone numbers with each spin. You can also enrich this data later by adding information like birth dates, preferences, or visit history to improve your marketing campaigns.',
    faq7Question: 'Can I track the results?',
    faq7Answer: 'Of course. Your dashboard displays all key statistics in one place. You can track QR code scans, reviews left, prizes distributed, redemption rates, accounts created, and enriched customer profiles. You can also export your data at any time to create campaigns and bring back your customers.',
    faq8Question: 'Does it work on mobile?',
    faq8Answer: 'Absolutely. RevWheel is designed mobile-first and works perfectly on smartphones.',
    faq9Question: 'Will customers spin the wheel every time?',
    faq9Answer: 'No, each email and phone number can only be used once. If a customer tries to spin the wheel with the same information, it won\'t work. This ensures fairness and security. Once they\'ve spun the wheel, they must enter their first name, and if necessary, you can always verify their identity when they come to claim their prize.',
    faq10Question: 'Is it GDPR compliant?',
    faq10Answer: 'Yes! We ensure you\'re compliant. Each customer must accept your terms before submitting their information.',
    faq11Question: 'How do customers claim their prize?',
    faq11Answer: 'On their next visit, customers can easily claim their prize. Just log into RevWheel, access the "Customers" tab, then find the person — either directly or by searching by first name, phone number, or email. You\'ll immediately see if a prize was won and which one. All you have to do is mark it as "collected" with our dedicated one-click feature… and you\'re done!',
    faq12Question: 'Can I translate it?',
    faq12Answer: 'Yes – 100%. All the app text is editable, so you can use it in French or English.',
  },
};

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>(() => {
    // Persist language preference in localStorage
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  const t = useCallback((key: keyof typeof translations.fr): string => {
    return translations[language][key] || key;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const newLang = prev === 'fr' ? 'en' : 'fr';
      localStorage.setItem('language', newLang);
      return newLang;
    });
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  }, []);

  return {
    language,
    setLanguage: changeLanguage,
    toggleLanguage,
    t,
  };
};