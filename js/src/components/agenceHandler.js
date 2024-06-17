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
import {InertiaPlugin} from "gsap/InertiaPlugin";
import {prepareAnimationHandler} from "./prepareAnimationHandler";
import {letterSource} from "./letterSource";

// import Swiper JS
import Swiper from "swiper";
// import Swiper styles
import "swiper/css";

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

  static animateTextOpacityOnScroll() {
    const text = new SplitText(".container-text h2", {type: "words"});
    const timeline = gsap.timeline({});
    const container = document.querySelector(".section-agency");

    // Crée un ScrollTrigger pour contrôler l'animation du header
    ScrollTrigger.create({
      animation: timeline,
      trigger: container,
      scrub: true,
      // pin: true,
      markers: true,
      start: "top+=100px bottom",
      end: `+=${container.clientHeight - 200}px`,
      ease: "power4.out",
    });

    text.words.forEach((word) => {
      timeline.from(word, {
        opacity: 0.1,
        duration: 0.1,
        onComplete: () => {
          const svgLineErase = `<svg class="erase-word" width="688.401978" height="100" viewBox="0 0 683 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_3876_44754" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="683" height="74">
          <path d="M495.248 3.03692C493.396 3.25708 491.543 3.47212 489.691 3.69228C489.766 4.04556 489.849 4.40395 489.924 4.75723C492.236 4.49611 495.391 4.79308 496.716 3.87148C501.837 0.31308 508.027 2.39692 513.682 1.931C514.419 1.86956 515.24 3.14444 516.249 3.47212C517.288 3.80492 518.614 3.73836 519.811 3.84076V1.17836C522.251 1.66988 524.6 2.14091 527.168 2.65803C527.221 2.56587 527.552 1.97708 528.064 1.07084C529.389 1.803 530.609 2.4686 531.867 3.16492C533.862 1.69036 535.865 -0.99253 538.131 3.47723C543.177 -2.15989 548.101 2.71948 553.395 3.61548C553.222 2.3662 553.101 1.48043 552.981 0.594668L553.726 0.43084C554.381 1.39852 555.044 2.36108 556.188 4.04556C556.987 2.46348 557.446 1.54188 557.973 0.492277C563.026 2.571 568.018 3.87659 573.492 0.758512C573.899 1.28075 574.644 2.25868 575.39 3.23148C575.902 2.96524 576.414 2.699 576.926 2.42764C577.009 1.69548 577.092 0.968438 577.144 0.476918C579.991 1.16812 582.461 1.76715 584.93 2.36107C585.171 -1.21269 588.567 0.656122 590.789 0.896762C591.948 1.02476 592.972 1.74156 594.268 2.28428C594.983 1.64428 595.849 0.866033 596.707 0.0877927C596.828 0.415473 596.948 0.738035 597.076 1.06571C598.703 0.958195 600.322 0.794352 601.948 0.758512C603.462 0.727792 604.983 0.901878 606.496 0.860918C617.272 0.574198 628.047 0.226042 638.83 0.000761477C640.065 -0.0248385 641.33 0.599791 643.469 1.15787C646.609 1.15787 651.044 0.932588 655.396 1.23467C658.634 1.45995 661.804 2.30476 664.952 2.98572C666.616 3.34412 669.153 3.723 669.53 4.491C669.989 5.43308 668.732 6.83084 667.986 7.96748C667.391 8.88396 666.345 9.6622 665.705 10.5684C661.578 16.4104 655.027 18.2843 645.005 17.4548C640.954 17.122 636.646 18.6632 632.4 18.8731C626.85 19.1496 621.248 18.8628 615.683 19.0062C614.034 19.0472 612.453 19.979 610.788 20.0763C595.631 20.9876 580.45 21.7044 565.307 22.6875C551.542 23.5784 537.815 24.7457 524.073 25.7646C518.636 26.1691 513.2 26.6401 507.74 26.8449C499.804 27.1419 491.814 26.978 483.908 27.4593C474.405 28.0328 464.955 29.0517 455.49 29.9374C454.744 30.0091 454.097 30.5672 453.57 31.5604C461.612 29.922 469.48 31.755 477.5 31.202C484.819 30.7003 492.357 31.6731 500.045 31.9803C501.716 32.0417 503.388 32.1799 505.06 32.1543C508.885 32.0827 512.71 31.8011 516.528 31.842C523.373 31.9137 530.217 32.3131 537.055 32.2875C542.589 32.267 548.139 31.5348 553.658 31.6423C560.33 31.7703 567.001 32.354 573.643 32.9223C580.443 33.506 587.204 34.3048 594.878 35.1035C593.319 38.0782 591.994 40.6024 590.397 43.6385C590.841 44.0533 591.941 45.067 593.033 46.0859L593.394 44.9083C598.417 45.195 603.447 45.4715 608.469 45.7684C609.403 45.8248 610.359 46.091 611.255 46.0091C616.187 45.5688 621.082 44.9595 626.029 44.6216C627.038 44.555 628.13 45.492 629.275 45.8196C630.095 46.0552 631.225 46.3009 631.948 46.1013C637.753 44.468 637.738 44.4373 642.482 46.1013C646.722 41.0581 651.255 47.8779 655.886 45.7889C655.487 45.4561 655.012 45.0568 654.146 44.3349C662.64 45.0107 670.757 45.4049 678.671 46.4955C680.305 46.7208 682.21 49.5726 682.075 51.1342C681.954 52.45 679.04 53.643 677.052 55.1227C679.394 57.8158 678.852 58.6043 672.7 58.4609C662.166 58.2203 651.639 57.5188 641.112 57.4779C634.071 57.4523 627.031 58.4097 619.968 58.6043C612.091 58.8245 604.192 58.6657 596.301 58.6913C587.144 58.722 577.988 58.7989 568.831 58.804C556.753 58.8142 544.675 58.6043 532.604 58.804C524.141 58.9422 515.707 59.787 507.243 59.9713C500.429 60.1198 493.599 59.6641 486.769 59.6488C482.906 59.6385 479.044 59.9867 475.181 60.1659C458.351 60.9544 441.537 61.9476 424.692 62.4648C411.936 62.8539 399.135 62.5211 386.357 62.7259C380.822 62.818 375.325 63.6168 369.791 63.8165C357.863 64.2414 345.921 64.482 333.978 64.7944C330.281 64.8916 326.569 64.9121 322.879 65.0709C311.426 65.5675 299.98 66.1 288.527 66.6376C271.81 67.4158 255.101 68.2657 238.385 68.962C233.174 69.1771 227.918 68.9979 222.692 68.9979C222.647 68.5934 222.594 68.1838 222.549 67.7793C232.903 67.3134 243.257 66.8424 255.079 66.3099C253.053 65.3678 251.788 64.2824 250.696 64.354C237.075 65.2603 223.468 66.3304 210.004 68.2964C213.393 68.0763 216.781 67.8613 220.17 67.6411C220.253 68.0302 220.343 68.4193 220.426 68.8084C213.197 70.923 205.125 69.7608 197.557 70.5339C189.575 71.3531 181.481 71.732 173.431 72.1979C165.329 72.6638 157.211 73.0017 150.073 73.3499C148.74 69.1105 147.588 65.4395 146.346 61.4766C148.883 61.9016 150.314 62.1422 151.745 62.3829C152.068 61.4049 152.4 60.427 152.648 59.6693C172.814 58.2305 193.416 56.756 214.018 55.2865C214.04 54.6721 214.07 54.0628 214.093 53.4484C207.519 54.3086 201.375 52.8904 195.08 52.7419C187.693 52.5678 180.276 52.9109 172.881 53.1976C165.532 53.4843 158.205 53.9758 150.879 54.3803C151.165 51.4875 151.398 49.0453 151.632 46.6798C143.71 46.8181 149.139 41.9848 145.728 40.3464C150.645 39.7371 154.839 39.22 159.403 38.6568C159.116 39.1534 158.755 39.7832 158.394 40.4129C158.702 40.6331 159.011 40.8532 159.312 41.0683C160.653 40.2081 161.985 39.3428 163.243 38.5339C166.217 41.3601 171.33 39.3275 175.841 39.0561C186.48 38.411 197.083 37.4638 207.692 36.6036C217.557 35.7998 227.421 34.955 237.278 34.1204C249.19 33.1067 261.103 32.0827 273.015 31.0689C285.003 30.0449 296.983 28.9902 308.979 28.0328C314.122 27.6232 319.302 27.4081 324.468 27.1112C333.662 26.5736 342.863 26.0718 352.05 25.4625C353.059 25.396 353.985 24.7508 356.538 23.7576C353.549 23.3787 351.982 22.964 350.469 23.0254C339.498 23.4913 328.541 24.1006 317.57 24.5665C305.884 25.0683 305.876 25.0222 303.361 26.507C299.882 24.2593 293.866 24.3873 291.426 26.3893H280.47C280.477 26.4507 280.485 26.507 280.493 26.5684C274.95 26.5684 269.386 26.3739 263.866 26.6145C256.419 26.9422 248.995 27.6129 241.562 28.1198C234.379 28.6113 227.195 29.1182 219.996 29.538C214.997 29.8299 209.936 29.7889 204.967 30.2343C198.995 30.7668 193.114 31.7704 187.151 32.354C183.122 32.7483 179.018 32.7636 174.952 32.9582C172.181 33.0913 169.402 33.1476 166.654 33.3883C159.455 34.0232 152.287 34.8065 145.081 35.4004C138.258 35.9636 131.406 36.3476 124.561 36.8289C113.726 37.5918 102.875 38.2472 92.0693 39.179C80.3827 40.1876 68.7489 41.4779 57.0774 42.5992C51.2718 43.1572 45.436 43.5413 39.6455 44.1505C32.5673 44.8929 25.5342 45.8452 18.456 46.603C12.5902 47.2328 6.68664 47.7038 0.80571 48.2516L0 47.2123C3.36591 46.1678 6.73182 45.1233 10.0977 44.0789C9.9396 43.6488 9.78147 43.2187 9.62334 42.7886C5.25594 44.043 1.68672 43.9355 2.69574 40.2337C3.06471 38.8769 5.76045 37.044 7.76343 36.788C18.5464 35.4261 29.4574 34.5403 40.3081 33.3985C50.9932 32.2721 61.6481 31.0331 72.4988 29.8248C72.3031 28.9851 72.0922 28.1147 71.8889 27.2443C73.41 30.475 76.5048 29.3384 79.5394 28.9083C84.4414 28.212 89.3962 27.6232 94.3735 27.2443C97.9653 26.9729 101.617 27.1419 105.247 27.0958C108.5 27.0549 108.47 27.0446 108.778 24.372C108.809 24.1262 109.464 23.6961 109.757 23.7217C110.458 23.7883 111.241 23.9726 111.753 24.29C112.671 24.8584 113.417 25.5598 114.238 26.2049C114.682 25.2987 115.126 24.3924 115.209 24.2286C120.156 24.7508 125.262 25.2884 130.796 25.8721V22.0168C131.24 21.8529 131.677 21.6942 132.121 21.5304C132.792 22.3496 133.462 23.1688 134.779 24.7713C136.91 24.5665 140.291 24.1467 143.703 23.9265C152.55 23.3531 161.428 22.964 170.246 22.2472C171.797 22.1192 173.13 20.7572 174.568 19.9636C174.47 19.467 174.365 18.9652 174.267 18.4686C176.059 19.2212 177.844 19.9739 180.592 21.131C180.84 20.9774 182.113 20.1889 183.393 19.4004C183.484 19.6923 183.581 19.9892 183.672 20.2811C185.102 20.0251 186.533 19.764 187.964 19.508L187.535 18.6734C190.223 19.1444 192.911 19.6155 195.607 20.0814L196.104 19.4926C195.456 19.124 194.801 18.7502 193.363 17.931H197.038C196.473 20.8033 199.809 20.1633 201.608 19.8612C203.543 19.5387 205.162 18.3508 206.171 17.89C209.884 18.3201 213.483 19.2212 216.962 19.0523C228.415 18.5044 239.838 17.6392 251.246 16.738C253.964 16.523 258.558 17.3217 257.006 13.1643C261.359 13.1899 265.771 12.0276 269.115 15.0331C269.499 15.3761 270.967 15.2584 271.916 15.1969C291.614 13.9528 311.32 12.6984 331.004 11.3672C331.817 11.3108 332.525 10.4814 333.263 9.995C333.782 9.65196 334.272 8.99148 334.769 8.99148C335.778 8.99148 337.126 9.15019 337.713 9.60587C339.392 10.9166 339.114 10.85 340.785 9.93867C342.141 9.20139 343.948 8.84299 344.076 8.80203C347.615 9.40619 349.829 9.78507 352.043 10.164C351.922 9.58539 351.802 9.01195 351.726 8.65867C354.655 9.00171 358.149 9.41132 361.636 9.82092C361.515 9.34476 361.402 8.86347 361.176 7.95723C362.969 8.80715 364.482 10.9729 366.696 8.05964C367.374 7.16876 373.315 8.1006 376.839 8.23884C378.345 8.29516 380.348 8.92492 381.274 8.47948C386.937 5.75052 394.873 5.4638 399.489 7.38892C404 6.8462 407.953 5.47916 409.941 6.30348C414.451 8.1774 417.606 5.74028 420.935 5.80684C429.639 5.98604 438.351 2.36107 447.071 5.58667C447.207 5.63787 451.695 7.30699 450.046 4.22987C451.19 3.98923 452.327 3.57963 453.487 3.52843C459.375 3.26219 465.279 3.08811 471.536 2.86795C471.943 3.72299 472.379 4.65484 472.733 5.40236C475.105 5.3102 477.229 5.23339 479.661 5.14123C479.541 4.45515 479.42 3.7486 479.126 2.08972C484.774 5.26412 489.811 2.22796 495.082 1.96684C495.15 2.30988 495.21 2.65291 495.278 2.99595L495.248 3.03692ZM247.285 24.5614C242.609 24.6024 237.925 24.587 233.249 24.7406C232.429 24.7662 231.66 25.5086 230.87 25.9182C231.442 26.3073 232.075 27.0753 232.579 27.0343C237.971 26.6145 243.34 26.0718 248.716 25.5649C264.439 25.5035 268.497 24.9352 269.491 21.858C261.803 22.795 254.544 23.6808 247.285 24.5614ZM303.226 21.7198C304.641 21.94 306.087 22.4008 307.48 22.3393C318.542 21.8529 329.603 21.2897 340.65 20.6651C341.252 20.6292 341.772 19.8356 342.321 19.3953C341.425 19.1137 340.514 18.5761 339.626 18.5915C332.683 18.7246 325.725 18.8372 318.798 19.211C313.587 19.4926 308.421 20.1428 303.241 20.6292C295.224 20.8136 291.082 21.713 290.816 23.3275C295.056 22.7796 299.137 22.2523 303.218 21.7198H303.226ZM276.682 63.7806C276.863 64.2772 277.051 64.779 277.232 65.2756C294.265 64.6408 311.29 64.011 328.413 63.3761C326.757 61.1438 323.203 60.7547 317.427 61.1131C305.515 61.8606 293.557 62.2344 281.622 62.8385C279.95 62.9256 278.331 63.4529 276.69 63.7755L276.682 63.7806ZM215.885 48.651C215.991 49.1272 216.096 49.6033 216.209 50.0795C233.942 49.2449 251.668 48.4104 269.401 47.5758C269.582 47.2533 269.755 46.9307 269.928 46.603C268.859 46.2088 267.759 45.4612 266.735 45.5073C265.297 45.5739 263.934 46.562 262.511 46.5876C253.136 46.7617 243.739 46.5877 234.371 46.9256C228.182 47.1509 222.045 48.052 215.878 48.6459L215.885 48.651ZM214.831 55.2507C228.468 54.2113 240.584 53.2897 253.332 52.3169C248.746 50.2945 218.686 52.1173 214.831 55.2507ZM654.846 55.7269C649.146 52.363 634.056 52.3425 628.266 55.7269H654.846ZM329.181 44.8929L329.031 43.4337C319.317 43.8484 309.603 44.2683 299.89 44.683C299.935 45.1182 299.98 45.5534 300.033 45.9835C309.747 45.62 319.468 45.2564 329.181 44.8929ZM415.46 60.002C410.769 56.971 401.477 57.4523 399.406 60.002H415.46ZM364.399 30.8334C364.422 31.4069 364.437 31.9803 364.46 32.5486C371.869 32.2363 379.286 31.924 386.696 31.6116C386.711 31.2532 386.718 30.8897 386.726 30.5313C379.309 27.8177 371.816 32.8404 364.392 30.8283L364.399 30.8334ZM228.513 25.5752C228.264 25.2526 228.023 24.93 227.775 24.6023C222.948 25.1963 218.122 25.7953 213.295 26.3893C213.468 26.9064 213.641 27.4184 213.814 27.9355C218.573 26.7374 224.462 28.8724 228.513 25.57V25.5752ZM373.3 61.1387C377.456 60.3809 382.644 62.5057 387.381 59.1009C381.289 58.7067 376.62 58.0411 373.3 61.1387Z" fill="#28282D" style="stroke-dashoffset: 0; stroke-dasharray: none;"></path>
          </mask>
          <g mask="url(#mask0_3876_44754)">
          <path d="M-0.5 40L392 13.5L671 8L147 48L595.5 38L147 66L682.5 50.5" stroke="#28282D" stroke-width="17" style="stroke-dashoffset: 0; stroke-dasharray: none;"></path>
          </g>
          </svg>`;
          if (word.innerHTML == "mauvaises" && word.style.opacity >= 0.5) {
            word.innerHTML += svgLineErase;

            const svgElement = document.querySelector(".erase-word");
            const pathElement = svgElement.querySelectorAll("path");
            gsap.set(svgElement, {
              drawSVG: "0%",
              attr: {
                with: word.getBoundingClientRect().width,
                height: word.getBoundingClientRect().height,
              },
            });
            gsap.to(pathElement, {
              drawSVG: "100%",
              stroke: "#FFFFFF",
              duration: 1,
              onComplete: function () {
                letterSource
                  .getLetters("M,A,U,V,A,I,S,E,S")
                  .then((letters) => {
                    const container = word;
                    const svgHTML = letters
                      .map((svg) =>
                        svg != "*"
                          ? "<span>" + svg + "</span>"
                          : "<b class='space'></b>"
                      )
                      .join("");
                    container.innerHTML += `<div class="lm-typo top index z-9 rotate ro--350">${svgHTML}</div>`;
                    const title = word.closest(".elementor-heading-title");
                    const fontSize = window.getComputedStyle(title).fontSize;

                    const tlLetterSourceAnime =
                      prepareAnimationHandler.animeLetterSource(
                        container,
                        fontSize - 5,
                        0.5,
                        "#C62369",
                        1.5
                      );
                    return tlLetterSourceAnime.play();
                  })
                  .catch((error) => {
                    console.error("Une erreur s'est produite :", error);
                  });
              },
            });
          } else if (
            word.innerHTML == "Bosser" ||
            word.innerHTML == "avec" ||
            word.innerHTML == "nous," ||
            word.innerHTML == "concept" ||
            word.innerHTML == "solide," ||
            word.innerHTML == "univers" ||
            word.innerHTML == "captivant" ||
            word.innerHTML == "et" ||
            word.innerHTML == "une" ||
            word.innerHTML == "identité" ||
            word.innerHTML == "unique"
          ) {
            const title = word.closest(".elementor-heading-title");
            const fontSize = window.getComputedStyle(title).fontSize;
            gsap.to(word, {
              fontWeight: 900,
              fontSize: fontSize + 7,
              ease: "elastic",
              duration: 1,
            });
          }
        },
      });
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
                "P,A,R,C,E,*,Q,U,*,E,N,*,P,L,U,S,*,D,*,E,T,R,E,*,T,R,E,S,*,F,O,R,T,S,*,O,N,*,L,E,*,F,A,I,T,*,T,O,U,J,O,U,R,S,*,A,V,E,C,*,H,U,M,O,U,R"
              )
              .then((letters) => {
                const container = document.querySelector(
                  ".desc-section-skills"
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
