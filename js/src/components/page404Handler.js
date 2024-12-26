import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger.js";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import { Draggable } from "gsap/Draggable.js";
import { MotionPathPlugin } from "gsap/MotionPathPlugin.js";
import { EaselPlugin } from "gsap/EaselPlugin.js";
import { PixiPlugin } from "gsap/PixiPlugin.js";
import { TextPlugin } from "gsap/TextPlugin.js";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin.js";
import { SplitText } from "gsap/SplitText.js";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin.js";
import { numberSource } from "./numberSource";
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin.js";
import { letterSource } from "./letterSource";
import { prepareAnimationHandler } from "./prepareAnimationHandler";

import Matter from "matter-js";

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

export class page404Handler {
  static init() {
    const container = document.querySelector('#page-not-found');
    container ? page404Handler.loadLetter() : "";
  }

  static loadLetter() {
    letterSource.getLetters("L,O,R,E,M,*,I,P,S,U,M,*,L,O,R,E,M").then((letters) => {
      const container = document.querySelector(".containerLatin1");

      const svgHTML = letters
        .map((svg) =>
          svg !== "*" ? "<span>" + svg + "</span>" : '<b class="space"></b>'
        )
        .join("");

      container.innerHTML = ''; 

      container.innerHTML += '<div class="lm-typo index z-9">' + svgHTML + "</div>";

      const tlLetterSourceAnime1 = prepareAnimationHandler.animeLetterSource(
        container,
        25, 
        0.3,
        "#28282D", 
        1.5 
      );
      tlLetterSourceAnime1.play();
    });

    letterSource.getLetters("I,P,S,U,M,*,L,O,R,E,M,*,I,P,S,U,M").then((letters) => {
      const container = document.querySelector(".containerLatin2");

      const svgHTML = letters
        .map((svg) =>
          svg !== "*" ? "<span>" + svg + "</span>" : '<b class="space"></b>'
        )
        .join("");

      container.innerHTML = ''; 

      container.innerHTML += '<div class="lm-typo index z-9">' + svgHTML + "</div>";

      const tlLetterSourceAnime2 = prepareAnimationHandler.animeLetterSource(
        container,
        25, 
        0.3,
        "#28282D", 
        1.5 
      );
      tlLetterSourceAnime2.play();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  page404Handler.init();
});
