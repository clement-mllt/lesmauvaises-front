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
  static selectTags() {
    const tags = document.querySelectorAll(
      ".tag .jet-listing-dynamic-terms__link"
    );
    const articles = document.querySelectorAll(
      ".jet-listing-grid__items > div"
    );
    const titleElementTag = document.querySelector(
      ".category-tag-filter .open-menu"
    );

    console.log(tags);

    tags.forEach((tag) => {
      const href = tag.getAttribute("href");

      // Vérifie si le lien contient "tag"
      if (href.includes("tag")) {
        tag.addEventListener("click", (e) => {
          e.preventDefault();
          const selectedTag = tag.textContent.trim();
          console.log(titleElementTag);

          titleElementTag.innerHTML = selectedTag; // Mettre à jour le titre avec le tag sélectionné

          // Boucle pour afficher ou masquer les articles en fonction du tag sélectionné
          articles.forEach((article) => {
            const articleTags = article.querySelectorAll(
              ".elementor-widget-jet-listing-dynamic-terms .jet-listing-dynamic-terms__link"
            );

            // Vérifie si l'article contient le tag sélectionné
            const hasTag = Array.from(articleTags).some(
              (articleTag) => articleTag.textContent.trim() === selectedTag
            );

            // Affiche ou masque l'article en fonction du tag
            article.style.display = hasTag ? "block" : "none";
          });
        });
      }
    });
  }

  static setNumberOnArticle() {
    const articles = document.querySelectorAll(
      "#list-articles .jet-listing-grid__item"
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

  static changeSelectElement() {
    const selectElement = document.querySelectorAll(".jet-select__control");
    const selectedDisplay = document.querySelectorAll(".jet-select"); // Assure-toi d'avoir cet élément dans ton HTML

    // Boucle à travers toutes les <option> du <select>
    selectElement.forEach((element, index) => {
      // Crée un nouvel élément <ul>
      const ulElement = document.createElement("ul");
      ulElement.className = "custom-select-ul"; // Ajoute une classe pour styliser le <ul>
      Array.from(element.options).forEach((option) => {
        // Crée un <li> pour chaque <option>
        const liElement = document.createElement("li");
        liElement.textContent = option.textContent;
        liElement.dataset.value = option.value; // Stocke la valeur de l'option dans un data attribute

        // Ajoute le <li> au <ul>
        ulElement.appendChild(liElement);
      });
      const divElement = document.createElement("div");
      divElement.className = "menu-filter";

      // Ajoute le <ul> à la nouvelle div
      divElement.appendChild(ulElement);

      // Remplace le <select> par la nouvelle div
      element.parentNode.replaceChild(divElement, element);
      index == 0
        ? (selectedDisplay[index].innerHTML +=
            "<p class='open-menu'>ta catégorie</p>")
        : (selectedDisplay[index].innerHTML +=
            "<p class='open-menu'>ton tag</p>");
    });

    // Ajoute un gestionnaire d'événement pour chaque <li>
    const liElements = document.querySelectorAll(".custom-select-ul li");
    liElements.forEach((liElement) => {
      liElement.addEventListener("click", () => {
        const selectedValue = liElement.dataset.value;
        const selectElement = liElement.closest(".custom-select-ul").parentNode;
      });
    });

    const listElementsCateogry = document.querySelectorAll(
      ".category-categorie-filter .custom-select-ul li"
    );

    const titleElementCategory = document.querySelector(
      ".category-categorie-filter .open-menu"
    );

    listElementsCateogry.forEach((categoryLink) => {
      categoryLink.addEventListener("click", function (event) {
        event.preventDefault();

        // Récupérer la catégorie sélectionnée
        const selectedCategory = categoryLink.textContent;

        // Afficher les articles de la catégorie sélectionnée et masquer les autres
        document
          .querySelectorAll(".jet-listing-grid__items > div")
          .forEach((article) => {
            const articleCategory = article.querySelector(
              ".elementor-widget-jet-listing-dynamic-terms .jet-listing-dynamic-terms__link"
            ).textContent;

            titleElementCategory.innerHTML = selectedCategory;

            if (articleCategory === selectedCategory) {
              article.style.display = "block";
            } else {
              article.style.display = "none";
            }
          });
      });
    });
  }

  static openMenuFilter() {
    const buttons = document.querySelectorAll(".open-menu");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const menu = button.previousElementSibling;
        menu.classList.toggle("open");
      });
    });
  }
}
