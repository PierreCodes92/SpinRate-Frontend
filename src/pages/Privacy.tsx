import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8">
            Politique de Confidentialité
          </h1>
          
          <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p>
                Chez RevWheel, nous prenons votre vie privée au sérieux. Cette politique de confidentialité explique 
                comment nous recueillons, utilisons et protégeons vos informations personnelles lorsque vous utilisez 
                notre plateforme. En accédant à notre service, vous acceptez les termes de cette politique.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Informations que nous collectons</h2>
              <p>Nous collectons les informations suivantes lorsque vous utilisez RevWheel :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Informations personnelles :</strong> Nom, prénom, email, numéro de téléphone.</li>
                <li><strong>Informations liées à l'utilisation :</strong> Données sur l'utilisation de notre service, y compris les informations relatives à votre participation à la roue de la chance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Utilisation des informations</h2>
              <p>Nous utilisons les informations que nous collectons pour les finalités suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Gérer et améliorer notre service,</li>
                <li>Fournir des récompenses après participation à la roue de la chance,</li>
                <li>Contacter les utilisateurs pour des promotions ou des informations pertinentes concernant le service,</li>
                <li>Respecter nos obligations légales.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Partage des informations</h2>
              <p>Nous ne partageons pas vos informations personnelles avec des tiers, sauf dans les situations suivantes :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Si la loi nous y oblige,</li>
                <li>Si cela est nécessaire pour protéger nos droits ou ceux de nos utilisateurs.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité pour protéger vos informations personnelles contre toute 
                perte, utilisation abusive ou accès non autorisé. Cependant, aucune méthode de transmission sur Internet 
                n'est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Vos droits</h2>
              <p>
                Conformément à la législation sur la protection des données personnelles (notamment le RGPD), 
                vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Droit d'accès à vos données,</li>
                <li>Droit de rectification de vos données,</li>
                <li>Droit à l'effacement de vos données,</li>
                <li>Droit à la portabilité des données,</li>
                <li>Droit d'opposition au traitement de vos données.</li>
              </ul>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : 
                <a href="mailto:revwheelpro@gmail.com" className="text-primary hover:underline ml-1">revwheelpro@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Modifications de cette politique</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Nous vous 
                informerons des modifications via notre plateforme. Toute modification sera effective dès sa publication.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Contact</h2>
              <p>
                Si vous avez des questions concernant cette politique de confidentialité, n'hésitez pas à nous contacter 
                par email à <a href="mailto:revwheelpro@gmail.com" className="text-primary hover:underline">revwheelpro@gmail.com</a>
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

export default Privacy;