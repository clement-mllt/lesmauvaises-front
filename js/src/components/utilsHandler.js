/** @format */
import Lenis from "@studio-freight/lenis";
import {gsap} from "gsap";
import {agenceHandler} from "./agenceHandler";

import {CustomEase} from "gsap/CustomEase";
import {RoughEase, ExpoScaleEase, SlowMo} from "gsap/EasePack";

import {Flip} from "gsap/Flip";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Observer} from "gsap/Observer";
import {ScrollToPlugin} from "gsap/ScrollToPlugin";
import {Draggable} from "gsap/Draggable";
import {MotionPathPlugin} from "gsap/MotionPathPlugin";
import {EaselPlugin} from "gsap/EaselPlugin";
import {PixiPlugin} from "gsap/PixiPlugin";
import {TextPlugin} from "gsap/TextPlugin";
import {menuHandler} from "./menuHandler";
import {letterSource} from "./letterSource";

import {prepareAnimationHandler} from "./prepareAnimationHandler";

gsap.registerPlugin(
  Flip,
  ScrollTrigger,
  Observer,
  ScrollToPlugin,
  Draggable,
  MotionPathPlugin,
  EaselPlugin,
  PixiPlugin,
  TextPlugin,
  RoughEase,
  ExpoScaleEase,
  SlowMo,
  CustomEase
);

export class utilsHandler {
  static isEnglishVersion = location.pathname.includes("/en/");
  static lenis = new Lenis({
    smooth: true,
    smoothTouch: true, // Activer pour limiter également sur mobile
    direction: "vertical",
    lerp: 0.1,
    wheelMultiplier: 1,
  });

  static sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Scrolle la page jusqu'à la fin d'une animation spécifique dans une timeline GSAP liée à un ScrollTrigger
   * @param {gsap.core.Timeline} tl - La timeline GSAP
   * @param {ScrollTrigger} scrollTrigger - L'instance de ScrollTrigger associée
   * @param {string} label - Le label à atteindre dans la timeline
   * @param {string} targetClass - La classe de l'élément pour lequel on veut obtenir la durée
   * @param {number} speed - La durée de l'animation (facultatif)
   * @param {number} offset - Décalage supplémentaire en pixels (facultatif)
   */
  static scrollToEndOfAnimation(
    tl,
    scrollTrigger,
    label,
    targetClass,
    speed = 2,
    offset = 0
  ) {
    if (!scrollTrigger || !tl || !tl.labels[label]) return;

    // Obtenir la position du label dans la timeline
    const labelPosition = tl.labels[label];

    // Obtenir la durée de l'animation associée à la classe spécifiée (si elle existe)
    const tweens = tl.getTweensOf(targetClass);
    const animationDuration = tweens[1]?.duration() || 0;

    // Calculer la progression pour atteindre la fin de l'animation
    const progressEnd = (labelPosition + animationDuration) / tl.duration();

    // Faire défiler la page jusqu'à la position calculée
    gsap.to(window, {
      scrollTo: {
        y:
          scrollTrigger.start +
          (scrollTrigger.end - scrollTrigger.start) * progressEnd +
          offset,
        autoKill: false,
      },
      duration: speed,
      ease: "power2.out",
      onComplete: () => {
        utilsHandler.unblockScroll();
      },
    });
  }

  static setWheelMultiplier(wheelMultiplier, lerp) {
    utilsHandler.lenis.options.wheelMultiplier = wheelMultiplier;
    utilsHandler.lenis.options.lerp = lerp;
  }

  static isPositive(num) {
    if (Math.sign(num) === 1) {
      return true;
    }

    return false;
  }

  static calculCards() {
    const countCards = document.querySelector(".count-cards");

    if (countCards) {
      const cards = document.querySelectorAll(".jet-listing-grid__items > div");

      countCards.innerHTML = "P/00" + cards.length;
    }
  }

  static blockScroll() {
    utilsHandler.lenis.stop();
  }

  // Fonction pour débloquer le scroll
  static unblockScroll() {
    utilsHandler.lenis.start();
  }

  static loadLenis() {
    document.addEventListener("DOMContentLoaded", () => {
      // Fonction pour synchroniser Lenis avec ScrollTrigger
      function raf(time) {
        utilsHandler.lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Limiter la vitesse de défilement
      utilsHandler.lenis.on("scroll", () => {
        ScrollTrigger.update();
      });

      ScrollTrigger.defaults({
        scroller: document.body,
      });

      ScrollTrigger.refresh();
    });
  }
  static convertCmToFeet(cm) {
    const factor = 2.54;
    const feetPerInch = 12;

    const totalInches = cm / factor;
    const feet = Math.floor(totalInches / feetPerInch);
    const inches = (totalInches % feetPerInch).toFixed(1);

    return feet + "' " + inches + " ''";
  }

  static setDynamicFontSize(desiredFontSize) {
    const baseFontSize = 30; // ! Reference px
    const baseNumerator = 1510; // ! Reference vw

    let numerator = (baseNumerator / baseFontSize) * desiredFontSize;

    return numerator;
  }

  static setUrlByDocument(currenElement, link) {
    // Sélectionnez l'élément parent dont vous souhaitez surveiller les changements d'enfants
    var parentElement = document.querySelector(
      ".listing-presses .jet-listing-grid__items"
    );

    // Créer une instance de MutationObserver
    var observer = new MutationObserver(function (mutations) {
      // Vérifier les mutations pour les ajouts ou suppressions d'enfants
      mutations.forEach(function (mutation) {
        if (mutation.type === "childList") {
          // Appeler la fonction handleElementChange lorsque le nombre d'éléments change
          utilsHandler.setUrl(currenElement, link);
        }
      });
    });

    // Configurer les options pour le MutationObserver
    var observerOptions = {
      childList: true, // Surveiller les changements d'enfants
      subtree: true, // Surveiller les changements dans les sous-arbres également
    };

    // Commencer l'observation en utilisant le parentElement et les options
    observer.observe(parentElement, observerOptions);
    utilsHandler.setUrl(currenElement, link);
  }

  static setUrl(currenElement, link) {
    const elements = document.querySelectorAll("." + currenElement + " img");
    const shows = document.querySelectorAll(
      "." + link + " .jet-listing-dynamic-link__link"
    );

    elements.forEach((element, index) => {
      shows[index].href = element.dataset.src || element.src;
      shows[index].target = "_blank";
    });
  }

  static toggleBodyScroll(enableScroll) {
    const html = document.documentElement; // Obtenir l'élément HTML
    const body = document.body; // Obtenir l'élément BODY

    if (enableScroll) {
      html.style.overflow = null;
      body.style.overflow = null;
      html.style.height = null;
      body.style.height = null;
      body.style.position = null;
    } else {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }
  }

  static calculAutoWidth(element) {
    const detailElement = element.getBoundingClientRect();

    return detailElement.width;
  }

  static removeExtraChars(str) {
    return str.replace(/\s+/g, " ").trim();
  }

  static getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  static removeClasslist(contents, classname) {
    contents.forEach((content) => {
      content.classList.remove(classname);
    });
  }

  static scrollTop() {
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  static unScaleCursor() {
    let container = document.querySelector(".curseur");
    let cursor = container.querySelector("svg");

    gsap
      .timeline()
      .to(".text-overlay", {
        opacity: 0,
        duration: 0.5,
        ease: "power1.inOut",
      })
      .to(cursor, {
        scale: 1,
        duration: 1,
        transformOrigin: "center",
        ease: "power1.inOut",
      });
  }

  static scaleCursor() {
    let container = document.querySelector(".curseur");
    let cursor = container.querySelector("svg");

    gsap
      .timeline()
      .to(cursor, {
        scale: 2,
        duration: 1,
        transformOrigin: "center",
        ease: "power1.inOut",
      })
      .to(".text-overlay", {
        opacity: 1,
        duration: 0.5,
        ease: "power1.inOut",
      });
  }

  static detectScreenWidthChange() {
    const logo = document.querySelector("#mainLogo");
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const width = logo.getBoundingClientRect().width;
    const height = logo.getBoundingClientRect().height;

    const detailMenu = document.querySelector(".detail-menu");
    const heightMenu = detailMenu.offsetHeight;

    // FOR OPEN MENU BACKGROUND

    gsap.set(".openMenu", {
      attr: {
        width: screenWidth,
        height: heightMenu,
        viewBox: `0 0 ${screenWidth} ${heightMenu}`,
      },
    });
    // FOR LINE LOGO UPDATE
    gsap.set("#lineLogo", {
      attr: {
        width: width + 50,
        height: height,
      },
    });
  }

  static loadObserver() {
    const resizeObserver = new ResizeObserver(
      utilsHandler.detectScreenWidthChange
    );
    resizeObserver.observe(document.documentElement);
  }

  static hexToRgba(hex, opacity) {
    let r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
  }

  static getPositionClient() {
    return document.documentElement.getBoundingClientRect();
  }

  static getRotationAngle(target) {
    const obj = window.getComputedStyle(target, null);
    const matrix =
      obj.getPropertyValue("-webkit-transform") ||
      obj.getPropertyValue("-moz-transform") ||
      obj.getPropertyValue("-ms-transform") ||
      obj.getPropertyValue("-o-transform") ||
      obj.getPropertyValue("transform");

    let angle = 0;

    if (matrix !== "none") {
      const values = matrix.split("(")[1].split(")")[0].split(",");
      const a = values[0];
      const b = values[1];
      angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
    }

    return angle < 0 ? (angle += 360) : angle;
  }

  static getClientHeight() {
    return document.documentElement.clientHeight;
  }

  static getClientWidth() {
    return document.documentElement.clientWidth;
  }

  static getDirectionScroll() {
    if (oldScrollY < window.scrollY) {
      return "down";
    } else {
      return "up";
    }
  }

  static getAbsolutePositionYTop(el) {
    return (
      document.getElementById(el).getBoundingClientRect().top +
      document.documentElement.scrollTop -
      1
    );
  }

  static getAbsolutePositionYBottom(el) {
    return (
      document.getElementById(el).getBoundingClientRect().bottom +
      document.documentElement.scrollTop -
      1
    );
  }

  static getDistanceBetweenElements(a, b) {
    const aPosition = animationHandler.getPositionAtTop(a);
    const bPosition = animationHandler.getPositionAtTop(b);

    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
  }

  static getPositionAtTop(element) {
    const {top, left, width, height} = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top,
    };
  }

  static getPositionAtCenter(element) {
    const {top, left, width, height} = element.getBoundingClientRect();
    return {
      x: left + width / 2,
      y: top + height / 2,
    };
  }

  static setSetter() {
    const texts = document.querySelectorAll(".brunch-show h2");
    const descAgency = document.querySelector(".desc-agency p");
    const targetTitle = document.querySelector(".target-mauvaises");
    const lineErase = document.querySelectorAll(".line-erase path");
    const lineEraseMauvaises = document.querySelectorAll(
      ".line-erase-mauvaises path"
    );
    const svgErase = document.querySelector(".line-erase");
    const svgEraseMauvaises = document.querySelector(".line-erase-mauvaises");

    if (descAgency) {
      gsap.set(descAgency, {
        y: "-50vh",
        duration: 0,
      });
    }

    if (lineErase && targetTitle) {
      const widthElement = targetTitle.getBoundingClientRect().width;
      const heightElement = targetTitle.getBoundingClientRect().height;

      gsap.set(lineErase, {
        drawSVG: "0% 0%",
        duration: 0,
      });
      gsap.set(svgErase, {
        attr: {
          width: widthElement,
          height: heightElement,
        },
      });
    }

    if (svgEraseMauvaises && targetTitle) {
      const widthElement = targetTitle.getBoundingClientRect().width;
      const heightElement = targetTitle.getBoundingClientRect().height;

      gsap.set(lineEraseMauvaises, {
        drawSVG: "0% 0%",
        duration: 0,
      });
      gsap.set(svgEraseMauvaises, {
        attr: {
          width: widthElement,
          height: heightElement,
        },
      });
    }

    texts.forEach((element) => {
      gsap.set(element, {
        duration: 0,
        opacity: 0,
      });
    });
  }

  static setupAnimation(
    container,
    query,
    cssClass,
    rotation,
    onCompleteCallback
  ) {
    const mainContainer = document.querySelector(".section-plan");
    const textFixContainer = mainContainer.querySelector(".vous-nous-succes");

    letterSource
      .getLetters(query)
      .then((letters) => {
        const svgHTML = letters
          .map((svg) =>
            svg !== "*" ? `<span>${svg}</span>` : "<b class='space'></b>"
          )
          .join("");
        container.innerHTML += `<div class="lm-typo absolute top rotate ro-${rotation} left index z-9">${svgHTML}</div>`;
        const title = mainContainer.querySelector(
          ".main-text-plan .elementor-heading-title"
        );
        const fontSize = parseFloat(
          window
            .getComputedStyle(title)
            .fontSize.match(/[+-]?([0-9]*[.])?[0-9]+/)[0]
        );

        const tl = prepareAnimationHandler.animeLetterSource(
          container,
          fontSize / 2,
          0.5,
          "var(--e-global-color-1fe2b94)",
          1.5
        );
        tl.eventCallback("onComplete", onCompleteCallback);
        tl.play();
      })
      .catch(logError);

    function logError(error) {
      console.error("Une erreur s'est produite :", error);
    }
  }

  static loadPlanA3() {
    const mainContainer = document.querySelector(".section-plan");

    if (mainContainer) {
      const textFixContainer = mainContainer.querySelector(".vous-nous-succes");

      gsap.to(mainContainer, {
        scrollTrigger: {
          trigger: mainContainer,
          start: "top+=200px bottom",
          end: "bottom bottom",
          scrub: true,
          onEnter: () => {
            if (!agenceHandler.onEnter) {
              agenceHandler.onEnter = true;
              const containerScroll =
                mainContainer.querySelector(".arrete-scroll");
              const containerAttend = mainContainer.querySelector(".attend");
              const containerJeu = mainContainer.querySelector(".jeu");

              utilsHandler.setupAnimation(
                containerAttend,
                "A,H,H,H,*,A,T,T,E,N,D",
                "top rotate ro--15 left index z-9",
                -15,
                () => {
                  utilsHandler.setupAnimation(
                    containerScroll,
                    "A,R,R,E,T,E,*,D,E,*,S,C,R,O,L,L",
                    "top rotate ro--04 left index z-9",
                    -4,
                    () => {
                      utilsHandler.setupAnimation(
                        containerJeu,
                        "O,N,*,V,E,U,T,*,T,E,*,P,R,O,P,O,S,E,R,*,U,N,*,J,E,U",
                        "top rotate ro-10 left index z-9",
                        10
                      );
                    }
                  );
                }
              );
            }
          },
        },
      });

      letterSource
        .getLetters("V,O,U,S,*,N,O,U,S,*,E,T,*,L,E,*,S,U,C,C,E,S")
        .then((letters) => {
          const container = textFixContainer;
          const svgHTML = letters
            .map((svg) =>
              svg != "*" ? "<span>" + svg + "</span>" : "<b class='space'></b>"
            )
            .join("");
          container.innerHTML += `<div class="lm-typo top right index z-9">${svgHTML}</div>`;
          const title = container
            .closest(".section-plan")
            .querySelector(".main-text-plan .elementor-heading-title");
          const fontSize = window.getComputedStyle(title).fontSize;
          const size = parseFloat(fontSize.match(/[+-]?([0-9]*[.])?[0-9]+/)[0]);
          const tlLetterSourceAnime = prepareAnimationHandler.animeLetterSource(
            container,
            size / 4,
            0.5,
            "var(--e-global-color-1fe2b94)",
            1.5
          );
          return tlLetterSourceAnime.play();
        })
        .catch((error) => {
          console.error("Une erreur s'est produite :", error);
        });
    }
  }

  static showBrunchText() {
    const content = document.querySelectorAll(".brunch-show");
    const texts = document.querySelectorAll(".brunch-show h2");
    const tl = prepareAnimationHandler.animationsBrunchText(content);

    // SETTER
    utilsHandler.setSetter();

    tl.eventCallback("onComplete", () => {
      agenceHandler.eraseText();
      const tlSplit = prepareAnimationHandler.splitText(
        document.querySelector(".desc-agency p"),
        "words"
      );
      tlSplit.play();
    });

    tl.play();
  }

  // UTILS WP
  static changeArrow() {
    const arrowElements = document.querySelectorAll(".next-arrow, .prev-arrow");
    const arrowSvg = `<svg width="33" height="12" viewBox="0 0 33 12" fill="none" xmlns="http://www.w3.org/2000/svg">
			  <path d="M26.9521 11.8333L32.6187 6.00001L26.9521 0.166672L25.8074 1.34501L29.5199 5.16667H0.237793V6.83334H29.5199L25.8074 10.655L26.9521 11.8333Z" fill="black" fill-opacity="0.6"/>
		  </svg>`;

    if (arrowElements.length > 0) {
      arrowElements.forEach((arrow) => {
        arrow.innerHTML = arrowSvg;
      });
    }
  }
}
