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

import {prepareAnimationHandler} from "./prepareAnimationHandler";

export class transitionPageHandler {
  static loadTransition(callback) {
    let storedValue = localStorage.getItem("loader")
      ? localStorage.getItem("loader")
      : localStorage.setItem("loader", false);

    if (storedValue == "true") {
      const allLinks = document.querySelectorAll("a");

      const startTl = prepareAnimationHandler.constructTransition(false);
      startTl.play();

      allLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const href = link.getAttribute("href");

          if (!href.includes("tag")) {
            if (href != "#") {
              const tl = prepareAnimationHandler.constructTransition(true);
              tl.play();

              tl.eventCallback("onComplete", () => {
                setTimeout(callback, (tl.duration() - 0.6) * 1000);
                window.location.href = href;
              });
            }
          }
        });
      });

      startTl.eventCallback(
        "onComplete",
        setTimeout(callback, (startTl.duration() - 0.6) * 1000)
      );
    }
  }
}
