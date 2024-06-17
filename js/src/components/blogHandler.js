export class blogHandler {
  static loadScrollLecture() {
    const element = document.querySelector(".lecture-bar");
    const widget = document.querySelector(".widget-content");
    element.style.width = 0;
    const content = document.querySelector(".content-blog");
    let contentHeight = content.getBoundingClientRect().bottom; // Hauteur du contenu
    console.log(contentHeight);
    if (element) {
      window.addEventListener("scroll", function () {
        const windowScroll = window.scrollY; // La quantité de scroll en pixels
        const height =
          document.documentElement.scrollHeight -
          document.querySelector(".content-blog").clientHeight +
          78; // La hauteur totale de défilement disponible
        const scrolled = (windowScroll / height) * 100; // Pourcentage du défilement
        element.style.width = scrolled + "%"; // Ajuste la largeur de la ligne basé sur le pourcentage de défilement
        windowScroll + window.innerHeight >= contentHeight + 78
          ? (widget.style.position = "relative")
          : true;
      });
    }
  }
}
