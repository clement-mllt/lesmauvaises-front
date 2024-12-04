// import Swiper JS
import Swiper from "swiper";
// import Swiper styles
import "swiper/css";

export class faqHandler {
  static sliderFaq() {
    let upArrow = document.querySelector(".slider_arrow_up");
    let downArrow = document.querySelector(".slider_arrow_down");
    const swiper_categorie = new Swiper(".swiper_faq_response", {
      direction: "vertical",
      slidesPerView: "auto",
      loop: true,
      centeredSlides: true,
      fadeEffect: {crossFade: true},
    });

    const swiper_response = new Swiper(".swiper_faq_content", {
      direction: "vertical",
      spaceBetween: 0,
      loop: true,
      autoplay: false,
      fadeEffect: {crossFade: true},
    });

    upArrow.addEventListener("click", () => {
      swiper_categorie.slidePrev();
      swiper_response.slidePrev();
    });

    downArrow.addEventListener("click", () => {
      swiper_response.slideNext();
      swiper_categorie.slideNext();
    });
  }

  static sliderQuestionsNumber() {
    let accordeon = document.querySelectorAll(".elementor-accordion");

    accordeon.forEach((element) => {
      let accordeonItem = element.querySelectorAll(".elementor-accordion-item");

      accordeonItem.forEach((element, index) => {
        let slides = element.querySelectorAll(".swiper-slide svg");
        let count = index + 1;

        slides.forEach((svgElement) => {
          // Créer le nouvel élément h2
          const newElement = document.createElement("h2");
          newElement.className =
            "elementor-heading-title elementor-size-default questions-number";
          if (count < 10) {
            newElement.textContent = "0" + count;
          } else {
            newElement.textContent = count;
          }

          // Remplacer l'élément SVG par le nouvel élément h2
          if (svgElement && svgElement.parentNode) {
            svgElement.parentNode.replaceChild(newElement, svgElement);
          }
        });
      });
    });
  }
}
