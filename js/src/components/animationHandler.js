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
  static indexProject = 1;
  static isAnimating = false;

  static startHomepage() {
    const tl = gsap.timeline();
    const tlProject = gsap.timeline();

    // TOP ACTIONS
    animationHandler.loadEventContent(tl);
    animationHandler.loadContentFirstSection();
    animationHandler.loadSliderProject(tl, tlProject);

    // SCROLL TRIGGER TOP
    const timelineHeader = prepareAnimationHandler.animationHomePage();

    ScrollTrigger.create({
      animation: timelineHeader,
      scrub: true,
      pin: true,
      trigger: "#content",
      start: "top",
      end: "bottom",
      markers: true,
    });
    // gsap.to(".main-container-top", {
    //   animation: timeLinePage,
    //   scrollTrigger: {
    //     trigger: ".main-container-top",
    //     start: "top top",
    //     end: "bottom-=270px top",
    //     markers: true,
    //     scrub: 1,
    //     pin: true,
    //     onComplete: () => {
    //       console.log("end scroll");
    //     },
    //   },
    // });
  }

  static loadSliderProject(tl, tlProject) {
    let index, titleNextProject;
    const projects = {
      1: {
        title: "Sharp & Cheesy",
        description:
          "Studio de direction artistique très tallentueux basé à Paris",
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
    const duration = 7;
    const currentImageElement = document.getElementById("current-img");
    const currentTitleElement = document.querySelector(".current-title h2");
    const currentDescriptionElement = document.querySelector(".current-desc p");
    const currentNextProjectElement = document.querySelector(
      ".current-next-project p"
    );
    const barProgress = document.querySelector(".progress-project");

    titleNextProject = projects[animationHandler.indexProject].title;
    if (animationHandler.indexProject === Object.keys(projects).length) {
      titleNextProject = projects[1].title;
    }
    tl.to(barProgress, {
      duration: duration,
      width: "100%",
      onComplete: () => {
        animationHandler.updateProjectContent(
          projects,
          currentTitleElement,
          currentDescriptionElement,
          currentNextProjectElement,
          titleNextProject
        );
        tl.to(barProgress, {
          duration: 0.5,
          width: "0%",
          onComplete: () => {
            animationHandler.loadSliderProject(tl, tlProject);
          },
        });
      },
      onEnter: () => {
        setTimeout(() => {
          animationHandler.isAnimating = true;
        }, duration * 1000 - 1500);
        setTimeout(() => {
          animationHandler.updateProjectImage(
            tlProject,
            projects,
            currentImageElement
          );
          animationHandler.updateProjectNumber();
        }, duration * 1000 - 1000);
      },
    });
  }

  static updateProjectImage(tl, project, currentImageElement) {
    animationHandler.indexProject++;
    if (animationHandler.indexProject > 2) {
      animationHandler.indexProject = 1;
    }

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
            currentImageElement.setAttribute(
              "href",
              project[animationHandler.indexProject].image
            );

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
          "right"
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
    currentTitleElement.textContent =
      project[animationHandler.indexProject].title;
    currentDescriptionElement.textContent =
      project[animationHandler.indexProject].description;
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

        // START TRANSITION LAST IMG
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
      "right"
    );

    animationHandler.setupAnimation(
      document.querySelector(".text-web"),
      "W,E,B,*,*,*,C,R,E,A",
      0,
      "#29292E",
      0,
      70,
      1.5,
      "left"
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
      true
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
    autoAdapt = false
  ) {
    letterSource
      .getLetters(query)
      .then((letters) => {
        const svgHTML = letters
          .map((svg) =>
            svg !== "*" ? `<span>${svg}</span>` : "<b class='space'></b>"
          )
          .join("");
        container.innerHTML += `<div class="lm-typo top rotate ro-${rotation} ${direction} index z-9">${svgHTML}</div>`;

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
              console.log(diff);
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
