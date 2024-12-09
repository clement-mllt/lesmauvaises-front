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
import {animationHandler} from "./animationHandler";
import {utilsHandler} from "./utilsHandler";
import {controlSpeedHandler} from "./controlSpeedHandler";

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

import {serviceHandler} from "./serviceHandler";
import {menuHandler} from "./menuHandler";
import {prepareAnimationHandler} from "./prepareAnimationHandler";

export class projectHandler {
  static animationCardProject() {
    const container = document.querySelector(".container-project-card");
    if (container) {
      const timelineHeaderFirst =
        prepareAnimationHandler.animationCardProject();
      const cards = container.querySelectorAll(
        ".jet-listing-grid__items > div"
      );
      const endValue = "+=" + cards.length * 50 + "vh";

      ScrollTrigger.create({
        animation: timelineHeaderFirst,
        scrub: true,
        pin: true,
        anticipatePin: 1,
        trigger: ".container-project-card",
        start: "top-=100px",
        end: endValue, 
      });
    }
  }

  static switchColorProject() {
    const container = document.querySelector(".list-card");
    if (container) {
      const cards = container.querySelectorAll(
        ".jet-listing-dynamic-repeater__items > div"
      );

      cards.forEach((card, index) => {
        cards.forEach((card, index) => {
          card.addEventListener("mouseenter", () => {
            cards.forEach((otherCard, otherIndex) => {
              const offset = (otherIndex + 1) * 80 - 80;
              if (otherIndex > index) {
                gsap.to(otherCard, {
                  x: -offset + 80,
                  duration: 0.25,
                  ease: "power1.inOut",
                });
              }
            });
          });

          card.addEventListener("mouseleave", () => {
            cards.forEach((otherCard, otherIndex) => {
              const offset = (otherIndex + 1) * 80 - 80; 
              if (otherIndex > index) {
                gsap.to(otherCard, {
                  x: -offset,
                  duration: 0.25,
                  ease: "power1.inOut",
                });
              }
            });
          });
        });
      });
    }
  }

  static getFontProject() {
    const containerLetter = document.querySelector(
      ".container-letter .elementor-widget-container"
    );
    const containerTypo = document.querySelector(".typo-project");
    const items = containerTypo.querySelectorAll(
      ".jet-listing-dynamic-repeater__item"
    );

    const tl = gsap.timeline();

    tl.set(containerLetter, {
      fontFamily: items[0].querySelector("span").innerHTML,
    });

    items.forEach((item, index) => {
      item.addEventListener("click", () => {
        const typo = item.querySelector("span").innerHTML;

        items.forEach((item) => {
          gsap.to(item, {
            opacity: 0.6,
            duration: 0.2,
          });
        });

        tl.to(item, {
          opacity: 1,
          duration: 0.3,
        })
          .to(containerLetter, {
            opacity: 0,
            y: -20,
            duration: 0.3,
          })
          .set(containerLetter, {
            fontFamily: typo,
          })
          .to(containerLetter, {
            opacity: 1,
            y: 0,
            duration: 0.3,
          });
      });
    });
  }

  static switchBackgroundColor() {
    console.log("Coucou");
    const currentIndexColor = localStorage.getItem('currentColorIndex')
    const currentColor = prepareAnimationHandler.colors[currentIndexColor]
    const container = document.querySelector(".cocktailHero");

    gsap.to(container, {
      backgroundColor: currentColor,
      duration: 0.25
    })
  }

  static animateStickyModel() {

    // CONTAINERS
    const globalContainer = document.querySelector('.globalContainer')
    const stickyContainer = globalContainer.querySelector('.stickyContainer')
    const stickyElement = stickyContainer.querySelector('.stickyElement')
    const img = stickyElement.querySelector('img')

    gsap.to(globalContainer, {
      scrollTrigger: {
        trigger: globalContainer,
        start: `top top`,
        end: "bottom bottom",
        // Regler le problème de jump 
        pin: stickyElement,
      },
    });
  }
}
