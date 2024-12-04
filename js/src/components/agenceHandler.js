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
import { menuHandler } from "./menuHandler";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { prepareAnimationHandler } from "./prepareAnimationHandler";
import { letterSource } from "./letterSource";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// import Swiper JS
import Swiper from "swiper";
// import Swiper styles
import "swiper/css";
import { info } from "sass";

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
    const text = new SplitText(".container-text h2", { type: "words" });
    const container = document.querySelector(".section-agency");

    // Crée un ScrollTrigger pour contrôler l'animation du header
    const scrollTriggerConfig = {
      trigger: container,
      scrub: true,
      start: "top+=100px bottom",
      end: `+=${container.clientHeight - 200}px`,
      ease: "power4.out",
    };

    // Timeline globale
    const timeline = gsap.timeline({ scrollTrigger: scrollTriggerConfig });

    text.words.forEach((word) => {
      // Crée une animation pour chaque mot
      const wordTimeline = gsap.timeline();

      wordTimeline.from(word, {
        opacity: 0,
        duration: 0.5,
      });

      // Animation pour le mot spécifique "mauvaises"
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
              { drawSVG: "0%" },
              { drawSVG: "100%", duration: 1 }
            );
          },
        });
      }

      // Ajouter l'animation à la timeline globale
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
      fadeEffect: { crossFade: true },
      spaceBetween: 0,
      loop: true,
      autoplay: false,
    });

    Draggable.create(lever, {
      type: "rotation",
      inertia: false,
      bounds: { minX: -40, minY: -40, maxX: 40, maxY: 40 },
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

  // faire des objet de personnes
  // recuperer avec l'id les bon assets pour le info

  // ajouter que ue seul fois le 1 pour la photo pas 2 fois ptn

  static Initialize3dRendered() {
    let navBar = document.querySelector(".elementor-element-26a7de8");
    console.log("LA NAV BAR :", navBar);

    function hideNavBar() {
      Object.assign(navBar.style, {
        "background-color": "transparent",
      });
    }

    function afficherNavBAr() {
      Object.assign(navBar.style, {
        "background-color": "var( --e-global-color-1fe2b94 )",
      });
    }

    ScrollTrigger.create({
      trigger: "#GUNplace",
      start: "top center",
      end: "bottom center",
      onEnter: () => hideNavBar(),
      onLeave: () => afficherNavBAr(),
      onEnterBack: () => hideNavBar(),
      onLeaveBack: () => afficherNavBAr(),
    });

    setTimeout(() => {
      const equipe = [
        {
          prenom: "Clement",
          photo1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/clément.png",
          photo2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/clément1.png",
          phrase:
            "En tant que chef de projet technique ( il a insisté sur le terme chef…), il s’occupe de la gestion du projet au sens large du terme : planification, coordination, communication, surveillance et assurance qualité (ça commence à faire beaucoup là non ?).En interne, il est responsable de la supervision et du management des équipes ( en vrai, il mange surtout des trésors pendant les réunions d'équipe ) pour garantir la réussite de nos missions.",
          bagde1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/MrMme.png",
          badge2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/animal.png",
          badge3:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/song.png",
        },
        {
          prenom: "Carla",
          photo1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/carla.png",
          photo2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/carla1.png",
          phrase:
            "Elle a rejoint l’agence en <span class='yellowText'>tant que Responsable communication et marketing. Véritable couteau</span> suisse (elle a insisté pour qu’on le dise), elle est en charge de l’animation des réseaux sociaux (même si elle préférerait faire des tiktoks), des échanges avec vous et elle contribue à la conception de la ligne éditoriale (en vrai on sait pas vraiment ce qu’elle fait mais elle le fait trop bien).",
          bagde1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/MrMme.png",
          badge2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/animal.png",
          badge3:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/song.png",
        },
        {
          prenom: "Ines",
          photo1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/ines.png",
          photo2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/ines1.png",
          phrase:
            "Elle gère la gestion des campagnes de communication des clients mais aussi de l’agence, la visibilité en ligne et les stratégies marketing à élaborer. Elle s’occupe de la création de contenu et de la gestion des réseaux sociaux en analysant les performances des campagnes (personne peut la test). stratégies créatives et efficaces. Elle aime explorer de nouvelles trends et tendances marketing et de communication, recherche des moyens de capter l’attention du public.",
          bagde1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/MrMme.png",
          badge2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/animal.png",
          badge3:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/song.png",
        },
        {
          prenom: "Lucas",
          photo1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/lucas.png",
          photo2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/lucas1.png",
          phrase:
            "Au sein de l’équipe dév', Lucas c’est développeur Full Stack (ou plutôt la petite chippie). Son rôle consiste à travailler sur le front des projets, en s’assurant que toute l'étendue du projet matche avec la marque. Il adore que le pole com et créa lui lance des défis toujours plus fou à réalisé (ban pas sûr que ce soit vraiment le cas). Il aime décortiquer les nouvelles technos (une vrai petite fouine celui-là). ",
          bagde1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/MrMme.png",
          badge2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/animal.png",
          badge3:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/song.png",
        },
        {
          prenom: "Matteo",
          photo1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/mattheo.png",
          photo2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/mattheo1.png",
          phrase: "",
          bagde1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/MrMme.png",
          badge2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/animal.png",
          badge3:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/song.png",
        },
        {
          prenom: "Manel",
          photo1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/manel.png",
          photo2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/manel1.png",
          phrase:
            "Elle gère la coordination et l’avancée des projets en veillant à ce que toutes les équipes boss ensemble pour atteindre leurs goals (ça lui fait plaisir d’être un petit chef). Elle suit les projets de la phase de conception à la livraison (…). Toujours à courir à droite à gauche, elle fait un coucou à la créa’ pour aller debrief au pôle dév’ et faire la passe décisive au pôle com’.",
          bagde1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/MrMme.png",
          badge2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/animal.png",
          badge3:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/song.png",
        },
        {
          prenom: "Marie",
          photo1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/marie.png",
          photo2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/marie1.png",
          phrase:
            "Directrice artistique, elle imagine et façonne l’univers visuel des marques, que ce soit pour le print ou le digital (mais quelle star). Son rôle, c’est de construire une identité forte, qui claque et qui dure dans le temps. Elle jongle entre couleurs, formes et typographies pour donner vie à tous les projets et marquer les esprits. Elle sait allier les tendances aux designs intemporels pour créer des conceptions uniques et sur-mesure (c’est la Christina Cordula du design).",
          bagde1:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/MrMme.png",
          badge2:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/animal.png",
          badge3:
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/equipe/badge/song.png",
        },
      ];

      // on enter
      let baseCursor = document.querySelector(".container-curseur");
      let gunPlace = document.querySelector("#GUNplace");

      const scene = new THREE.Scene();
      scene.background = null; // Transparence de la scène

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.set(0, 1, 10); // Position de la caméra
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      gunPlace.innerHTML = `
      <div class="GunScene">

     <img src="/wp-content/themes/lesmauvaises-front/assets/content/gun/cursor1.cur" 
      alt="Cursor" 
      class="custom-cursor" 
      id="customCursor" 
      style="position: absolute;pointer-events: none; transform: translate(-50%, -50%); z-index: 500;">

    <div class="img1 images">
      <img id='0' src="${equipe[0].photo1}" class="photo" alt="clement">
    </div>
    
    <div class="img2 images">
      <img id='1' src="${equipe[1].photo1}" class="photo" alt="carla">
    </div>
    
    <div class="img3 images">
      <img id='2' src="${equipe[2].photo1}" class="photo" alt="ines" style='height: 15em; width: 15em;'>
    </div>
    
    <div class="img4 images">
      <img id='3' src="${equipe[3].photo1}" class="photo" alt="lucas" style='height: 15em; width: 15em;'>
    </div>
    
    <div class="img5 images">
      <img id='4' src="${equipe[4].photo1}" class="photo" alt="matthéo" style='height: 15em; width: 15em;'>
    </div>
    
    <div class="img6 images">
      <img id='5' src="${equipe[5].photo1}" class="photo" alt="manel" style='height: 15em; width: 15em;'>
    </div>
    
    <div class="img7 images">
      <img id='6' src="${equipe[6].photo1}" class="photo" alt="marie">
    </div>


    <div  class="info" id="info">
      <!-- Colonne gauche -->
      <div class="infoDetails detailsImg">
        <img id='hasBeenShootTeam' src=''>
        <img id='hasBeenShootBille' src='/wp-content/themes/lesmauvaises-front/assets/content/gun/bille9.png'>
      </div>

      <!-- Colonne droite -->
      <div class="infoDetails detailsText">

        <!-- Ligne 1 -->
        <div class="div_btnClose">
          <button id='btnCLose'>X</button>
        </div>

        <!-- Ligne 2 -->
        <div class="div_teamName">
          <h3 id="teamName"></h3>
        </div>

        <!-- Ligne 3 -->
        <div class="row">
          <p id='teamPhrase'></p>
        </div>

        <!-- Ligne 4 avec 3 colonnes -->
        <div class="badges">
          <div class="MrMme"><img id="MrMme" src=""></div>
          <div class="Animal"><img id="Animal" src=""></div>
          <div class="Song"><img id="Song" src=""></div>
        </div>

      </div>
    </div>

    
  </div>
      `;
      gunPlace.appendChild(renderer.domElement);

      let customCursor = document.querySelector("#customCursor");

      // Ajouter la classe "hidden" lors de l'entrée dans la div
      gunPlace.addEventListener("mouseenter", () => {
        gsap.to(baseCursor, {
          onStart: () => baseCursor.classList.add("hidden"), // Ajout de la classe
        });
      });

      // Enlever la classe "hidden" lors de la sortie de la div
      gunPlace.addEventListener("mouseleave", () => {
        gsap.to(baseCursor, {
          onStart: () => baseCursor.classList.remove("hidden"), // Suppression de la classe
        });
      });

      // Écouter le mouvement de la souris
      gunPlace.addEventListener("mousemove", (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Mettre à jour la position du curseur
        customCursor.style.left = `${(mouseX - customCursor.offsetWidth / 2.2) + 10}px`;
        customCursor.style.top = `${(mouseY - customCursor.offsetHeight / 2.2 + 20)}px`;
      });

      // Chargement de la texture
      const textureLoader = new THREE.TextureLoader();
      const texture = textureLoader.load(
        "/wp-content/themes/lesmauvaises-front/assets/content/gun/Material__26-color.png",
        (tex) => {
          tex.flipY = false; // Inverser l'axe Y pour correspondre à Blender
        }
      );

      // Chargement du modèle GLTF
      const loader = new GLTFLoader();
      let model;

      // Chemin vers le fichier GLB
      const modelUrl =
        "/wp-content/themes/lesmauvaises-front/assets/content/gun/untitled.glb";

      // Chargement du modèle GLTF
      loader.load(
        modelUrl,
        (gltf) => {
          model = gltf.scene;

          // Normaliser l'échelle et recentrer le modèle
          model.scale.set(1.5, 1.5, 1.5); // Ajustez si nécessaire
          model.position.set(0, -9, 0); // Ajustez selon vos besoins

          // Appliquer la texture en préservant les UVs configurés dans Blender
          model.traverse((child) => {
            if (child.isMesh) {
              child.material = new THREE.MeshStandardMaterial({
                map: texture, // Appliquer la texture
              });
              child.material.needsUpdate = true;
            }
          });

          // Ajouter le modèle à la scène
          scene.add(model);
        },
        (xhr) => {
          console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          console.error("Erreur de chargement du modèle GLTF :", error);
        }
      );

      // Lumières
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lumière douce
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
      directionalLight.position.set(10, 10, 10);
      scene.add(directionalLight);

      function cursor() {
        document.addEventListener("mousemove", (event) => {
          const mouseX = event.clientX;
          const mouseY = event.clientY;

          if (model) {
            // Rotation dynamique du modèle
            model.rotation.y = -(mouseX * Math.PI * 0.0005); // Rotation sur l'axe Y
            model.rotation.x = -(mouseY * Math.PI * 0.0005) + 0.8; // Rotation sur l'axe X
          }
        });
      }

      let isActive = false;

      //Recule du pistolet
      function shootAnimation() {
        let scene = document.querySelector("#GUNplace");
        scene.addEventListener("click", function () {
          model.rotation.x += 0.2;
          model.position.y += 1;
          setTimeout(() => {
            model.rotation.x -= 0.2;
            model.position.y -= 1;
          }, 100);
        });

        //Musique en arriere plan
        const piou = new Audio(
          "/wp-content/themes/lesmauvaises-front/assets/content/gun/PIOU.mp3"
        );

        // Gestion des tirs
        scene.addEventListener("click", (event) => {
          const musique = new Audio(
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/BGmusiq.mp3"
          );
          if (!isActive) {
            musique.play();
            isActive = true;
          }
          piou.play();

          const clickedElement = event.target;
          console.log(clickedElement);

          let infoSection = document.querySelector("#info");

          // ANIMATION DE LA BILLE
          if (
            clickedElement.tagName === "IMG" &&
            clickedElement.classList != "bille"
          ) {
            console.log("LA SOURCE", clickedElement.src);

            let imageSrc = clickedElement.src;
            let imgId = clickedElement.id;

            let imgToChange = document.querySelector("#hasBeenShootTeam");
            let teamName = document.querySelector("#teamName");
            let teamPhrase = document.querySelector("#teamPhrase");

            let MrMme = document.querySelector("#MrMme");
            let Animal = document.querySelector("#Animal");
            let Song = document.querySelector("#Song");

            MrMme.classList.add("stamp");
            setTimeout(() => {
              Animal.classList.add("stamp");
            }, 1500);

            setTimeout(() => {
              Song.classList.add("stamp");
            }, 3000);

            imgToChange.src = equipe[imgId].photo2;

            const indexFromEnd = 4; // Conserver la logique d'origine
            const positionFromStart = imageSrc.length - indexFromEnd;

            // Vérifie si le caractère à la position est déjà "1"
            if (imageSrc[positionFromStart - 1] !== "1") {
              let before = imageSrc.slice(0, positionFromStart);
              let after = imageSrc.slice(positionFromStart);
              imageSrc = before + "1" + after;
            } else {
              console.log("Le caractère à la position -5 est déjà un '1'. Aucun changement effectué.");
            }


            clickedElement.src = imageSrc;

            const prenom = equipe[imgId].prenom; // Exemple : "Jean"
            const splitName = prenom.split("").join(","); // Résultat : "J,e,a,n"
            console.log(splitName);

            letterSource.getLetters(splitName).then((letters) => {
              if (teamName.innerHTML.trim() !== "") {
                teamName.innerHTML = ""; // Supprimer le contenu existant
              }
              const svgHTML = letters
                .map((svg) =>
                  svg !== "*"
                    ? "<span>" + svg + "</span>"
                    : '<b class="space"></b>'
                )
                .join("");
              teamName.innerHTML +=
                '<div class="lm-typo index z-20">' + svgHTML + "</div>";
              const tlLetterSourceAnime =
                prepareAnimationHandler.animeLetterSource(
                  teamName,
                  130,
                  3,
                  "#FFFFFF",
                  1.5
                );
              tlLetterSourceAnime.play();
            });

            // Mettre à jour le contenu HTML de `teamName`
            // teamName.innerHTML = teamSourceAnime.play();

            teamName.classList.add("rotateText");
            teamPhrase.innerHTML = `${equipe[imgId].phrase}`;

            MrMme.src = equipe[imgId].bagde1;
            Animal.src = equipe[imgId].badge2;
            Song.src = equipe[imgId].badge3;

            clickedElement.classList.add(`HasBeenShoot${imgId}`);

            setTimeout(() => {
              infoSection.classList.remove("hidden");
              Object.assign(infoSection.style, {
                display: "flex",
                "align-items": "center",
                "justify-content": "center",
              });
            }, 1100);
            setTimeout(() => {
              clickedElement.classList.remove("HasBeenShoot");
            }, 10000);
          }

          const img = document.createElement("img");
          const images = [
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/bille5.png",
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/bille7.png",
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/bille8.png",
            "/wp-content/themes/lesmauvaises-front/assets/content/gun/bille9.png",
          ];

          let index = 1;

          function displayNextImage() {
            img.src = images[index]; // Affiche l'image actuelle
            index++; // Passe à l'image suivante
            console.log(images[index]);
            if (index < 3) {
              setTimeout(displayNextImage, 100); // Continue la séquence
            }
          }
          img.src = images[0]; // Démarre avec la première image
          displayNextImage();

          img.classList.add("bille"); // Ajouter une classe pour le style
          const position = clickedElement.getBoundingClientRect(); // recuperer la position de l'élément sur lequel on clique

          if (
            clickedElement.tagName === "CANVAS" ||
            (clickedElement.tagName === "IMG" &&
              clickedElement.classList == "bille")
          ) {
            Object.assign(img.style, {
              position: "absolute",
              left: `${event.screenX - 45}px`,
              top: `${event.screenY - 165}px`,
              display: "block",
              zIndex: 4,
              height: "55px",
            });
            gunPlace.appendChild(img);
            if (
              (clickedElement.tagName === "IMG" &&
              clickedElement.classList == "bille" ) ||
              clickedElement.tagName == 'BUTTON'
            )
              return;
          } else {
            console.log(position);
            Object.assign(img.style, {
              position: "absolute",
              left: `${event.clientX - position.left - 40}px`,
              top: `${event.clientY - position.top}px`,
              display: "block",
              zIndex: 15,
              height: "55px",
            });
            console.log("je clique ici ", clickedElement);
            clickedElement.parentNode.appendChild(img);
          }
        });
      }

      let btnCLose = document.querySelector("#btnCLose");
      let infoSection = document.querySelector("#info");

      btnCLose.addEventListener("click", () => {
        setTimeout(() => {
          console.log("INFO SECTION", infoSection);
          infoSection.classList.add("hidden");
          Object.assign(infoSection.style, {
            display: "none",
          });
        }, 100);
        console.log("INFO SECTION", infoSection);
      });

      function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      }

      animate();
      cursor();
      shootAnimation();
    }, 2000);
  }
}
