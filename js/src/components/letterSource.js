export class letterSource {
  static async getLetters(letters) {
    // Tableau des lettres de l'alphabet

    var alphabet = letters.split(",");

    // Tableau pour stocker les promesses de chargement des fichiers SVG
    var svgPromises = [];

    // Parcours de chaque lettre de l'alphabet pour charger les fichiers SVG
    alphabet.forEach(function (letter) {
      if (letter != "*") {
        var svgPromise = fetch(
          "/wp-content/themes/lesmauvaises-front/assets/content/letters/" +
            letter +
            ".svg"
        )
          .then((response) => response.text())
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
        svgPromises.push(letter);
      }
    });

    // RETURN PROMISE
    return Promise.all(svgPromises);
  }
}
