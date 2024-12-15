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

import Matter from "matter-js";
import {Engine, Render, World, Bodies} from "matter-js";

import {PhysicsPropsPlugin} from "gsap/PhysicsPropsPlugin.js";
import {color, text} from "d3";
import { projectHandler } from "./projectHandler";

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

      let render = Matter.Render.create({
        element: document.querySelector(".loader"),
        engine: engine,
        options: {
          width: width,
          height: height,
          background: "transparent",
          wireframes: false,
        },
      });

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const numberBallW = Math.floor(windowWidth / 200);
      const numberBallH = Math.floor(windowHeight / 200);

      let balls = [];
      let svgs = [];
      let xBalls = 0;
      let yball = -200;
      const loader = document.querySelector(".loader");
      const color = ["violet", "rose", "noir"];

      for (let i = 0; i < Math.floor(numberBallH); i++) {
        xBalls = 0;

        for (let j = 0; j < numberBallW; j++) {
          let radius = Math.random() * (140 - 80) + 80;
          let mass = Math.random() * (100 - 8) + 8;
          let ball = Matter.Bodies.circle(xBalls + 200, yball, radius, {
            restitution: 0.9,
            mass: mass,
            isStatic: false,
            angle: Math.random() * Math.PI * 2,
            angularVelocity: (Math.random() * 2 - 1) * Math.PI,
            render: {
              fillStyle: "transparent",
              strokeStyle: "transparent",
              lineWidth: 0,
            },
          });
          xBalls += radius + 50;

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

      let mouseConstraint = Matter.MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

      Matter.World.add(world, mouseConstraint);

      render.mouse = mouse;

      let obstacleZero = Matter.Bodies.rectangle(
        width / 2 + 50,
        height / 2 + 25,
        200,
        100,
        {
          isStatic: true,
          render: {
            visible: false,
          },
        }
      );

      Matter.World.add(world, obstacleZero);

      loader.insertAdjacentHTML("beforeend", `<div class="zero-text">0</div>`);

      let zeroText = document.querySelector(".zero-text");

      zeroText.style.position = "absolute";
      zeroText.style.top = `${height / 2 - 50}px`;
      zeroText.style.left = `${width / 2 - 50}px`;
      zeroText.style.fontFamily = "'MADE SOULMAZE', Sans-serif";
      zeroText.style.fontSize = "100px";

      zeroText.style.color = "#28282D";

      Matter.World.add(world, [leftWall, rightWall, ground, ...balls]);

      Matter.Runner.run(engine);
      Matter.Render.run(render);

      function updateSVGPositions() {
        requestAnimationFrame(updateSVGPositions);

        for (let i = 0; i < balls.length; i++) {
          let ball = balls[i];
          let svg = svgs[i];

          const nouvelleLargeur = (ball.circleRadius + 3) * 2;
          const nouvelleHauteur = (ball.circleRadius + 3) * 2;

          const facteurEchelle =
            nouvelleLargeur / parseFloat(svg.getAttribute("width"));

          svg.setAttribute("width", nouvelleLargeur + "px");
          svg.setAttribute("height", nouvelleHauteur + "px");
          svg.style.width = nouvelleLargeur + "px";
          svg.style.height = nouvelleHauteur + "px";
          svg.style.transform = "scale(" + facteurEchelle + ")";
          svg.style.zIndex = "-1";

          svg.style.transform += `rotate(${ball.angle}rad)`;
          svg.style.transformOrigin = `${nouvelleLargeur / 2}px ${
            nouvelleHauteur / 2
          }px`;
          svg.style.top = `${ball.position.y - ball.circleRadius}px`;
          svg.style.left = `${ball.position.x - ball.circleRadius}px`;
        }
      }

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
    let newY = window.innerHeight - 115;

    gsap.to(obj, {
      duration: 2,
      y: newY,
      ease: "bounce.out",
      onComplete: () => {
        menuHandler.checkInteractions(obj);

        menuHandler.animateBall(obj);
      },
    });
  }

  static checkInteractions(currentObj) {
    const objs = document.querySelectorAll(".obj");
    objs.forEach((obj) => {
      if (obj !== currentObj && this.isClose(obj, currentObj)) {
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
    return distance < 50;
  }

  static loadCursor() {
    let container = document.querySelector(".curseur");
    let containerDetail = container.querySelector(".elementor-icon");
    let cursor = container.querySelector("svg");

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
    textOverlay.style.opacity = "0";
    textOverlay.style.pointerEvents = "none";
    textOverlay.classList.add("text-overlay");

    containerDetail.appendChild(textOverlay);

    function updatePosition(e) {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const offsetX = mouseX - svgWidth / 2;
      const offsetY = mouseY - svgHeight / 2;

      gsap.to([cursor, textOverlay], {
        duration: 0.2,
        x: offsetX - 12,
        y: offsetY - 12,
        ease: "power2.out",
      });
    }

    document.addEventListener("mousemove", updatePosition);
  }

  static cursorMorph() {
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

    document.querySelectorAll("a").forEach((link) => {
      link.addEventListener("mouseenter", () => {
        morphTl.pause();

        gsap.to(".curseur #start", {
          duration: 0.5,
          morphSVG: ".curseur #reset",
          ease: "linear",
        });
      });

      link.addEventListener("mouseleave", () => {
        gsap.to(".curseur #start", {
          duration: 0.5,
          morphSVG: ".curseur #start",
          ease: "linear",
          onStart: () => {
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
      projectHandler.switchBackgroundColor()

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

    document.querySelectorAll(".color-switch").forEach((icon) => {
      const svgElement = icon.querySelector("svg");
      const paths = svgElement.querySelectorAll("path");
      const circle = svgElement.querySelector("circle");

      gsap.to(paths, {fill: currentColorIndex === 2 ? "black" : "white"});
      gsap.to(circle, {fill: colorCurrent});
    });

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
