export class letterSource {
  static async getLetters(letters) {
    var alphabet = letters.split(",");

    var svgPromises = [];

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
            return null;
          });

        svgPromises.push(svgPromise);
      } else {
        svgPromises.push("<b class='space'></b>");
      }
    });

    return Promise.all(svgPromises);
  }
}
