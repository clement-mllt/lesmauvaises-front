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
      gsap.registerPlugin(ScrollTrigger);

      gsap.to(element, {
        width: "100%",
        scrollTrigger: {
          trigger: content,
          start: "top bottom",
          end: "bottom center",
          scrub: true,
        },
      });

      ScrollTrigger.create({
        trigger: content,
        start: "bottom bottom",
        end: "bottom+=78 bottom",
        onEnter: () => (widget.style.position = "relative"),
        onLeaveBack: () => (widget.style.position = ""),
      });
    }
  }
}
