/** @format */
import {gsap} from "gsap";

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
import {index} from "d3";
import {letterSource} from "./letterSource";
import {prepareAnimationHandler} from "./prepareAnimationHandler";
import {controlSpeedHandler} from "./controlSpeedHandler";
import {utilsHandler} from "./utilsHandler";

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

export class animationHandler {
  static indexProject = 2;
  static isAnimating = false;

  static projects = {
    1: {
      title: "Sharp & Cheesy",
      description:
        "Studio de direction artistique très talentueux basé à Paris",
      image:
        "/wp-content/themes/lesmauvaises-front/assets/content/image-top/sharpandcheesy.png",
      link: "/projet/sharpandcheesy",
    },
    2: {
      title: "Galerie Diurne",
      description: "Une galerie d’art située dans le 16ème arrondissement",
      image:
        "/wp-content/themes/lesmauvaises-front/assets/content/image-top/diurne.png",
      link: "/projet/galeriediurne",
    },
  };

  static startHomepage(currentColor) {
    const tl = gsap.timeline();
    const tlProject = gsap.timeline();

    animationHandler.loadEventContent(tl);
    animationHandler.loadContentFirstSection();
    animationHandler.loadSliderProject(tl, tlProject);

    const timelineHeaderFirst =
      prepareAnimationHandler.animationFirstSectionHomepage(currentColor);

    ScrollTrigger.create({
      animation: timelineHeaderFirst,
      scrub: true,
      pin: true,
      anticipatePin: 1,
      trigger: "#landingSection",
      start: "top",
      end: "bottom",
      id: "mainScrollTrigger",
    });
  }

  static loadSliderProject(tl, tlProject) {
    const duration = 7;
    const currentImageElement = document.getElementById("current-img");
    const currentTitleElement = document.querySelector(".current-title h2");
    const currentDescriptionElement = document.querySelector(".current-desc p");
    const currentNextProjectElement = document.querySelector(
      ".current-next-project p"
    );
    const barProgress = document.querySelector(".progress-project");

    if (!animationHandler.indexProject) {
      animationHandler.indexProject = 1;
    }

    if (
      !currentImageElement ||
      !currentTitleElement ||
      !currentDescriptionElement ||
      !currentNextProjectElement ||
      !barProgress
    ) {
      console.error(
        "Un ou plusieurs éléments du DOM nécessaires sont introuvables."
      );
      return;
    }

    const currentProject =
      animationHandler.projects[animationHandler.indexProject];
    const nextProjectTitle =
      animationHandler.projects[animationHandler.indexProject === 1 ? 2 : 1]
        .title;

    tl.to(barProgress, {
      duration: duration,
      width: "100%",
      onComplete: () => {
        if (currentProject && nextProjectTitle) {
          animationHandler.updateProjectContent(
            currentProject,
            currentTitleElement,
            currentDescriptionElement,
            currentNextProjectElement,
            nextProjectTitle
          );
        } else {
          console.error("Le projet ou le titre suivant est introuvable.");
        }

        gsap.to(barProgress, {
          duration: 0.5,
          width: "0%",
          onComplete: () => {
            animationHandler.indexProject =
              animationHandler.indexProject === 1 ? 2 : 1;

            animationHandler.loadSliderProject(tl, tlProject);
          },
        });
      },
      onEnter: () => {
        setTimeout(() => {
          animationHandler.isAnimating = true;
        }, duration * 1000 - 1500);

        setTimeout(() => {
          if (currentProject) {
            animationHandler.updateProjectImage(
              tlProject,
              currentProject,
              currentImageElement
            );
            animationHandler.updateProjectNumber();
          } else {
            console.error(
              "Le projet actuel est introuvable pour updateProjectImage."
            );
          }
        }, duration * 1000 - 1000);
      },
    });
  }

  static updateProjectImage(tl, project, currentImageElement) {
    const scale = gsap.utils.random(-50, 50);

    tl.to(".main-img #distortion-scale", {
      duration: 0.5,
      attr: {
        scale: scale,
      },
    })
      .to(
        ".main-img #distortion-event",
        {
          duration: 0.5,
          attr: {
            baseFrequency: "0.1 0.1",
          },
        },
        "-=0.5"
      )
      .to(
        ".main-img #distortion-scale",
        {
          duration: 0.3,
          attr: {
            scale: -100,
          },
        },
        "-=0.4"
      )
      .to(
        ".main-img",
        {
          duration: 0.3,
          opacity: 0,
        },
        "-=0.3"
      )
      .to(
        ".main-img #distortion-scale",
        {
          duration: 0.5,
          attr: {
            scale: -1000,
          },
          onComplete: () => {
            currentImageElement.setAttribute("href", project.image);

            tl.to(".main-img", {
              duration: 0.5,
              opacity: 1,
            })
              .to(
                ".main-img #distortion-scale",
                {
                  duration: 0.3,
                  attr: {
                    scale: -100,
                  },
                },
                "-=0.5"
              )
              .to(
                ".main-img #distortion-event",
                {
                  duration: 0.3,
                  ease: "power2.inOut",
                  attr: {
                    baseFrequency: "0.1 0.1",
                  },
                },
                "-=0.3"
              )
              .to(
                ".main-img #distortion-scale",
                {
                  duration: 0.3,
                  attr: {
                    scale: -50,
                  },
                },
                "-=0.3"
              )
              .to(
                ".main-img #distortion-scale",
                {
                  duration: 0.3,
                  attr: {
                    scale: 0,
                  },
                  onComplete: () => {
                    animationHandler.isAnimating = false;
                  },
                },
                "-=0.1"
              );
          },
        },
        "-=0.1"
      );
  }

  static updateProjectNumber() {
    const tlLetter = gsap.timeline();
    const currentNumberElement = document.querySelector(".number-project");
    const containerTypo = currentNumberElement.querySelector(".lm-typo");
    const lastLetter = currentNumberElement.querySelectorAll("svg path");
    tlLetter.to(lastLetter, {
      duration: 0.5,
      drawSVG: "0%",
      onComplete: () => {
        containerTypo.remove();
        animationHandler.setupAnimation(
          currentNumberElement,
          `0,${animationHandler.indexProject}`,
          -8,
          "#29292E",
          0,
          100,
          1.5,
          "right",
          false,
          "absolute"
        );
      },
    });
  }

  static updateProjectContent(
    project,
    currentTitleElement,
    currentDescriptionElement,
    currentNextProjectElement,
    titleNextProject
  ) {
    currentTitleElement.textContent = project.title;
    currentDescriptionElement.textContent = project.description;

    currentNextProjectElement.textContent = titleNextProject;
  }

  static loadEventContent(tl) {
    const img = document.getElementById("current-img");

    img.addEventListener("mousemove", () => {
      tl.pause();
      if (!animationHandler.isAnimating) {
        animationHandler.isAnimating = true;
        const randomFrequency = Math.random() * (0.009 - 0.003) + 0.003;
        const randomScale = Math.random() * (100 - 50) + 50;

        gsap.to(".main-img #distortion-scale", {
          duration: 0.5,
          attr: {
            scale: randomScale,
          },
        });
        gsap.to(".main-img #distortion-event", {
          duration: 0.5,
          attr: {
            baseFrequency: `${randomFrequency} 0.01`,
            // numOctaves: randomOctaves,
          },
          onComplete: () => {
            animationHandler.isAnimating = false;
          },
        });
      }
    });

    img.addEventListener("mouseleave", () => {
      tl.play();
      gsap.to("#distortion-event", {
        attr: {
          baseFrequency: `0 0`,
        },
      });
      gsap.to("#distortion-scale", {
        attr: {
          scale: 0,
        },
      });
    });

    // messageButton.addEventListener("click", () => {
    //   const tlTransitionClick = prepareAnimationHandler.animationClickButton();

    //   tlTransitionClick.play();

    //   tlTransitionClick.eventCallback("onComplete", () => {});
    // });
  }

  static loadContentFirstSection() {
    animationHandler.setupAnimation(
      document.querySelector(".number-project"),
      "0,1",
      -8,
      "#29292E",
      0,
      100,
      1.5,
      "right",
      false,
      "absolute"
    );

    animationHandler.setupAnimation(
      document.querySelector(".text-web"),
      "W,E,B,*,*,*,C,R,E,A",
      0,
      "#29292E",
      0,
      70,
      1.5,
      "left",
      false,
      "absolute"
    );

    animationHandler.setupAnimation(
      document.querySelector(".home-mauvaises"),
      "L,E,S,*,*,M,A,U,V,A,I,S,E,S",
      0,
      "#29292E",
      0,
      32,
      1.5,
      "left",
      true,
      "absolute"
    );
  }

  static setupAnimation(
    container,
    query,
    rotation,
    color,
    delay,
    size,
    division,
    direction,
    autoAdapt = false,
    position
  ) {
    letterSource
      .getLetters(query)
      .then((letters) => {
        const svgHTML = letters
          .map((svg) =>
            svg !== "*" ? `<span>${svg}</span>` : "<b class='space'></b>"
          )
          .join("");
        container.innerHTML += `<div class="lm-typo ${position} top rotate ro-${rotation} ${direction} index z-9">${svgHTML}</div>`;

        const tl = prepareAnimationHandler.animeLetterSource(
          container,
          size,
          0.5,
          color,
          division
        );
        setTimeout(() => {
          tl.play();

          tl.eventCallback("onComplete", () => {
            if (autoAdapt) {
              const containerTypo = container.querySelector(".lm-typo");
              const sizeContainer = container.getBoundingClientRect().width;
              const sizecontainerTypo =
                containerTypo.getBoundingClientRect().width;

              const diff = sizeContainer - sizecontainerTypo;
              gsap.to(containerTypo, {
                x: diff / 2 + "px",
                duration: 0.5,
                ease: "power1.inOut",
              });
            }
          });
        }, delay);
      })
      .catch(logError);

    function logError(error) {
      console.error("Une erreur s'est produite :", error);
    }
  }
}
