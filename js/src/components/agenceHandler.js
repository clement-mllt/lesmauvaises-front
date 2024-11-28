import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger.js";
import {ScrollToPlugin} from "gsap/ScrollToPlugin.js";
import {Draggable} from "gsap/Draggable.js";
import {MotionPathPlugin} from "gsap/MotionPathPlugin.js";
import {EaselPlugin} from "gsap/EaselPlugin.js";
import {PixiPlugin} from "gsap/PixiPlugin.js";
import {TextPlugin} from "gsap/TextPlugin.js";
import {CSSPlugin} from "gsap/CSSPlugin.js";
import {DrawSVGPlugin} from "gsap/DrawSVGPlugin.js";
import {SplitText} from "gsap/SplitText.js";
import {MorphSVGPlugin} from "gsap/MorphSVGPlugin.js";
import {menuHandler} from "./menuHandler";
import {InertiaPlugin} from "gsap/InertiaPlugin";
import {prepareAnimationHandler} from "./prepareAnimationHandler";
import {letterSource} from "./letterSource";

import Swiper from "swiper";
import "swiper/css";
import {Value} from "sass";
import {utilsHandler} from "./utilsHandler";
import { blur } from "d3";

gsap.registerPlugin(CSSPlugin);
gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  Draggable,
  MotionPathPlugin,
  MorphSVGPlugin,
  SplitText,
  InertiaPlugin,
  EaselPlugin,
  PixiPlugin,
  TextPlugin,
  DrawSVGPlugin
);

gsap.registerPlugin(ScrollTrigger);

export class agenceHandler {
  static onEnter = false;
  static switchWhy() {
    const targets = document.querySelectorAll(".target-quality");

    const pathLineElement = document.querySelectorAll(".line-decoration path");

    gsap.set(pathLineElement, {
      drawSVG: "0%",
    });

    targets.forEach((target) => {
      const tl = prepareAnimationHandler.animationSwitch(
        target.closest(".quality")
      );

      target.animationTimeline = tl;

      target.addEventListener("mouseover", () => {
        target.animationTimeline.play();
      });

      target.addEventListener("mouseout", () => {
        target.animationTimeline.reverse();
      });
    });
  }

  static teamData = [
    {
        id: "clement",
        nom: "Clément",
        surnom: "Le Malin",
        description: "Expert en développement web, Clément adore résoudre les casse-têtes.",
        dessert: "Tiramisu",
        musique: "Pop",
        chanteur: "Ed Sheeran",
    },
    {
        id: "carla",
        nom: "Carla",
        surnom: "La Créative",
        description: "Spécialiste en design UX/UI, Carla trouve l’inspiration dans les musées.",
        dessert: "Cheesecake",
        musique: "Jazz",
        chanteur: "Norah Jones",
    },
    {
        id: "lucas",
        nom: "Lucas",
        surnom: "Le Stratège",
        description: "Analyste chevronné, Lucas excelle dans la prise de décision rapide.",
        dessert: "Millefeuille",
        musique: "Rock",
        chanteur: "Bruce Springsteen",
    },
    {
        id: "ines",
        nom: "Inès",
        surnom: "L'Énergique",
        description: "Toujours en mouvement, Inès apporte dynamisme et énergie à l'équipe.",
        dessert: "Macarons",
        musique: "Classique",
        chanteur: "Ludovico Einaudi",
    },
    {
      id: "matteo",
      nom: "Mattéo",
      surnom: " le nouveau",
      description: "Toujours le nouveau , Mattéo apporte du nouveau et del' énergie à l'équipe.",
      dessert: "flan",
      musique: "ma meilleur enemie",
      chanteur: "Lomepal Pomme",
  },
    
];
  static handleTeamClick() {
    const teams = document.querySelectorAll(".team");


    teams.forEach((team) => {
      team.addEventListener("click", (event) => { 
        const timelineDetail = agenceHandler.timelineDetailTeam(team);
        const selectedTeamData = agenceHandler.teamData.find((data) => data.id === team.id);
        agenceHandler.updateTeamInfo(selectedTeamData);
      });
    });
  }

static updateTeamInfo(data) {
  document.getElementById("textNom").textContent = data.nom;
  document.getElementById("textSurnom").textContent = data.surnom;
  document.getElementById("textDescription").textContent = data.description;
  document.getElementById("textDessert").textContent = `Dessert préféré : ${data.dessert}`;
  document.getElementById("textMusique").textContent = `Musique préférée : ${data.musique}`;
  document.getElementById("textChanteur").textContent = `Chanteur préféré : ${data.chanteur}`;
}

  static timelineDetailTeam(team) {
    const tl = gsap.timeline();
  
    const containerShoot = document.getElementById('backgroundShoot');
    containerShoot.classList.add('no-click');
    const containerPic = document.getElementById('backgroundPic');
    const containerBlur = document.getElementById('backgroundBlur');
    const containerText = document.getElementById('backgroundText');
    
    const containerRect = containerPic.getBoundingClientRect(); 
  
    const detailTeam = team.getBoundingClientRect();
  
    const targetX = containerRect.left + containerRect.width / 2 - (detailTeam.left + detailTeam.width / 2);
    const targetY = containerRect.top + containerRect.height / 2 - (detailTeam.top + detailTeam.height / 2);
  
  
    tl.to(containerBlur,{
      zIndex : 15,
    },"sync").to(team,{
      zIndex : 16,
    },'sync').to(containerText,{
      zIndex : 16,
    },'sync');

    tl.to(team, {
      duration: 5,
      x: targetX,
      y: targetY,
      scale: 2.5, 
      ease: "power2.out",
    },"sync").to(containerBlur,{
      duration :5,
      filter:"blur(50px)"
  },"sync");

  tl.call(() => {
    container.classList.remove('no-click'); 
  });
  
    return tl;
  }
  
  static shootTeam() {
    const timelineShoot = agenceHandler.timelineShoot();

    ScrollTrigger.create({
      animation: timelineShoot,
      trigger: "#containerShoot",
      start: "top top",
      end: "bottom top",
      scrub: true,
      markers: true,
      anticipePin: 1,
      pin: true,
    });

    agenceHandler.handleTeamClick();
  }

  static timelineShoot() {
    const tl = gsap.timeline();
    const text = new SplitText(".main-title-shoot", {type: "chars"});
    const letters = text.chars;
    const containerGame = document.getElementById("gameShoot");
    const teams = document.querySelectorAll(".team");

    const teamsName = [
      { name: "clement", ax: -20, ay: 20 },
      { name: "carla", ax: -20, ay: 20 },
      { name: "ines", ax: -20, ay: 20 },
      { name: "lucas", ax: -20, ay: 20 },
      { name: "matteo", ax: -20, ay: 20 },
    ];

    tl.from(letters, {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.1,
    })
      .to(letters, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.1,
      })
      // .set(".menu", {
      //   backgroundColor: "transparent",
      //   onComplete: () => {
      //     gsap.from(teams, {
      //       opacity: 0,
      //       duration: 4,
      //       stagger: 0.3,
      //     });
      //     teams.forEach((team, i) => {
      //       gsap.to(team, {
      //         skewY: () => gsap.utils.random(-20, 20),
      //         skewX: () => gsap.utils.random(-10, 10),
      //         duration: 0.2,
      //         ease: "power1.inOut",
      //         yoyo: true,
      //         delay: i * 0.1,
      //         repeat: -1,
      //         onRepeat: () => {
      //           gsap.to(team, {
      //             skewY: () => gsap.utils.random(-20, 20),
      //             skewX: () => gsap.utils.random(-10, 10),
      //             duration: 0.2,
      //             ease: "power1.inOut",
      //             yoyo: true,
      //             delay: i * 0.1,
      //             repeat: -1,
      //           });
      //         },
      //       });
      //     });
      //   },
      // })
      .to(containerGame, {
        zIndex: 10,
        border: "red 1px solid",
      })
      .to(letters, {
        x: 20000,
        duration: 100,
      });

    console.log(tl); // Vérifie si la timeline est générée
    return tl;
  }



  static animateTextOpacityOnScroll() {
    const text = new SplitText(".container-text h2", {type: "words"});
    const container = document.querySelector(".section-agency");

    const scrollTriggerConfig = {
      trigger: container,
      scrub: true,
      start: "top+=100px bottom",
      end: `+=${container.clientHeight - 200}px`,
      ease: "power4.out",
    };

    const timeline = gsap.timeline({scrollTrigger: scrollTriggerConfig});

    text.words.forEach((word) => {
      const wordTimeline = gsap.timeline();

      wordTimeline.from(word, {
        opacity: 0,
        duration: 0.5,
      });

      if (word.innerHTML === "mauvaises") {
        wordTimeline.to(word, {
          onComplete: () => {
            const svgLineErase = `<svg class="erase-word" width="688" height="100" viewBox="0 0 683 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0,50 L688,50" stroke="#28282D" stroke-width="17" />
            </svg>`;
            word.innerHTML += svgLineErase;

            const svgElement = word.querySelector(".erase-word");
            gsap.fromTo(
              svgElement,
              {drawSVG: "0%"},
              {drawSVG: "100%", duration: 1}
            );
          },
        });
      }

      timeline.add(wordTimeline, "<");
    });
  }

  static animateLetters(letters) {
    letters.forEach((letter, i) => {
      gsap.to(letter, {
        opacity: 1,
        delay: i * 0.05,
        duration: 0.5,
      });
    });
  }

  static eraseText() {
    const tl = prepareAnimationHandler.eraseText();

    tl.play();
  }

  static initScrollPaddingAnimation() {
    const section = document.querySelector(".section-why");
    const container = document.querySelector(".bloc-quality");

    gsap.to(section, {
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
        onEnter: () => {
          if (!agenceHandler.onEnter) {
            agenceHandler.onEnter = true;
            letterSource
              .getLetters("P,O,U,R,Q,U,O,I,*,N,O,U,S,*,INTE")
              .then((letters) => {
                const container = document.querySelector(
                  ".text-section-skills"
                );
                const svgHTML = letters
                  .map((svg) =>
                    svg != "*"
                      ? "<span>" + svg + "</span>"
                      : "<b class='space'></b>"
                  )
                  .join("");
                container.innerHTML += `<div class="lm-typo index z-9">${svgHTML}</div>`;

                const tlLetterSourceAnime =
                  prepareAnimationHandler.animeLetterSource(
                    container,
                    50,
                    0.5,
                    "var(--e-global-color-0259c30)",
                    1
                  );
                return tlLetterSourceAnime.play();
              })
              .catch((error) => {
                console.error("Une erreur s'est produite :", error);
              });

            letterSource
              .getLetters(
                "P,A,R,C,E,*,Q,U,VIRGULE,E,N,*,P,L,U,S,*,D,VIRGULE,EACCENTCIRCONFLEXE,T,R,E,*,T,R,EACCENTGRAVE,S,*,F,O,R,T,S,*,O,N,*,L,E,*,F,A,I,T,*,T,O,U,J,O,U,R,S,*,A,V,E,C,*,H,U,M,O,U,R"
              )
              .then((letters) => {
                const container = document.querySelector(
                  ".desc-section-skills"
                );

                const svgHTML = letters
                  .map((svg) =>
                    svg !== "*"
                      ? `<span>${svg}</span>`
                      : "<b class='space'></b>"
                  )
                  .join("");
                container.innerHTML += `<div class="lm-typo index z-9">${svgHTML}</div>`;

                const tlLetterSourceAnime =
                  prepareAnimationHandler.animeLetterSource(
                    container,
                    14,
                    0.05,
                    "#FFFFFF",
                    1.3
                  );
                return tlLetterSourceAnime.play();
              })
              .catch((error) => {
                console.error("Une erreur s'est produite :", error);
              });
          }
        },
      },
      padding: "0",
    });

    gsap.to(container, {
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      },
      borderRadius: "0",
    });
  }

  static teamImageSlider() {
    gsap.registerPlugin(Draggable, InertiaPlugin);
    const lever = document.querySelector(".lever");
    const slider1 = document.querySelector(".team_image_slider");
    const slider = document.querySelector(".swiper-text");

    const swiper = new Swiper(".team_image_slider", {
      direction: "vertical",
      slidesPerView: "auto",
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      autoplay: false,
    });

    const swiperText = new Swiper(".swiper-text", {
      fadeEffect: {crossFade: true},
      spaceBetween: 0,
      loop: true,
      autoplay: false,
    });

    Draggable.create(lever, {
      type: "rotation",
      inertia: false,
      bounds: {minX: -40, minY: -40, maxX: 40, maxY: 40},
      onDragEnd: () => {
        if (gsap.getProperty(".lever", "rotation") > 0) {
          swiper.slideNext();
          swiperText.slideNext();
        } else if (gsap.getProperty(".lever", "rotation") < 0) {
          swiper.slidePrev();
          swiperText.slidePrev();
        }
        gsap.to(lever, {
          rotate: 0,
        });
      },
    });
  }
}
