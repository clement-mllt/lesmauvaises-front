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

import {prepareAnimationHandler} from "./prepareAnimationHandler";

// ES6 Modules
import Matter from "matter-js";
// Ou, si vous avez besoin d'accéder à des modules spécifiques
import {Engine, Render, World, Bodies} from "matter-js";

import {PhysicsPropsPlugin} from "gsap/PhysicsPropsPlugin.js";
import {color, text} from "d3";

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

export class menuHandler {
  static isOpen = false;

  static loadLoader() {
    let storedValue = localStorage.getItem("loader")
      ? localStorage.getItem("loader")
      : localStorage.setItem("loader", false);

    if (storedValue != "true") {
      gsap.set(".menu", {
        opacity: 0,
      });

      localStorage.setItem("loader", true);
      let engine = Matter.Engine.create(),
        world = engine.world;

      let width = window.innerWidth;
      let height = window.innerHeight;

      // Créer un renderer
      let render = Matter.Render.create({
        element: document.querySelector(".loader"),
        engine: engine,
        options: {
          width: width,
          height: height,
          background: "transparent", // Rend le fond du canvas transparent
          wireframes: false, // Pour un rendu plus réaliste des corps
        },
      });

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const numberBallW = Math.floor(windowWidth / 200);
      const numberBallH = Math.floor(windowHeight / 200);

      // Ajouter des corps
      let balls = [];
      let svgs = [];
      let xBalls = 0;
      let yball = -200; // Position verticale initiale de la première rangée de balles
      const loader = document.querySelector(".loader");
      const color = ["violet", "rose", "noir"];

      for (let i = 0; i < Math.floor(numberBallH); i++) {
        // Mettre à jour la position verticale pour la prochaine rangée de balles

        xBalls = 0;

        for (let j = 0; j < numberBallW; j++) {
          // Utiliser une fonction anonyme pour encapsuler le code à exécuter
          // Créer une balle avec les positions xBalls et yball
          let radius = Math.random() * (140 - 80) + 80;
          let mass = Math.random() * (100 - 8) + 8;
          let ball = Matter.Bodies.circle(xBalls + 200, yball, radius, {
            restitution: 0.9,
            mass: mass,
            isStatic: false, // Rendre la balle déplaçable
            angle: Math.random() * Math.PI * 2, // Définit une rotation aléatoire
            angularVelocity: (Math.random() * 2 - 1) * Math.PI, // Définit une vitesse de rotation aléatoire encore plus prononcée
            render: {
              fillStyle: "transparent",
              strokeStyle: "transparent",
              lineWidth: 0,
            },
          });
          xBalls += radius + 50;

          // Utiliser un index distinct pour accéder aux éléments SVG correspondant
          let svgIndex = i * numberBallW + j;
          loader.insertAdjacentHTML(
            "afterbegin",
            numberSource.getLogo(
              color[Math.floor(Math.random() * color.length)],
              svgIndex + 1
            )
          );
          let svg = document.getElementById(`ball${svgIndex + 1}`);

          balls.push(ball);
          svgs.push(svg);
        }
        yball -= 1000;
      }

      let ground = Matter.Bodies.rectangle(width / 2, height, width, 1, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      });
      let leftWall = Matter.Bodies.rectangle(0, height / 2, 1, height, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      });
      let rightWall = Matter.Bodies.rectangle(width, height / 2, 1, height, {
        isStatic: true,
        render: {
          fillStyle: "transparent",
          strokeStyle: "transparent",
        },
      });

      let mouse = Matter.Mouse.create(render.canvas);

      // Créer une contrainte de souris pour déplacer les corps
      let mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2, // Rigidité de la contrainte
          render: {
            visible: false, // Ne pas rendre la contrainte de la souris visible
          },
        },
      });

      // Ajouter la contrainte de souris au monde
      Matter.World.add(world, mouseConstraint);

      // Garder le renderer informé de la mise à jour de la position de la souris
      render.mouse = mouse;

      let obstacleZero = Matter.Bodies.rectangle(
        width / 2 + 50,
        height / 2 + 25,
        200,
        100,
        {
          isStatic: true,
          render: {
            visible: false, // Rendre l'obstacle invisible
          },
        }
      );

      // Ajouter l'obstacle du texte "0" au monde
      Matter.World.add(world, obstacleZero);

      // Ajouter le texte "0" au conteneur loader
      loader.insertAdjacentHTML("beforeend", `<div class="zero-text">0</div>`);

      // Sélectionner l'élément texte "0"
      let zeroText = document.querySelector(".zero-text");

      // Positionner le texte au centre de la scène
      zeroText.style.position = "absolute";
      zeroText.style.top = `${height / 2 - 50}px`; // Décalage de moitié de la hauteur du texte pour le centrer correctement
      zeroText.style.left = `${width / 2 - 50}px`; // Décalage de moitié de la largeur du texte pour le centrer correctement
      zeroText.style.fontFamily = "'MADE SOULMAZE', Sans-serif"; // Police de caractère
      zeroText.style.fontSize = "100px"; // Taille de police, vous pouvez ajuster selon vos besoins

      zeroText.style.color = "#28282D"; // Couleur du texte, vous pouvez ajuster cela selon vos préférences

      Matter.World.add(world, [leftWall, rightWall, ground, ...balls]);

      // Lancer le moteur et le renderer
      Matter.Runner.run(engine);
      Matter.Render.run(render);

      // Fonction de mise à jour pour aligner les SVG avec les corps
      function updateSVGPositions() {
        // Demander la prochaine exécution de la fonction avant la mise à jour
        requestAnimationFrame(updateSVGPositions);

        // Iterer sur les balles et les svgs pour les mettre à jour
        for (let i = 0; i < balls.length; i++) {
          let ball = balls[i];
          let svg = svgs[i];

          // Définissez la nouvelle largeur et la nouvelle hauteur souhaitées
          const nouvelleLargeur = (ball.circleRadius + 3) * 2; // Nouvelle largeur en pixels
          const nouvelleHauteur = (ball.circleRadius + 3) * 2; // Nouvelle hauteur en pixels

          // Définissez le facteur d'échelle basé sur la nouvelle largeur
          const facteurEchelle =
            nouvelleLargeur / parseFloat(svg.getAttribute("width"));

          // Appliquez la transformation de mise à l'échelle au SVG
          svg.setAttribute("width", nouvelleLargeur + "px");
          svg.setAttribute("height", nouvelleHauteur + "px");
          svg.style.width = nouvelleLargeur + "px";
          svg.style.height = nouvelleHauteur + "px";
          svg.style.transform = "scale(" + facteurEchelle + ")";
          svg.style.zIndex = "-1";

          svg.style.transform += `rotate(${ball.angle}rad)`; // Utilisez la rotation du corps
          svg.style.transformOrigin = `${nouvelleLargeur / 2}px ${
            nouvelleHauteur / 2
          }px`; // Centre de rotation
          svg.style.top = `${ball.position.y - ball.circleRadius}px`; // 30 est la moitié de la taille du cercle
          svg.style.left = `${ball.position.x - ball.circleRadius}px`;
        }
      }

      // Appeler la fonction une seule fois pour démarrer la mise à jour
      updateSVGPositions();
      const tl = prepareAnimationHandler.animationLoaderPercent(
        balls,
        world,
        obstacleZero,
        ground
      );
      tl.play();
    } else {
      const loader = document.querySelector(".loader");
      gsap.set(loader, {
        display: "none",
        transition: "none",
      });
    }
  }

  static animateBall(obj) {
    let newY = window.innerHeight - 115; // Taille de l'objet doit être considérée

    gsap.to(obj, {
      duration: 2,
      y: newY,
      ease: "bounce.out",
      onComplete: () => {
        // Vérifier pour les interactions après chaque animation
        menuHandler.checkInteractions(obj);
        // Recommencer l'animation pour simuler un mouvement continu
        menuHandler.animateBall(obj);
      },
    });
  }

  static checkInteractions(currentObj) {
    const objs = document.querySelectorAll(".obj");
    objs.forEach((obj) => {
      if (obj !== currentObj && this.isClose(obj, currentObj)) {
        // Calculer une nouvelle trajectoire si les objets sont proches
        const angle = Math.atan2(
          currentObj.offsetTop - obj.offsetTop,
          currentObj.offsetLeft - obj.offsetLeft
        );
        gsap.to(currentObj, {
          x: "+=" + Math.cos(angle) * 30,
          y: "+=" + Math.sin(angle) * 30,
          ease: "power1.out",
        });
        gsap.to(obj, {
          x: "-=" + Math.cos(angle) * 30,
          y: "-=" + Math.sin(angle) * 30,
          ease: "power1.out",
        });
      }
    });
  }

  static isClose(obj1, obj2) {
    const distance = Math.sqrt(
      Math.pow(obj1.offsetLeft - obj2.offsetLeft, 2) +
        Math.pow(obj1.offsetTop - obj2.offsetTop, 2)
    );
    return distance < 50; // Seuil de distance pour une interaction
  }

  static loadCursor() {
    let container = document.querySelector(".curseur");
    let containerDetail = container.querySelector(".elementor-icon");
    let cursor = container.querySelector("svg");

    // Définissez la largeur et la hauteur de votre SVG
    const svgWidth = cursor.clientWidth;
    const svgHeight = cursor.clientHeight;

    const textOverlay = document.createElement("div");
    textOverlay.textContent = "SKIP";
    textOverlay.style.position = "absolute";
    textOverlay.style.top = "50%";
    textOverlay.style.left = "25px";
    textOverlay.style.transform = "translate(-50%, -50%)";
    textOverlay.style.fontSize = "1.2rem";
    textOverlay.style.fontFamily = "MADE SOULMAZE, Sans-serif";
    textOverlay.style.color = "#000000";
    textOverlay.style.opacity = "0"; // Masqué au départ
    textOverlay.style.pointerEvents = "none";
    textOverlay.classList.add("text-overlay");

    // Ajout du texte dans le body (ou dans le conteneur spécifique si besoin)
    containerDetail.appendChild(textOverlay);

    function updatePosition(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      // Ajustez la position pour centrer le SVG
      const offsetX = mouseX - svgWidth / 2;
      const offsetY = mouseY - svgHeight / 2;

      gsap.to([cursor, textOverlay], {
        duration: 0.2, // Durée de l'animation
        x: offsetX - 12, // Position horizontale ajustée
        y: offsetY - 12, // Position verticale ajustée
        ease: "power2.out", // Facilité de l'animation
      });
    }

    // Associer la fonction à l'événement de déplacement de la souris
    document.addEventListener("mousemove", updatePosition);

    // Création et stylisation du texte "SKIP" avec GSAP
    // Création et stylisation du texte "SKIP" avec GSAP
  }

  static cursorMorph() {
    // Crée l'animation avec GSAP
    let morphTl = gsap.timeline({repeat: -1});

    morphTl
      .to("#start", {
        duration: 0.7,
        morphSVG: "#path1",
        ease: "linear",
      })
      .to(
        "#start",
        {
          duration: 0.7,
          morphSVG: "#path2",
          ease: "linear",
        },
        "-=0.3"
      )
      .to(
        "#start",
        {
          duration: 0.7,
          morphSVG: "#path3",
          ease: "linear",
        },
        "-=0.3"
      )
      .to(
        "#start",
        {
          duration: 0.5,
          morphSVG: "#start",
          ease: "linear",
        },
        "-=0.3"
      );

    // Ajoute les événements pour les liens
    document.querySelectorAll("a").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        // Arrête l'animation en cours
        morphTl.pause();

        // Morph vers la forme #reset
        gsap.to(".curseur #start", {
          duration: 0.5,
          morphSVG: ".curseur #reset",
          ease: "linear",
        });
      });

      link.addEventListener("mouseleave", () => {
        // Morph directement vers #start en douceur
        gsap.to(".curseur #start", {
          duration: 0.5,
          morphSVG: ".curseur #start",
          ease: "linear",
          onStart: () => {
            // Relance l'animation principale après avoir terminé la transition
            morphTl.play();
          },
        });
      });
    });
  }

  static initChangeColor() {
    const icon = document.querySelector(".icon");

    localStorage.getItem("currentColorIndex") === null
      ? localStorage.setItem("currentColorIndex", 2)
      : null;

    menuHandler.switchColor(icon);

    icon.addEventListener("click", () => {
      const currentColorIndex = parseInt(
        localStorage.getItem("currentColorIndex")
      );
      prepareAnimationHandler.currentColorIndex = (currentColorIndex + 1) % 3;

      localStorage.setItem(
        "currentColorIndex",
        prepareAnimationHandler.currentColorIndex
      );

      gsap.set(".svg-line", {zIndex: 10});
      gsap.set("#lineLogo path", {drawSVG: "0% 0%"});
      const iconSwitchLogo = document.querySelector(".color-switch");

      menuHandler.switchColor(icon);
    });
  }

  static switchColor(icon) {
    const currentColorIndex = parseInt(
      localStorage.getItem("currentColorIndex")
    );

    menuHandler.setCurrentColor(currentColorIndex);

    const tlSwitchColor =
      prepareAnimationHandler.switchColor(currentColorIndex);
    // MENU OPEN BURGER
    const iconTimeline = prepareAnimationHandler.animationColor(
      icon,
      currentColorIndex
    );
    const burgerTimeline =
      prepareAnimationHandler.changeBurgerColor(currentColorIndex);
    const lineLogoTimeline =
      prepareAnimationHandler.changeLineMorph(currentColorIndex);
    tlSwitchColor.play();
    iconTimeline.play();
    burgerTimeline.play();
    lineLogoTimeline.play();
  }

  static setCurrentColor(currentColorIndex) {
    const nextColorIndex =
      (currentColorIndex + 1) % prepareAnimationHandler.colors.length;
    const colorCurrent = prepareAnimationHandler.colors[currentColorIndex];
    const colorNext = prepareAnimationHandler.colors[nextColorIndex];

    const animateColor = (elements, prop, color) => {
      elements.forEach((el) => {
        const targets = el.querySelectorAll("path, h2 div, h1");
        gsap.to(targets, {[prop]: color});
      });
    };

    animateColor(document.querySelectorAll(".curseur"), "fill", colorCurrent);

    animateColor(
      document.querySelectorAll(".text-color-switch"),
      "color",
      colorCurrent
    );
    animateColor(
      document.querySelectorAll(".text-color-switch-h1"),
      "color",
      colorCurrent
    );
    animateColor(
      document.querySelectorAll(".color-switch-except-stroke"),
      "stroke",
      colorCurrent
    );
    animateColor(
      document.querySelectorAll(".color-switch-except-fill"),
      "fill",
      colorCurrent
    );
    animateColor(
      document.querySelectorAll(".list-card svg"),
      "fill",
      colorCurrent
    );

    document
      .querySelectorAll(".background-switch-color-next")
      .forEach((container) => {
        const color = nextColorIndex === 2 ? "#29292E" : colorNext;
        gsap.to(container, {backgroundColor: color});
        animateColor([container], "color", color);
      });

    // Application des couleurs spécifiques pour les icônes
    document.querySelectorAll(".color-switch").forEach((icon) => {
      const svgElement = icon.querySelector("svg");
      const paths = svgElement.querySelectorAll("path");
      const circle = svgElement.querySelector("circle");

      gsap.to(paths, {fill: currentColorIndex === 2 ? "black" : "white"});
      gsap.to(circle, {fill: colorCurrent});
    });

    // Application des couleurs aux "next" versions de stroke et path
    animateColor(
      document.querySelectorAll(".color-switch-except-stroke-next"),
      "stroke",
      colorNext
    );
    animateColor(
      document.querySelectorAll(".color-switch-except-path-next"),
      "path",
      colorNext
    );
  }

  static setStaticValue() {
    const detailMenu = document.querySelector(".detail-menu");
    const height = detailMenu.offsetHeight;
    gsap.set(".svg-line", {zIndex: -1});
    gsap.set("#lineLogo path", {drawSVG: "0% 0%"});
    gsap.set("#burgerDraw1", {drawSVG: "0% 0%"});
    gsap.set(".openMenu", {
      attr: {
        width: window.innerWidth,
        height: height,
        viewBox: `0 0 ${window.innerWidth} ${height}`,
      },
    });
  }
}
