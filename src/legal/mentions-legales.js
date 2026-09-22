module.exports = function (site) {
  return `
  <p><em>À compléter avec vos coordonnées exactes avant la mise en ligne — ce texte est un modèle standard, pas un conseil juridique.</em></p>
  <h2>Éditeur du site</h2>
  <p>${site.siteName} — [Nom et prénom de l'éditeur ou dénomination de la structure]<br>
  [Adresse postale]<br>
  Contact : [email de contact]</p>
  <h2>Statut</h2>
  <p>Ce site est édité à titre [personnel / entrepreneur individuel / société — à préciser]. [Si applicable : SIRET, forme juridique, capital social, RCS.]</p>
  <h2>Hébergement</h2>
  <p>Ce site est hébergé par GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, États-Unis (GitHub Pages).</p>
  <h2>Directeur de la publication</h2>
  <p>[Nom et prénom]</p>
  <h2>Propriété intellectuelle</h2>
  <p>L'ensemble des textes, photographies et contenus publiés sur ${site.siteName} sont la propriété de leur auteur (${site.instagramHandle}) sauf mention contraire. Toute reproduction sans autorisation préalable est interdite.</p>
  <h2>Contact</h2>
  <p>Pour toute question relative à ce site : [email de contact].</p>
  `;
};
