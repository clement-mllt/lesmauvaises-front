export class letterSource {
  static async getLetters(letters) {
    // Tableau des lettres de l'alphabet
    var alphabet = letters.split(",");

    // Tableau pour stocker les promesses de chargement des fichiers SVG
    var svgPromises = [];

    // Parcours de chaque lettre de l'alphabet pour charger les fichiers SVG
    alphabet.forEach(function (letter) {
      if (letter !== "*") {
        // Création de la promesse pour récupérer le contenu SVG
        var svgPromise = fetch(
          "/wp-content/themes/lesmauvaises-front/assets/content/letters/" +
            letter +
            ".svg"
        )
          .then((response) => response.text())
          .then((svgContent) => {
            // Ajoute une balise <b> autour du SVG si la lettre correspond
            return `${svgContent}`;
            //   if (letter === "EACCENTGRAVE") {
            //   return `<b class='${letter}'>${svgContent}</b>`;
            // } else {
            //   return `${svgContent}`;
            // }
          })
          .catch((error) => {
            console.error(
              "Une erreur s'est produite lors du chargement du fichier SVG pour la lettre " +
                letter +
                " :",
              error
            );
            return null; // Retourne null en cas d'erreur pour éviter de casser Promise.all()
          });

        svgPromises.push(svgPromise);
      } else {
        svgPromises.push("<b class='space'></b>"); // Marqueur pour les espaces
      }
    });

    // RETURN PROMISE
    return Promise.all(svgPromises);
  }
}
