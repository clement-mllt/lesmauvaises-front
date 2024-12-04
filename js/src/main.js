/** @format */

import {utilsHandler} from "./components/utilsHandler";
import {animationHandler} from "./components/animationHandler";
import {blogHandler} from "./components/blogHandler";
import {agenceHandler} from "./components/agenceHandler";
import {serviceHandler} from "./components/serviceHandler";
import {menuHandler} from "./components/menuHandler";
import {footerHandler} from "./components/footerHandler";
import {actuHandler} from "./components/actuHandler";
import {prepareAnimationHandler} from "./components/prepareAnimationHandler";
import {transitionPageHandler} from "./components/transitionPageHandler";
import {letterSource} from "./components/letterSource";
import {projectHandler} from "./components/projectHandler";
import {faqHandler} from "./components/faqHandler";
import {controlSpeedHandler} from "./components/controlSpeedHandler";

document.addEventListener("readystatechange", (event) => {
  switch (document.readyState) {
    case "loading":
      break;
    case "interactive":
      // generalHandler.setAxeptio();
      utilsHandler.loadObserver();
      menuHandler.loadLoader();
      utilsHandler.loadLenis();
      // utilsHandler.loadPlanA3();
      break;
    case "complete":
      window.addEventListener("load", () => {
        transitionPageHandler.loadTransition(() => {
          prepareAnimationHandler.detailMenu();
          footerHandler.loadFooter();
          // blogHandler.loadScrollLecture();

          switch (true) {
            case location.pathname.split('"')[0] === "/":
              animationHandler.startHomepage();
              break;
            case location.pathname.includes("les-mauvaises"):
              agenceHandler.Initialize3dRendered();
              utilsHandler.showBrunchText();
              agenceHandler.switchWhy();
              agenceHandler.initScrollPaddingAnimation();
              agenceHandler.animateTextOpacityOnScroll();
              agenceHandler.teamImageSlider();
              break;
            case location.pathname.includes("realisations"):
              projectHandler.animationCardProject();
              utilsHandler.calculCards();
              projectHandler.getFontProject();
              projectHandler.switchColorProject();
              break;
            case location.pathname.includes("actualites"):
              // actuHandler.setNumberOnArticle();
              actuHandler.changeSelectElement();
              actuHandler.selectTags();
              actuHandler.openMenuFilter();
              break;
            case location.pathname.includes("services"):
              serviceHandler.loadSwitchService();
              serviceHandler.trashContent();
              utilsHandler.showBrunchText();
              break;
            case location.pathname.includes("foire-aux-questions"):
              faqHandler.sliderFaq();
              faqHandler.sliderQuestionsNumber();
              break;
            default:
              break;
          }
          window.scrollTo(0, 0);
        });
      });
      break;
  }
});
