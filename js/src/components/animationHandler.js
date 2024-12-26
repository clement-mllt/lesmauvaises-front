/** @format */
import { gsap } from "gsap";

import { CustomEase } from "gsap/CustomEase";
import { RoughEase, ExpoScaleEase, SlowMo } from "gsap/EasePack";

import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Draggable } from "gsap/Draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { EaselPlugin } from "gsap/EaselPlugin";
import { PixiPlugin } from "gsap/PixiPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { letterSource } from "./letterSource";
import { prepareAnimationHandler } from "./prepareAnimationHandler";

// THREE JS
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { PMREMGenerator } from "three";

gsap.registerPlugin(
    Flip,
    ScrollTrigger,
    Observer,
    ScrollToPlugin,
    Draggable,
    MotionPathPlugin,
    EaselPlugin,
    PixiPlugin,
    TextPlugin,
    RoughEase,
    ExpoScaleEase,
    SlowMo,
    CustomEase
);

export class animationHandler {
    static indexProject = 2;
    static isAnimating = false;

    static projects = {
        1: {
            title: "Sharp & Cheesy",
            description:
                "Studio de direction artistique très talentueux basé à Paris",
            image: "/wp-content/themes/lesmauvaises-front/assets/content/image-top/sharpandcheesy.png",
            link: "/projet/sharpandcheesy",
        },
        2: {
            title: "Galerie Diurne",
            description:
                "Une galerie d’art située dans le 16ème arrondissement",
            image: "/wp-content/themes/lesmauvaises-front/assets/content/image-top/diurne.png",
            link: "/projet/galeriediurne",
        },
    };

  static startHomepage(currentColor) {
    const tl = gsap.timeline();
    const tlProject = gsap.timeline();

        const container = document.getElementById("canvaContainer");
        const flashScreen = document.createElement("div");
        flashScreen.classList.add("flash-screen");
        container.appendChild(flashScreen);

    const timelineHeaderFirst =
      prepareAnimationHandler.animationFirstSectionHomepage(currentColor);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            60,
            container.offsetWidth / container.offsetHeight,
            0.1,
            100
        );

        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        container.appendChild(renderer.domElement);

        const pmremGenerator = new PMREMGenerator(renderer);
        const environment = new RoomEnvironment(pmremGenerator);
        scene.environment = pmremGenerator.fromScene(environment).texture;

        const loader = new GLTFLoader();
        loader.load(
            // "/wp-content/themes/lesmauvaises-front/assets/content/model/building.glb",
            "ici_faut_mettre_le_lien_du_glb",
            (gltf) => {
                const model = gltf.scene;
                scene.add(model);

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                model.scale.set(1, 1, 1);

                model.position.x -= 1.75;

                const door = model.getObjectByName("door");
                if (door) {
                    door.rotation.z = Math.PI;
                    const openDoor = () => {
                        gsap.to(door.rotation, {
                            z: Math.PI / 2.5,
                            duration: 1.6,
                            ease: "back.out",
                        });
                        gsap.to(camera.position, {
                            z: camera.position.z - 9,
                            duration: 1.5,
                            ease: "back.in",
                            onUpdate: () => {
                                gsap.to(flashScreen, {
                                    opacity: 1,
                                    backgroundColor: currentColor,
                                    delay: 1.2,
                                    duration: 0.15,
                                });
                            },
                            onStart: () => {
                                setTimeout(() => {
                                    window.location.href = "/realisations";
                                }, 500);
                            },
                        });
                        gsap.to(camera.position, {
                            y: -6,
                            duration: 1.2,
                            ease: "back.inOut",
                        });
                        gsap.to(camera.rotation, {
                            x: Math.PI / 30,
                            duration: 1.6,
                            ease: "back.in",
                        });
                    };

                    const closeDoor = () => {
                        gsap.to(door.rotation, {
                            z: Math.PI,
                            duration: 1,
                            ease: "power4.inOut",
                        });
                    };

                    container.addEventListener("click", () => {
                        door.rotation.z === Math.PI ? openDoor() : closeDoor();
                    });
                } else {
                    console.warn("Objet non trouvé dans le modèle chef !");
                }
            },
            undefined,
            (error) => {
                console.error("Erreur lors du chargement du modèle :", error);
            }
        );

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();

        scene.background = null;

        camera.position.y = -5;
        camera.position.z = 11.5;
        camera.rotation.x = Math.PI / 18;

        window.addEventListener("resize", () => {
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        });
    }

    static startHomepage() {
        const tl = gsap.timeline();
        const tlProject = gsap.timeline();

        animationHandler.loadEventContent(tl);
        animationHandler.loadContentFirstSection();
        animationHandler.loadSliderProject(tl, tlProject);

        const timelineHeaderFirst =
            prepareAnimationHandler.animationFirstSectionHomepage();

        ScrollTrigger.create({
            animation: timelineHeaderFirst,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            trigger: "#landingSection",
            start: "top",
            end: "bottom",
            id: "mainScrollTrigger",
        });
    }

    static loadSliderProject(tl, tlProject) {
        const duration = 7;
        const currentImageElement = document.getElementById("current-img");
        const currentTitleElement = document.querySelector(".current-title h2");
        const currentDescriptionElement =
            document.querySelector(".current-desc p");
        const currentNextProjectElement = document.querySelector(
            ".current-next-project p"
        );
        const barProgress = document.querySelector(".progress-project");

        if (!animationHandler.indexProject) {
            animationHandler.indexProject = 1;
        }

        if (
            !currentImageElement ||
            !currentTitleElement ||
            !currentDescriptionElement ||
            !currentNextProjectElement ||
            !barProgress
        ) {
            console.error(
                "Un ou plusieurs éléments du DOM nécessaires sont introuvables."
            );
            return;
        }

        const currentProject =
            animationHandler.projects[animationHandler.indexProject];
        const nextProjectTitle =
            animationHandler.projects[
                animationHandler.indexProject === 1 ? 2 : 1
            ].title;

        tl.to(barProgress, {
            duration: duration,
            width: "100%",
            onComplete: () => {
                if (currentProject && nextProjectTitle) {
                    animationHandler.updateProjectContent(
                        currentProject,
                        currentTitleElement,
                        currentDescriptionElement,
                        currentNextProjectElement,
                        nextProjectTitle
                    );
                } else {
                    console.error(
                        "Le projet ou le titre suivant est introuvable."
                    );
                }

                gsap.to(barProgress, {
                    duration: 0.5,
                    width: "0%",
                    onComplete: () => {
                        animationHandler.indexProject =
                            animationHandler.indexProject === 1 ? 2 : 1;

                        animationHandler.loadSliderProject(tl, tlProject);
                    },
                });
            },
            onEnter: () => {
                setTimeout(() => {
                    animationHandler.isAnimating = true;
                }, duration * 1000 - 1500);

                setTimeout(() => {
                    if (currentProject) {
                        animationHandler.updateProjectImage(
                            tlProject,
                            currentProject,
                            currentImageElement
                        );
                        animationHandler.updateProjectNumber();
                    } else {
                        console.error(
                            "Le projet actuel est introuvable pour updateProjectImage."
                        );
                    }
                }, duration * 1000 - 1000);
            },
        });
    }

    static updateProjectImage(tl, project, currentImageElement) {
        const scale = gsap.utils.random(-50, 50);

        tl.to(".main-img #distortion-scale", {
            duration: 0.5,
            attr: {
                scale: scale,
            },
        })
            .to(
                ".main-img #distortion-event",
                {
                    duration: 0.5,
                    attr: {
                        baseFrequency: "0.1 0.1",
                    },
                },
                "-=0.5"
            )
            .to(
                ".main-img #distortion-scale",
                {
                    duration: 0.3,
                    attr: {
                        scale: -100,
                    },
                },
                "-=0.4"
            )
            .to(
                ".main-img",
                {
                    duration: 0.3,
                    opacity: 0,
                },
                "-=0.3"
            )
            .to(
                ".main-img #distortion-scale",
                {
                    duration: 0.5,
                    attr: {
                        scale: -1000,
                    },
                    onComplete: () => {
                        currentImageElement.setAttribute("href", project.image);

                        tl.to(".main-img", {
                            duration: 0.5,
                            opacity: 1,
                        })
                            .to(
                                ".main-img #distortion-scale",
                                {
                                    duration: 0.3,
                                    attr: {
                                        scale: -100,
                                    },
                                },
                                "-=0.5"
                            )
                            .to(
                                ".main-img #distortion-event",
                                {
                                    duration: 0.3,
                                    ease: "power2.inOut",
                                    attr: {
                                        baseFrequency: "0.1 0.1",
                                    },
                                },
                                "-=0.3"
                            )
                            .to(
                                ".main-img #distortion-scale",
                                {
                                    duration: 0.3,
                                    attr: {
                                        scale: -50,
                                    },
                                },
                                "-=0.3"
                            )
                            .to(
                                ".main-img #distortion-scale",
                                {
                                    duration: 0.3,
                                    attr: {
                                        scale: 0,
                                    },
                                    onComplete: () => {
                                        animationHandler.isAnimating = false;
                                    },
                                },
                                "-=0.1"
                            );
                    },
                },
                "-=0.1"
            );
    }

    static updateProjectNumber() {
        const tlLetter = gsap.timeline();
        const currentNumberElement = document.querySelector(".number-project");
        const containerTypo = currentNumberElement.querySelector(".lm-typo");
        const lastLetter = currentNumberElement.querySelectorAll("svg path");
        tlLetter.to(lastLetter, {
            duration: 0.5,
            drawSVG: "0%",
            onComplete: () => {
                containerTypo.remove();
                animationHandler.setupAnimation(
                    currentNumberElement,
                    `0,${animationHandler.indexProject}`,
                    -8,
                    "#29292E",
                    0,
                    100,
                    1.5,
                    "right",
                    false,
                    "absolute"
                );
            },
        });
    }

    static updateProjectContent(
        project,
        currentTitleElement,
        currentDescriptionElement,
        currentNextProjectElement,
        titleNextProject
    ) {
        currentTitleElement.textContent = project.title;
        currentDescriptionElement.textContent = project.description;

        currentNextProjectElement.textContent = titleNextProject;
    }

    static loadEventContent(tl) {
        const img = document.getElementById("current-img");

        img.addEventListener("mousemove", () => {
            tl.pause();
            if (!animationHandler.isAnimating) {
                animationHandler.isAnimating = true;
                const randomFrequency = Math.random() * (0.009 - 0.003) + 0.003;
                const randomScale = Math.random() * (100 - 50) + 50;

                gsap.to(".main-img #distortion-scale", {
                    duration: 0.5,
                    attr: {
                        scale: randomScale,
                    },
                });
                gsap.to(".main-img #distortion-event", {
                    duration: 0.5,
                    attr: {
                        baseFrequency: `${randomFrequency} 0.01`,
                        // numOctaves: randomOctaves,
                    },
                    onComplete: () => {
                        animationHandler.isAnimating = false;
                    },
                });
            }
        });

        img.addEventListener("mouseleave", () => {
            tl.play();
            gsap.to("#distortion-event", {
                attr: {
                    baseFrequency: `0 0`,
                },
            });
            gsap.to("#distortion-scale", {
                attr: {
                    scale: 0,
                },
            });
        });

        // messageButton.addEventListener("click", () => {
        //   const tlTransitionClick = prepareAnimationHandler.animationClickButton();

        //   tlTransitionClick.play();

        //   tlTransitionClick.eventCallback("onComplete", () => {});
        // });
    }

    static loadContentFirstSection() {
        animationHandler.setupAnimation(
            document.querySelector(".number-project"),
            "0,1",
            -8,
            "#29292E",
            0,
            100,
            1.5,
            "right",
            false,
            "absolute"
        );

        animationHandler.setupAnimation(
            document.querySelector(".text-web"),
            "W,E,B,*,*,*,C,R,E,A",
            0,
            "#29292E",
            0,
            70,
            1.5,
            "left",
            false,
            "absolute"
        );

        animationHandler.setupAnimation(
            document.querySelector(".home-mauvaises"),
            "L,E,S,*,*,M,A,U,V,A,I,S,E,S",
            0,
            "#29292E",
            0,
            32,
            1.5,
            "left",
            true,
            "absolute"
        );
    }

    static setupAnimation(
        container,
        query,
        rotation,
        color,
        delay,
        size,
        division,
        direction,
        autoAdapt = false,
        position
    ) {
        letterSource
            .getLetters(query)
            .then((letters) => {
                const svgHTML = letters
                    .map((svg) =>
                        svg !== "*"
                            ? `<span>${svg}</span>`
                            : "<b class='space'></b>"
                    )
                    .join("");
                container.innerHTML += `<div class="lm-typo ${position} top rotate ro-${rotation} ${direction} index z-9">${svgHTML}</div>`;

                const tl = prepareAnimationHandler.animeLetterSource(
                    container,
                    size,
                    0.5,
                    color,
                    division
                );
                setTimeout(() => {
                    tl.play();

                    tl.eventCallback("onComplete", () => {
                        if (autoAdapt) {
                            const containerTypo =
                                container.querySelector(".lm-typo");
                            const sizeContainer =
                                container.getBoundingClientRect().width;
                            const sizecontainerTypo =
                                containerTypo.getBoundingClientRect().width;

                            const diff = sizeContainer - sizecontainerTypo;
                            gsap.to(containerTypo, {
                                x: diff / 2 + "px",
                                duration: 0.5,
                                ease: "power1.inOut",
                            });
                        }
                    });
                }, delay);
            })
            .catch(logError);

        function logError(error) {
            console.error("Une erreur s'est produite :", error);
        }
    }
}
