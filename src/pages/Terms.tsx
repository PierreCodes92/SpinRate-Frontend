import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
            Conditions Générales d'Utilisation
          </h1>
          
          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p>
                Bienvenue sur RevWheel. En accédant et en utilisant notre service, vous acceptez de vous conformer 
                aux présentes Conditions Générales d'Utilisation (les "Conditions"). Ces conditions régissent 
                l'utilisation de la plateforme RevWheel, qui permet aux entreprises de recueillir des avis Google 
                de manière ludique en offrant des récompenses via une roue de la chance.
              </p>
              <p>
                Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description du service</h2>
              <p>RevWheel permet aux entreprises de :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Collecter des avis Google de manière simple et non intrusive,</li>
                <li>Offrir des récompenses via une roue de la chance après que les clients ont laissé un avis,</li>
                <li>Collecter les informations de contact des utilisateurs (nom, téléphone, email) pour les recontacter en cas de besoin.</li>
              </ul>
              <p>
                L'utilisation de RevWheel implique la création d'un compte utilisateur et l'acceptation des présentes conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Obligations des utilisateurs</h2>
              <p>En utilisant le service, vous vous engagez à :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir des informations exactes et complètes lors de l'inscription et lors de l'utilisation des services.</li>
                <li>Ne pas utiliser le service à des fins frauduleuses, illégales ou nuisibles.</li>
                <li>Respecter toutes les lois et régulations locales applicables en matière de protection des données et de gestion des avis clients.</li>
                <li>Ne pas abuser du système en créant de faux comptes ou en exploitant des failles dans le processus.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Responsabilités de l'entreprise</h2>
              <p>L'entreprise qui utilise RevWheel est responsable de :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>L'édition et de la gestion de ses récompenses et de sa roue de la chance,</li>
                <li>L'obtention de l'autorisation des clients pour collecter et utiliser leurs données (nom, email, téléphone),</li>
                <li>Le respect de la législation applicable concernant les avis clients, y compris les lois sur la protection des données personnelles (RGPD).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Données personnelles</h2>
              <p>
                RevWheel collecte certaines informations personnelles des utilisateurs (nom, email, numéro de téléphone) 
                lors de l'utilisation de ses services. Ces informations sont nécessaires pour permettre le bon fonctionnement 
                de la plateforme, notamment pour la gestion des récompenses.
              </p>
              <p>
                Nous nous engageons à respecter votre vie privée et à traiter vos informations personnelles conformément 
                à notre Politique de Confidentialité, disponible sur notre site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Propriété intellectuelle</h2>
              <p>
                Tout le contenu disponible sur RevWheel, y compris les logos, images, textes, vidéos, et autres matériaux, 
                est protégé par les droits de propriété intellectuelle. Aucune partie de ce contenu ne peut être reproduite, 
                distribuée ou utilisée sans l'autorisation explicite de RevWheel.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Modifications des conditions</h2>
              <p>
                Nous nous réservons le droit de modifier ces Conditions à tout moment. Nous vous informerons de toute 
                modification par l'intermédiaire de notre plateforme. Votre utilisation continue du service après toute 
                modification constitue une acceptation de ces nouvelles conditions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Suspension et résiliation</h2>
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre compte si nous estimons que vous avez 
                enfreint ces Conditions. En cas de résiliation, vous devrez cesser d'utiliser immédiatement nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Limitations de responsabilité</h2>
              <p>
                RevWheel ne pourra être tenue responsable des dommages directs ou indirects résultant de l'utilisation 
                ou de l'incapacité d'utiliser le service. Nous ne garantissons pas que le service sera exempt d'erreurs, 
                d'interruptions ou de défaillances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Force majeure</h2>
              <p>
                Nous ne serons pas responsables des retards ou de l'incapacité à fournir nos services en raison de 
                circonstances indépendantes de notre volonté, y compris mais sans s'y limiter, les catastrophes naturelles, 
                grèves, conflits sociaux, ou toute autre cause indépendante de notre volonté.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Loi applicable et règlement des litiges</h2>
              <p>
                Ces Conditions sont régies par la loi française. Tout litige relatif à l'utilisation des services sera 
                soumis à la compétence exclusive des tribunaux de Paris.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact</h2>
              <p>
                Pour toute question concernant ces Conditions, vous pouvez nous contacter à l'adresse suivante :
              </p>
              <p>
                <strong>Email:</strong> <a href="mailto:revwheelpro@gmail.com" className="text-primary hover:underline">revwheelpro@gmail.com</a>
              </p>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Button variant="hero" onClick={() => window.history.back()}>
              Retour
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;