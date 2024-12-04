export class blogHandler {
  static loadScrollLecture() {
    const copyLinkButton = document.querySelector(".copy-link");
    const linkedinButton = document.querySelector(".linkedin");
    const mailButton = document.querySelector(".mail");
    const facebookButton = document.querySelector(".facebook");

    copyLinkButton.addEventListener("click", () => {
      navigator.clipboard.writeText(window.location.href);
    });

    linkedinButton.addEventListener("click", () => {
      window.open(
        "https://www.linkedin.com/feed/?linkOrigin=LI_BADGE&shareActive=true&shareUrl=" +
          window.location.href +
          ""
      );
    });

    mailButton.addEventListener("click", () => {
      const subject = document.querySelector(".main-title h1").textContent;
      const body = document.querySelector(
        ".intro .elementor-widget-container"
      ).textContent;
      window.open(
        `mailto:?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`
      );
    });

    facebookButton.addEventListener("click", () => {
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`
      );
    });

    const element = document.querySelector(".lecture-bar");
    const widget = document.querySelector(".widget-content");
    const content = document.querySelector(".content-blog");

    if (element && widget && content) {
      // Initialise GSAP ScrollTrigger
      gsap.registerPlugin(ScrollTrigger);

      // Barre de progression
      gsap.to(element, {
        width: "100%", // La barre arrive à 100%
        scrollTrigger: {
          trigger: content, // L'élément qui déclenche le ScrollTrigger
          start: "top bottom", // Quand le haut de l'écran touche le bas du contenu
          end: "bottom center", // Quand le bas du contenu arrive au centre de l'écran
          scrub: true, // Synchronise l'animation avec le scroll
        },
      });

      // Positionnement du widget
      ScrollTrigger.create({
        trigger: content,
        start: "bottom bottom", // Quand le bas du contenu sort de l'écran
        end: "bottom+=78 bottom", // Ajoute 78px à la fin
        onEnter: () => (widget.style.position = "relative"),
        onLeaveBack: () => (widget.style.position = ""),
      });
    }
  }
}
