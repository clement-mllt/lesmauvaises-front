import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger.js";
import {ScrollToPlugin} from "gsap/ScrollToPlugin.js";
import {Draggable} from "gsap/Draggable.js";
import {MotionPathPlugin} from "gsap/MotionPathPlugin.js";
import {EaselPlugin} from "gsap/EaselPlugin.js";
import {PixiPlugin} from "gsap/PixiPlugin.js";
import {TextPlugin} from "gsap/TextPlugin.js";
import {DrawSVGPlugin} from "gsap/DrawSVGPlugin.js";
import {SplitText} from "gsap/SplitText.js";
import {MorphSVGPlugin} from "gsap/MorphSVGPlugin.js";
import {numberSource} from "./numberSource";
import {PhysicsPropsPlugin} from "gsap/PhysicsPropsPlugin.js";
import {letterSource} from "./letterSource";

import Matter from "matter-js";
import {Engine, Render, World, Bodies} from "matter-js";

gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  Draggable,
  PhysicsPropsPlugin,
  MotionPathPlugin,
  MorphSVGPlugin,
  SplitText,
  EaselPlugin,
  PixiPlugin,
  TextPlugin,
  DrawSVGPlugin
);

import {utilsHandler} from "./utilsHandler";
import {menuHandler} from "./menuHandler";
import {prepareAnimationHandler} from "./prepareAnimationHandler";

export class serviceHandler {
  static index = 0;
  static loadSwitchService() {
    const serviceContainers = document.querySelectorAll('.container-service')
    const containers = document.querySelectorAll(".container-service-overlay");
    const containersTitle = document.querySelectorAll(
      ".main-container-service .container-title-op"
    );

    const words = [
      {
        className: "words-management",
        text: "P,A,R,C,E,*,Q,U,*,A,C,H,E,T,E,R,*,D,E,S,*,A,B,O,N,N,E,S,*,N,E,*,F,O,N,C,T,I,O,N,N,E,*,P,L,U,S",
        size: 18,
      },
      {
        className: "words-comple",
        text: "Q,U,A,N,D,*,Y,*,E,N,*,A,*,P,L,U,S,*,Y,*,E,N,*,A,*,E,N,C,O,R,E",
        size: 18,
      },
      {
        className: "words-internet",
        text: "T,R,O,P,*,C,*,E,S,T,*,J,A,M,A,I,S,*,A,S,S,E,Z",
        size: 18,
      },
      {
        className: "words-maintenance",
        text: "M,E,M,E,*,V,O,T,R,E,*,S,I,T,E,*,M,E,R,I,T,E,*,U,N,*,C,O,N,T,R,O,L,E,*,T,E,C,H,N,I,Q,U,E",
        size: 18,
      },
    ];

    const animateServiceContainers = () => {
      serviceContainers.forEach((service, idx) => {
        service.classList.add(`service-${idx}`)
        const tl = gsap.timeline()
      tl.fromTo("service-0", {
        left: -20,
        opacity: 0,
      }, {
        left: 0,
        opacity: 1,
        ease: "power4.inOut"
      }, 0.75)
      })
      
    }

    animateServiceContainers()

    containersTitle.forEach((containerTitle, index) => {
      const titles = containerTitle.querySelectorAll(
        ".elementor-widget-heading"
      );
      const tl = gsap.timeline();
      const tlReset = gsap.timeline();
      containers[index].addEventListener("mouseenter", () => {
        tl.pause();
        tlReset.to(titles, {
          yoyo: false,
          repeat: 0,
          transform: "translateX(0)",
          duration: 1,
        });
      });

      containers[index].addEventListener("mouseleave", () => {
        tl.play();
      });

      titles.forEach((title) => {
        const randomNumberDuration = Math.floor(Math.random() * 3) + 2;
        const randomNumberTransform = Math.floor(Math.random() * 200) + 1;

        switch (index) {
          case 0:
            tl.to(
              title,
              {
                transform: `translateX(${randomNumberTransform}px)`,
                duration: randomNumberDuration,
                transition: "linear",
                repeat: -1,
                yoyoEase: "linear",
              },
              0
            );
            break;
          case 1:
          case 2:
          case 3:
            tl.to(
              title,
              {
                transform: `translateX(-${randomNumberTransform}px)`,
                duration: randomNumberDuration,
                transition: "linear",
                repeat: -1,
                yoyoEase: "linear",
              },
              0
            );
            break;
        }
      });
    });

    words.forEach((element) => {
      const word = document.querySelector(`.${element.className}`);
      const letter = element.text;

      letterSource.getLetters(letter).then((letters) => {
        const container = word;
        const svgHTML = letters
          .map((svg) =>
            svg != "*" ? "<span>" + svg + "</span>" : "<b class='space'></b>"
          )
          .join("");
        container.innerHTML += `<div class="lm-typo top index z-9">${svgHTML}</div>`;

        const tlLetterSourceAnime = prepareAnimationHandler.animeLetterSource(
          container,
          element.size,
          0.5,
          "#000000",
          1
        );
        return tlLetterSourceAnime.play();
      });
    });

    containers.forEach((container, index) => {
      container.addEventListener("click", (e) => {
        const target = document.querySelectorAll(".section-service");
        const tl = serviceHandler.prepareScrollSection(target[index]);

        const firstContainerChoose = target[index].querySelector(".tres-bon");
        const secondContainerChoose = target[index].querySelector(".choix");

        target.forEach((element) => {
          gsap.set(element, {display: "none"});
        });

        if (
          serviceHandler.index > 0 &&
          firstContainerChoose.querySelector(".lm-typo")
        ) {
          serviceHandler.resetDisplay(
            target,
            firstContainerChoose,
            secondContainerChoose
          );
        }
        serviceHandler.index = index++;

        letterSource.getLetters("T,R,E,S,*,*,*,*,B,O,N").then((letters) => {
          const container = firstContainerChoose;
          const svgHTML = letters
            .map((svg) =>
              svg !== "*" ? "<span>" + svg + "</span>" : '<b class="space"></b>'
            )
            .join("");
          container.innerHTML +=
            '<div class="lm-typo index z-9 rotate ro--359">' +
            svgHTML +
            "</div>";

          const tlLetterSourceAnime = prepareAnimationHandler.animeLetterSource(
            container,
            150,
            0.05,
            "var(--e-global-color-0259c30)",
            1.5
          );

          tlLetterSourceAnime.eventCallback("onComplete", () => {
            letterSource.getLetters("C,H,O,I,X").then((letters) => {
              const container = secondContainerChoose;
              const svgHTML = letters
                .map((svg) =>
                  svg !== "*"
                    ? "<span>" + svg + "</span>"
                    : '<b class="space"></b>'
                )
                .join("");
              container.innerHTML +=
                '<div class="lm-typo index z-9 rotate ro--359">' +
                svgHTML +
                "</div>";
              const tlLetterSourceAnime2 =
                prepareAnimationHandler.animeLetterSource(
                  container,
                  150,
                  0.05,
                  "var(--e-global-color-0259c30)",
                  1.5
                );
              tlLetterSourceAnime2.play();
            });
          });

          tlLetterSourceAnime.play();
        });

        target.animationTimeline = tl;

        target.animationTimeline.play();
      });
    });
  }

  static resetDisplay(elements, firstElement, secondElement) {
    firstElement.querySelector(".lm-typo").remove();
    secondElement.querySelector(".lm-typo").remove();
  }

  static trashContent() {
    const mainContainer = document.querySelectorAll(".section-service");

    mainContainer.forEach((container) => {
      const content = container.querySelector(".content-service");
      const texts = content.querySelectorAll(".elementor-widget-text-editor");
      texts.forEach((text) => {
        // text.innerHTML += lineErase;
      });
    });
  }

  static prepareScrollSection(element) {
    gsap.registerPlugin(ScrollToPlugin);
    const tl = gsap.timeline({paused: true});

    tl.to(element, {
      duration: 0.1,
      display: "flex",
      onComplete: () =>
        window.scrollTo({
          top: element.offsetTop,
          behavior: "smooth",
        }),
    });

    return tl;
  }

   // Confetti Projet Agence 
   static createConfetti() {
    const container = document.getElementById("confettisContainer");
    const numberOfConfetti = 300; 
    const wrapperRect = container.parentElement.getBoundingClientRect(); 
    const startX = wrapperRect.width * 0.25 ; 
    const startY = wrapperRect.height / 2;

    for (let i = 0; i < numberOfConfetti; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        container.appendChild(confetti);

        // Position initiale absolue dans le wrapper
        confetti.style.position = "absolute";
        confetti.style.left = `${startX}px`;
        confetti.style.top = `${startY}px`;

        // Calcul des déplacements
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * wrapperRect.width * 0.8; 
        const xOffset = Math.cos(angle) * distance;
        const yOffset = Math.sin(angle) * distance;

        // Taille et couleur aléatoire
        const size = Math.random() * 8 + 3;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size}px`;

        const randomBackground =
            prepareAnimationHandler.colors[
                Math.floor(Math.random() * prepareAnimationHandler.colors.length)
            ];

        // Animation GSAP
        gsap.to(confetti, {
            opacity: 1,
            x: xOffset,
            y: yOffset + wrapperRect.height, 
            background: randomBackground,
            rotation: "+=360",
            duration: 0.8 + Math.random(),
            ease: "power2.out",
            onComplete: () => confetti.remove(), 
        });
    }
}
}
