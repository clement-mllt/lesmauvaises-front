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
import {menuHandler} from "./menuHandler";
import {numberSource} from "./numberSource";

gsap.registerPlugin(
  ScrollTrigger,
  ScrollToPlugin,
  Draggable,
  MotionPathPlugin,
  MorphSVGPlugin,
  SplitText,
  EaselPlugin,
  PixiPlugin,
  TextPlugin,
  DrawSVGPlugin
);

gsap.registerPlugin(ScrollTrigger);

export class actuHandler {
  static setNumberOnArticle() {
    const articles = document.querySelectorAll(
      ".list-articles .jet-listing-grid__item"
    );
    let number;
    articles.forEach((article, index) => {
      const realIndex = index + 1;
      switch (realIndex) {
        case 0:
          number = numberSource.getNumbers("zero");
          break;
        case 1:
          number = numberSource.getNumbers("one");
          break;
        case 2:
          number = numberSource.getNumbers("two");

          break;
        case 3:
          number = numberSource.getNumbers("three");

          break;
        case 4:
          number = numberSource.getNumbers("four");

          break;
        case 5:
          number = numberSource.getNumbers("five");

          break;
        case 6:
          number = numberSource.getNumbers("six");

          break;
        case 7:
          number = numberSource.getNumbers("seven");

          break;
        case 8:
          number = numberSource.getNumbers("eight");

          break;
        case 9:
          number = numberSource.getNumbers("nine");

          break;
      }

      const tl = actuHandler.prepareSetterNumber(article, number);
      tl.play();
    });
  }

  static prepareSetterNumber(article, number) {
    const tl = gsap.timeline({paused: true});
    const numberContainer = article.querySelector(".number svg");
    numberContainer.innerHTML = number;
    tl.to(numberContainer, {
      rotate: -16,
      attr: {
        width: 60,
        height: 60,
      },
    });
    return tl;
  }
}
