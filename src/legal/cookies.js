module.exports = function (site) {
  return `
  <p>${site.siteName} utilise un seul type de cookie : la mesure d'audience Google Analytics, qui nous aide à comprendre quelles fiches intéressent nos lecteurs.</p>
  <h2>Cookies de mesure d'audience</h2>
  <p>Ils ne sont déposés qu'après votre acceptation via le bandeau proposé en bas d'écran. Vous pouvez à tout moment changer d'avis en effaçant les cookies de votre navigateur.</p>
  <h2>Aucun cookie publicitaire</h2>
  <p>Ce site ne dépose aucun cookie publicitaire ni de traçage tiers en dehors de la mesure d'audience décrite ci-dessus.</p>
  <h2>Comment refuser</h2>
  <p>Choisissez "Refuser" dans le bandeau à votre première visite, ou configurez votre navigateur pour bloquer les cookies de google-analytics.com.</p>
  `;
};
