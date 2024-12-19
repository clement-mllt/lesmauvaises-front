import gsap from "gsap";
import { Draggable, DrawSVGPlugin, SplitText } from "gsap/all";
import { letterSource } from "./letterSource";
import { prepareAnimationHandler } from "./prepareAnimationHandler";
import { utilsHandler } from "./utilsHandler";
import Matter from "matter-js";

gsap.registerPlugin(DrawSVGPlugin)

export class contactHandler {
    // TEXT APPARITION ON LOAD
    static contactTextApparition() {
        // GSAP INIT
        const tl = gsap.timeline({ paused: true })
        

        // TITLE
        const title = document.querySelector('h2')
        const splitTitle = new SplitText(title, { type: "chars, words" })
        const chars = splitTitle.chars
        chars.forEach((char) => char.classList.add('character'))

        // SVG ERASING LINE
        const eraseLine = document.querySelectorAll(".line-erase-mauvaises path")

        // CONTAINER SIZES
        const titleSizes = title.getBoundingClientRect()
        const {width, height, top, bottom, left, right} = titleSizes

        // LOCAL COLORS
        const currentIndexColor = localStorage.getItem('currentColorIndex')
        const currentColor = prepareAnimationHandler.colors[currentIndexColor]

        // CONTACT BUTTONS
        const buttons = document.querySelectorAll('.button');

        buttons.forEach((button) => {
            const overlay = document.createElement('div');
            overlay.classList.add("overlay");
            button.appendChild(overlay);

            const svgContainer = document.createElement('span')
            svgContainer.classList.add('svgContainer')
            svgContainer.innerHTML = utilsHandler.arrowSvg
            button.appendChild(svgContainer)

            const arrowPath = button.querySelectorAll('path')

            gsap.set(arrowPath, { drawSVG: 0 })

            button.addEventListener('mouseenter', () => {
                overlay.style.backgroundColor = currentColor;
                overlay.style.borderColor = currentColor;

                gsap.to(arrowPath, {
                    drawSVG: 0
                }, {
                    drawSVG: 1,
                    stroke: currentColor,
                    duration: 0.25
                })
            });

            button.addEventListener('mouseleave', () => {
                overlay.style.backgroundColor = "transparent";
                overlay.style.borderColor = "#ffffff";
            });
        });

        tl.to(chars, {
            y: 0,
            opacity: 1,
            ease: "power4.inOut",
            stagger: 0.05,
        }).fromTo(eraseLine, {
            drawSVG: "0%",
        }, {
            drawSVG: "100%",
            stroke: currentColor,
            duration: 1.2,
            ease: "power4.inOut",
            onComplete: () => {
                letterSource
                    .getLetters("N,O,U,S,*,P,E,C,H,O")
                    .then((letters) => {
                        const container = document.querySelector(
                            ".customSvgContainer"
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
                                250,
                                0.25,
                                currentColor,
                                1.6
                            );
                        return tlLetterSourceAnime.play();

                    })
                    .catch((error) => {
                        console.error("Une erreur s'est produite :", error);
                    })
            },
        }).fromTo(buttons, {
            y: 15,
            opacity: 0,
        }, {
            y: 0,
            opacity: 1,
            duration: 0.1,
            stagger: 0.1,
        }, "+=2")

        // LAUNCH TIMELINE
        tl.play()
    }

    // CARD ROTATION AND APPARITION
    static animateFormCard() {
        // GSAP TIMELINE INIT
        const tl = gsap.timeline({ paused: true })

        // LOCAL COLORS
        const currentIndexColor = localStorage.getItem('currentColorIndex')
        const currentColor = prepareAnimationHandler.colors[currentIndexColor]

        // CONTACT BUTTONS
        const buttons = document.querySelectorAll('.button');
        const ballCardButton = document.querySelector('.calendarButton')

        // CREATE BORDER OVERLAY FOR BUTTON
        const overlay = document.createElement('span');
        overlay.classList.add("overlay");

        // CREATE SPAN FOR ARROW SVG
        const svg = document.createElement('span')
        svg.classList.add('utilsHandler.arrowSvg')
        svg.innerHTML = utilsHandler.arrowSvg

        // CONTACT FORM
        const formContainer = document.querySelector('.formCardContainer')
        
        const formCard = document.querySelector('.formCard')
        const cardContent = formCard.querySelector('.cardContent')
        const button = formCard.querySelector('#submitButton')

        // MEETING FORM
        const ballsFormContainer = document.querySelector('.ballsFormContainer')
        const ballsCardContainer = ballsFormContainer.querySelector('.formCard')
        const ballsCardContent = ballsFormContainer.querySelector('.cardContent')
        const ballsCardSubmitBtn = ballsCardContainer.querySelector('#submitButton')

        // ADD CHILDREN TO CONTAINERS
        button.appendChild(overlay)
        ballsCardSubmitBtn.appendChild(overlay)
        button.appendChild(svg)

        // CLIENT SIZE
        const height = utilsHandler.getClientHeight()
        const width = utilsHandler.getClientWidth()

        // STYLES & SIZES
        cardContent.style.background = currentColor
        ballsCardContent.style.background = "#ffffff"

        // ANIMATIONS
        let openCard = null
        buttons.forEach((button, idx) => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                utilsHandler.blockScroll();

                tl.clear()

                tl.fromTo(idx === 0 ? cardContent : ballsCardContent, {
                    rotateX: 25,
                    scale: 1.5
                }, {
                    scale: 1,
                    rotateX: 0,
                    duration: 0.5,
                    ease: "back"
                }).to(idx === 0 ? formCard : ballsCardContainer, {
                    top: 85,
                    duration: 0.5,
                    ease: "power4.inOut",
                    onComplete: () => {
                        tl.to(idx === 0 ? cardContent : ballsCardContent, {
                            rotateY: 540,
                            duration: 1.3,
                            ease: "back.inOut"
                        }, "+=0.5").to(idx === 0 ? formCard : ballsCardContainer, {
                            rotate: -3,
                            duration: 0.05
                        }, 1.3);
                        gsap.delayedCall(2, () => this.animateBalls());
                    }
                }, 0);

                tl.to(idx === 0 ? formContainer : ballsFormContainer, { zIndex: 200 }, 0);

                openCard = idx === 0 ? formCard : ballsCardContainer;
            });
        });

        ballCardButton.addEventListener('click', () => {
            tl.to(ballsCardContent, {
                rotateY: 180,
                duration: 1.2,
                ease: "back.inOut",
            })
                .to('.back2', {
                    opacity: 1,
                    zIndex: 1,
                    duration: 0.05,
                }, '-=0.6')
                .to(ballsCardContent.querySelector('.back'), {
                    opacity: 0,
                    zIndex: 0,
                    duration: 0.05,
                }, '-=0.6')
        });


        document.addEventListener("click", (e) => {
            if (openCard && !openCard.contains(e.target)) {
                closeCard();
                openCard = null;
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && openCard) {
                closeCard();
                openCard = null;
            }
        });

        // CLOSE CARD FUNCTION
        const closeCard = () => {
            utilsHandler.unblockScroll();
            const tl = gsap.timeline();

            tl.clear()

            tl.to(formCard, {
                top: "100%",
                duration: 0.5,
                ease: "back.in",
            }).to(formContainer, {
                zIndex: -1,
                duration: 0,
            });

            tl.to(ballsCardContainer, {
                top: "100%",
                duration: 0.5,
                ease: "back.in",
            }, 0).to(ballsFormContainer, {
                zIndex: -1,
                duration: 0,
            });

            tl.to('.back2', {
                opacity: 0,
                zIndex: 0,
            }).to(ballsCardContent.querySelector('.back'), {
                opacity: 1,
                zIndex: 1
            }).to(ballsCardContent, {
                rotate: 0
            })
        };

        tl.play()
    }

    // DATE PICKER HANDLER
    static animateDatePicker() {
        const selectedDate = {
            day: null,
            month: null,
        };

        function generateDates() {
            const daysContainer = document.querySelector(".daysContainer");
            const monthsContainer = document.querySelector(".monthsContainer");
            const yearContainer = document.querySelector(".yearContainer");

            const currentYear = new Date().getFullYear();
            const year = document.createElement("div");
            year.classList.add("year");
            year.innerHTML = currentYear;
            yearContainer.appendChild(year);

            for (let i = 1; i <= 31; i++) {
                const day = document.createElement("div");
                day.classList.add("day");
                day.textContent = i.toString().padStart(2, "0");
                daysContainer.appendChild(day);
            }

            const months = [
                "Janvier",
                "Février",
                "Mars",
                "Avril",
                "Mai",
                "Juin",
                "Juillet",
                "Août",
                "Septembre",
                "Octobre",
                "Novembre",
                "Décembre",
            ];

            months.forEach((m) => {
                const monthDiv = document.createElement("div");
                monthDiv.classList.add("month");
                monthDiv.textContent = m;
                monthsContainer.appendChild(monthDiv);
            });
        }

        function updateActive(container, index, type) {
            const items = container.querySelectorAll(`.${type}`);
            const parent = container.parentElement;
            const itemStyle = getComputedStyle(items[0])
            const itemHeight = items[0].offsetHeight + parseFloat(itemStyle.marginTop) + parseFloat(itemStyle.marginBottom);
            const containerHeight = parent.offsetHeight;

            const offsetToCenter = (containerHeight - itemHeight) / 2;
            const targetY = -index * itemHeight + offsetToCenter;

            items.forEach((item, idx) => {
                if (idx === index) {
                    gsap.to(item, {
                        fontSize: 24,
                        opacity: 1,
                        color: prepareAnimationHandler.colors[0],
                        duration: 0.15,
                    });
                } else {
                    gsap.to(item, {
                        fontSize: 12,
                        color: "#29292C",
                        opacity: 0.25,
                        duration: 0.15,
                    });
                }
            });

            gsap.to(container, {
                y: targetY,
                duration: 0.15,
            });

            selectedDate[type === "day" ? "day" : "month"] = items[index].textContent;
            console.log(selectedDate);

        }

        function setupRoller(container, type, defaultIndex) {
            const items = container.querySelectorAll(`.${type}`);
            let activeIndex = defaultIndex;

            // DRAG
            Draggable.create(container, {
                type: "y",
                bounds: { minY: -25 * (items.length - 1), maxY: 0 },
                inertia: true,
                onDragEnd: function () {
                    const closestIndex = Math.round((this.y - (container.parentElement.offsetHeight - 50) / 2) / -50);
                    activeIndex = Math.max(0, Math.min(closestIndex, items.length - 1));
                    updateActive(container, activeIndex, type);
                },
            });

            // CLIC
            items.forEach((item, idx) => {
                item.addEventListener("click", () => {
                    activeIndex = idx;
                    updateActive(container, idx, type);
                });
            });

            // SCROLL
            container.parentElement.addEventListener("wheel", (e) => {
                e.preventDefault();

                if (e.deltaY > 0) {
                    activeIndex = Math.min(activeIndex + 1, items.length - 1);
                } else {
                    activeIndex = Math.max(activeIndex - 1, 0);
                }
                updateActive(container, activeIndex, type);
            });

            updateActive(container, activeIndex, type);
        }

        generateDates();

        // ACTUAL DATE BY DEFAULT
        const today = new Date();
        const currentDayIndex = today.getDate() - 1;
        const currentMonthIndex = today.getMonth();

        setupRoller(document.querySelector(".daysContainer"), "day", currentDayIndex);
        setupRoller(document.querySelector(".monthsContainer"), "month", currentMonthIndex);
    }

    // CALENDAR HANDLER
    static calendarHandler() {
        const actualSlotsContainer = document.querySelector('.actualSlots')
        const nextSlotsContainer = document.querySelector('.nextSlots')
        const button = document.querySelector('.calendarButton')

        const overlay = document.createElement('div');
        overlay.classList.add("overlay");
        button.appendChild(overlay);

        const heartSVG = `<svg class="svg-heart"width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.79095 8.04826L6.85213 7.95418C6.86005 7.95719 6.86805 7.96022 6.87595 7.96331C6.87979 7.98151 6.88363 7.99971 6.88218 7.99295C6.94687 7.95257 7.01808 7.91092 7.08624 7.86509C7.17192 7.80741 7.25827 7.74999 7.33684 7.68393C7.35502 7.66862 7.34274 7.61885 7.32241 7.57198C7.286 7.60817 7.25368 7.64979 7.2122 7.67913C7.1485 7.72429 7.07825 7.76062 7.0113 7.80164C6.96999 7.82695 6.9319 7.87145 6.88841 7.87609C6.81873 7.88353 6.7753 7.92864 6.71924 7.95442C6.70213 7.96232 6.68746 7.97503 6.67167 7.9855C6.64969 8.00006 6.62963 8.01964 6.60529 8.02773C6.57548 8.03762 6.53336 8.02696 6.51185 8.04385C6.38127 8.14634 6.21374 8.16802 6.06955 8.2396C6.01109 8.26855 5.94143 8.28476 5.89508 8.32617C5.8135 8.39903 5.70582 8.3808 5.61562 8.41975C5.53506 8.45455 5.40185 8.38885 5.34509 8.31858C5.30511 8.26909 5.2272 8.24724 5.19142 8.19631C5.14999 8.13732 5.0817 8.12026 5.03884 8.0693C4.95907 7.97436 4.87853 7.87992 4.7969 7.78652C4.77118 7.75706 4.74068 7.73154 4.71238 7.70421C4.71822 7.69737 4.72403 7.6906 4.72977 7.68373L4.63712 7.65891C4.64675 7.63927 4.6545 7.62355 4.65665 7.61926C4.62292 7.60137 4.59064 7.5913 4.5684 7.57091C4.51969 7.52617 4.5084 7.45064 4.44024 7.41919C4.43314 7.41587 4.43572 7.39133 4.4343 7.37661C4.43289 7.36154 4.43797 7.33749 4.43026 7.33269C4.33475 7.2731 4.16298 7.10819 4.13059 7.0263C4.11863 6.99601 4.1337 6.9557 4.1372 6.91113C4.11694 6.91756 4.09728 6.9238 4.07902 6.92954C4.03791 6.87311 4.08758 6.76638 3.96932 6.76151C3.96437 6.76134 3.95394 6.74332 3.95615 6.73709C3.98151 6.66484 3.96904 6.61068 3.88709 6.58253C3.88084 6.58041 3.88273 6.55471 3.87954 6.53067C3.90784 6.54613 3.92645 6.55634 3.96465 6.5772C3.93868 6.51748 3.92069 6.4761 3.89825 6.42458C3.88436 6.45335 3.87511 6.47229 3.87159 6.47967C3.85614 6.36372 3.83955 6.23845 3.82377 6.12002C3.79285 6.09607 3.7583 6.06937 3.72375 6.04268C3.73563 6.04241 3.74762 6.04208 3.75951 6.04181C3.76964 5.9884 3.77975 5.93508 3.79071 5.8772C3.74977 5.88455 3.71951 5.88999 3.67829 5.89735C3.72106 5.80383 3.63962 5.70092 3.72629 5.61614C3.74684 5.59607 3.74052 5.54542 3.7382 5.5093C3.73694 5.48993 3.71803 5.47132 3.68631 5.46052C3.68142 5.49674 3.67647 5.53286 3.67158 5.56908C3.66465 5.56882 3.65773 5.56856 3.65078 5.56838C3.64894 5.50778 3.64701 5.44715 3.64488 5.37612C3.74047 5.41165 3.7428 5.33924 3.75999 5.28896C3.76197 5.28329 3.72279 5.26368 3.67626 5.23324C3.72124 5.22777 3.7588 5.22322 3.79636 5.21868C3.79174 5.20744 3.78703 5.19618 3.78239 5.18502C3.77191 5.17973 3.75863 5.16758 3.75144 5.17035C3.68148 5.19746 3.66913 5.16219 3.68197 5.10747C3.73577 4.87889 3.80257 4.65636 3.94455 4.4615C3.98997 4.39913 3.99608 4.30614 4.04724 4.25151C4.15292 4.13889 4.19991 3.98896 4.33145 3.88965C4.56665 3.71206 4.81056 3.5701 5.11551 3.54956C5.28927 3.53787 5.46409 3.54355 5.62379 3.61414C5.75847 3.67369 5.88872 3.73249 6.00735 3.84173C6.12921 3.95388 6.21119 4.08464 6.30717 4.20827C6.38537 4.30907 6.41154 4.44028 6.46881 4.55406C6.48954 4.59538 6.54101 4.62909 6.5862 4.64899C6.60604 4.65767 6.65059 4.62871 6.67499 4.60718C6.8307 4.46956 6.9936 4.34306 7.20666 4.30269C7.30715 4.28367 7.41029 4.27174 7.5128 4.26893C7.62613 4.26574 7.74001 4.27643 7.85363 4.28165C7.87339 4.28251 7.89425 4.28262 7.91266 4.28888C7.98268 4.31268 8.05381 4.33475 8.12099 4.36515C8.22557 4.41256 8.33164 4.45514 8.40329 4.55631C8.44839 4.61992 8.54392 4.65738 8.57063 4.72384C8.61771 4.84109 8.72401 4.92924 8.73254 5.06998C8.73498 5.11003 8.80112 5.16564 8.79496 5.23409C8.79404 5.24394 8.82753 5.25628 8.84385 5.26897C8.85468 5.27736 8.8714 5.28822 8.8718 5.29824C8.87803 5.48218 8.95137 5.65568 8.9141 5.85107C8.87716 6.04486 8.83675 6.22994 8.74138 6.40276C8.72194 6.43801 8.71818 6.48189 8.69828 6.51683C8.68381 6.54234 8.6547 6.55977 8.64875 6.56535C8.63875 6.60268 8.63908 6.62791 8.62671 6.64354C8.53865 6.75485 8.44993 6.8659 8.35656 6.97296C8.33543 6.99722 8.32848 7.07264 8.26089 7.02009C8.25983 7.01928 8.23447 7.04444 8.22423 7.05993C8.20023 7.09626 8.18589 7.14199 8.15446 7.16977C8.02333 7.28548 7.88948 7.39851 7.75188 7.50682C7.70178 7.54633 7.63445 7.56467 7.58238 7.60233C7.52601 7.64318 7.48263 7.70131 7.42574 7.74139C7.33572 7.80473 7.2461 7.88084 7.14341 7.91113C7.05105 7.93843 6.98181 7.97273 6.91981 8.04305C6.89382 8.07255 6.83355 8.1066 6.78854 8.04434L6.79109 8.04839L6.79095 8.04826ZM8.65194 6.44563C8.63101 6.44543 8.60462 6.43712 8.59007 6.44632C8.54404 6.47568 8.50243 6.51162 8.45698 6.54663C8.52383 6.68334 8.32415 6.70668 8.32039 6.83907C8.35034 6.82187 8.37548 6.81382 8.39111 6.79721C8.42209 6.76434 8.44908 6.72767 8.47536 6.69098C8.53406 6.60889 8.5912 6.52585 8.64853 6.44277C8.66316 6.42987 8.68507 6.41963 8.6913 6.40351C8.71991 6.32964 8.74563 6.25465 8.76909 6.17897C8.77867 6.14798 8.77977 6.11437 8.78475 6.08189C8.73414 6.1419 8.71593 6.22005 8.66587 6.25497C8.57046 6.32147 8.61471 6.37909 8.65198 6.44547L8.65194 6.44563ZM4.48121 4.53714C4.47936 4.56576 4.47574 4.58604 4.47721 4.606C4.48343 4.69264 4.37381 4.70807 4.36956 4.81041C4.36396 4.94488 4.27241 5.07261 4.24168 5.20867C4.20933 5.35209 4.18301 5.50322 4.19394 5.64859C4.20863 5.844 4.25778 6.03793 4.30125 6.2307C4.31 6.26961 4.3384 6.30262 4.3387 6.35033C4.33886 6.37923 4.39248 6.40493 4.40798 6.43829C4.493 6.62148 4.60201 6.79003 4.73459 6.9432C4.89471 7.12818 5.06069 7.30827 5.22163 7.49259C5.28371 7.56367 5.31136 7.65748 5.41718 7.69964C5.47235 7.72159 5.50379 7.80261 5.54546 7.85732C5.59215 7.9187 5.6476 7.93285 5.71939 7.90021C5.93944 7.80019 6.16088 7.7031 6.3814 7.604C6.49999 7.5507 6.62279 7.50402 6.73462 7.43962C6.87038 7.36154 6.99628 7.26736 7.12707 7.18104C7.21737 7.1214 7.31436 7.07002 7.39815 7.0028C7.49043 6.92864 7.56841 6.838 7.65711 6.75925C7.77476 6.65481 7.90435 6.56214 8.01432 6.45077C8.09188 6.37223 8.14553 6.27099 8.20958 6.1798C8.22073 6.16394 8.2351 6.13202 8.24095 6.13359C8.30673 6.15121 8.28916 6.09844 8.29629 6.07114C8.30429 6.04061 8.30394 6.00803 8.30924 5.9767C8.32757 5.8683 8.34454 5.75954 8.36742 5.65209C8.37223 5.62975 8.39903 5.61108 8.41795 5.59304C8.43665 5.57513 8.46504 5.56344 8.47559 5.54236C8.48124 5.53113 8.45813 5.50581 8.44802 5.48691C8.42497 5.4987 8.40197 5.5106 8.38144 5.52112C8.36142 5.4375 8.34123 5.35313 8.32084 5.26781C8.33484 5.26307 8.35405 5.25644 8.35145 5.25734C8.30532 5.19248 8.26089 5.13047 8.21711 5.06802C8.21029 5.05822 8.20941 5.04117 8.20068 5.03644C8.13744 5.00188 8.07082 4.97314 8.00938 4.93596C7.88753 4.86241 7.76134 4.81869 7.61734 4.85225C7.49541 4.88075 7.36064 4.88527 7.25377 4.94064C7.08614 5.02745 6.95507 5.16433 6.86056 5.33057C6.82344 5.39587 6.77565 5.45521 6.72495 5.52846C6.68253 5.46469 6.65028 5.41958 6.62177 5.37237C6.57689 5.29811 6.53912 5.30207 6.48511 5.367C6.38988 5.48135 6.38224 5.47222 6.2525 5.39594C6.19708 5.36339 6.21615 5.33291 6.20636 5.29213C6.17803 5.17407 6.12467 5.0616 6.0919 4.9442C6.0764 4.88879 6.08558 4.82707 6.08328 4.7597C6.00673 4.75548 5.98237 4.68026 5.96211 4.60056C5.95601 4.57653 5.94834 4.55226 5.93676 4.53039C5.91378 4.48731 5.88874 4.44511 5.86223 4.40401C5.8471 4.38048 5.87657 4.32712 5.80395 4.33705C5.77698 4.34071 5.74067 4.28468 5.70823 4.25554C5.67297 4.23928 5.62545 4.22947 5.59559 4.20155C5.48732 4.10039 5.34971 4.06874 5.2128 4.12164C5.1979 4.12739 5.16679 4.13092 5.16632 4.12928C5.13252 4.01435 5.05049 4.09161 4.98969 4.08018C4.85407 4.05465 4.74454 4.12028 4.63327 4.16598C4.52844 4.20897 4.53011 4.36788 4.40326 4.40117C4.40907 4.41609 4.42427 4.43601 4.41926 4.4452C4.34504 4.58182 4.26809 4.7171 4.19185 4.85247C4.2517 4.91392 4.27396 4.85119 4.29218 4.81809C4.34547 4.72128 4.37953 4.61213 4.44391 4.52378C4.50167 4.44453 4.55371 4.34322 4.68142 4.33787C4.57497 4.36795 4.63375 4.548 4.48108 4.53728L4.48121 4.53714ZM7.83024 7.23171C7.83687 7.24287 7.84351 7.25403 7.85015 7.26519C7.89131 7.24825 7.93547 7.236 7.97305 7.21341C8.03816 7.1742 8.06543 7.08227 8.16216 7.08473C8.16758 7.08485 8.17847 7.06458 8.17779 7.05422C8.17326 6.97855 8.22139 6.96339 8.29078 6.96313C8.28154 6.92675 8.27262 6.89187 8.26424 6.85873C8.11138 6.99012 7.97072 7.11089 7.83015 7.23168L7.83024 7.23171ZM4.56824 3.85598C4.75914 3.81082 4.95002 3.76574 5.14925 3.71865C5.14943 3.72747 5.15013 3.71535 5.14869 3.70345C5.14688 3.68916 5.14321 3.67507 5.13988 3.65834C4.92473 3.66921 4.73804 3.737 4.56832 3.85601L4.56824 3.85598ZM7.19502 4.87373C7.18421 4.85844 7.17341 4.84316 7.16252 4.82784C7.10067 4.86439 7.0282 4.89073 6.97956 4.93967C6.90281 5.01692 6.84333 5.1104 6.77412 5.19507C6.72884 5.25048 6.7269 5.2489 6.78767 5.26217C6.82232 5.21153 6.84656 5.16172 6.88391 5.12472C6.95293 5.05637 7.02869 4.99435 7.10374 4.93195C7.1312 4.90913 7.16444 4.89289 7.19512 4.87367L7.19502 4.87373ZM5.36893 3.71697C5.50989 3.80325 5.55415 3.81201 5.60449 3.75503C5.37547 3.641 5.35576 3.63996 5.25487 3.7605C5.30214 3.74245 5.3245 3.73392 5.36893 3.71697ZM8.81902 5.58543C8.79949 5.73854 8.80887 5.81907 8.84713 5.82702C8.81108 5.74999 8.93108 5.66087 8.81902 5.58543ZM7.78515 7.34807C7.77971 7.33856 7.77416 7.3291 7.76871 7.31959C7.74007 7.31457 7.71144 7.30955 7.69078 7.30597C7.66975 7.35424 7.65143 7.39616 7.6332 7.43811C7.63845 7.44359 7.64379 7.44909 7.64905 7.45457C7.69444 7.41911 7.73976 7.38354 7.78515 7.34807Z" fill="#C62369"/>
</svg>
`

        // Fake data -> à ajouter via NOTION
        const slotsPerDay = ["09:00 - 09:30", "10:00 - 10:30", "11:00 - 11:30", "14:00 - 14:30", "15:00 - 15:30", "16:00 - 16:30"]

        function stringToDate(dateString) {
            return new Date(dateString)
        }

        function generateSlots(date, container, limit = null) {
            container.innerHTML = '';

            let currentlySelected = null;

            slotsPerDay.forEach((slot, idx) => {
                if (limit && idx >= limit) return;

                // Jours à ajouter via API Notion
                const weekday = document.createElement('p');
                weekday.classList.add('weekday');
                weekday.innerHTML = "Lundi";

                const slotElement = document.createElement('div');
                slotElement.classList.add('slot');
                const timeslot = document.createElement('p');
                timeslot.classList.add('timeslot');
                timeslot.textContent = slot;
                slotElement.appendChild(weekday);
                slotElement.appendChild(timeslot);

                // ADD 20 HEART SVGS
                for (let i = 0; i < 20; i++) {
                    const heart = document.createElement('div');
                    heart.classList.add('heartSVG');
                    heart.innerHTML = heartSVG.trim();
                    slotElement.appendChild(heart);
                }

                slotElement.addEventListener('click', () => {
                    const isActive = slotElement.dataset.state === 'active';
                    const hearts = slotElement.querySelectorAll('.heartSVG');

                    if (currentlySelected && currentlySelected !== slotElement) {
                        resetAnimation(currentlySelected);
                        currentlySelected = null;
                    }

                    if (isActive) {
                        resetAnimation(slotElement);
                        currentlySelected = null;
                    } else {
                        gsap.to(slotElement, {
                            background: prepareAnimationHandler.colors[3],
                            duration: 0.25,
                            onStart: () => {
                                gsap.to(timeslot, {
                                    color: prepareAnimationHandler.colors[0],
                                    duration: 0.25
                                });
                                gsap.to(weekday, {
                                    color: prepareAnimationHandler.colors[0],
                                    duration: 0.25
                                });
                                gsap.to(hearts, {
                                    scale: 1,
                                    stagger: 0.02,
                                    duration: 0.15,
                                    ease: "back.inOut"
                                });
                            }
                        });
                        slotElement.dataset.state = 'active';
                        currentlySelected = slotElement;
                    }
                });

                container.appendChild(slotElement);
            });

            function resetAnimation(slotElement) {
                const hearts = slotElement.querySelectorAll('.heartSVG');

                gsap.to(slotElement, {
                    background: "#28282D80",
                    duration: 0.25,
                    onStart: () => {
                        const timeslot = slotElement.querySelector('.timeslot');
                        const weekday = slotElement.querySelector('.weekday');
                        gsap.to(timeslot, {
                            color: prepareAnimationHandler.colors[2],
                            duration: 0.25
                        });
                        gsap.to(weekday, {
                            color: "#ffffff",
                            duration: 0.25
                        });
                        gsap.to(hearts, {
                            scale: 0,
                            stagger: 0.02,
                            duration: 0.15
                        });
                    }
                });
                slotElement.dataset.state = 'inactive';
            }
        }

        function updateCalendar(selectedDate) {
            const today = stringToDate(selectedDate)
            const tomorrow = new Date(today)
            tomorrow.setDate(today.getDate() + 1)

            generateSlots(today, actualSlotsContainer, 6)
            generateSlots(tomorrow, nextSlotsContainer, 3)
        }

        // SELECTED DATE
        const selectedTimeSlot = ''
        updateCalendar(selectedTimeSlot)
    }

    static ballsInit = false

    // MATTER JS BALLS DROP
    static animateBalls() {

        if (this.ballsInit) return

        const {
            Engine,
            Render,
            Runner,
            Bodies,
            World,
            Mouse,
            MouseConstraint
        } = Matter;

        const container = document.querySelector('.ballsFormContainer .cardContent .back');
        const sizes = container.getBoundingClientRect();
        const width = sizes.width;
        const height = sizes.height;

        const radius = width / 15;
        const mass = Math.random() * (100 - 8) + 8;
        const ballSpacing = radius * 1.2;
        const ballsPerLine = 6;
        const engine = Engine.create();
        const render = Render.create({
            element: container,
            engine: engine,
            options: {
                width: width,
                height: height,
                wireframes: false,
                background: "transparent"
            }
        });

        const wallOptions = {
            isStatic: true,
            render: {
                fillStyle: "transparent",
                strokeStyle: "transparent",
                lineWidth: 0
            }
        };

        const ground = Bodies.rectangle(width / 2, height + 20, width, 20, wallOptions);
        const leftWall = Bodies.rectangle(-20, height / 2, 20, height, wallOptions);
        const rightWall = Bodies.rectangle(width + 20, height / 2, 20, height, wallOptions);
        const ceiling = Bodies.rectangle(width / 2, -20, width, 20, wallOptions);

        const balls = [];
        // const ballImage = 'http://les-mauvaises.local/wp-content/uploads/2024/11/clement-gif-scaled.jpg';

        for (let row = 0; row < 3; row++) {
            for (let i = 0; i < ballsPerLine; i++) {
                const x = (i + 0.5) * ballSpacing + (width / 2 - (ballsPerLine * ballSpacing) / 2);
                const y = row * ballSpacing;
                const randomColor = prepareAnimationHandler.colors[Math.floor(Math.random() * prepareAnimationHandler.colors.length)]
                const ball = Bodies.circle(x, y, radius, {
                    restitution: 0.5,
                    friction: 0.01,
                    mass: mass,
                    angle: Math.random() * Math.PI * 2,
                    angularVelocity: (Math.random() * 2 - 1) * Math.PI,
                    render: {
                        // sprite: {
                        //     texture: ballImage,
                        //     xScale: (radius / 500), 
                        //     yScale: (radius / 500),
                        // },
                        fillStyle: randomColor,
                        strokeStyle: "transparent",
                        lineWidth: 0
                    }
                });
                balls.push(ball);
            }
        }

        World.add(engine.world, [ground, ceiling, leftWall, rightWall, ...balls]);

        const mouse = Matter.Mouse.create(render.canvas);

        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.05,
                render: {
                    visible: false,
                },
            },
        });

        World.add(engine.world, mouseConstraint);

        render.mouse = mouse;;

        const runner = Runner.create();
        Render.run(render);
        Runner.run(runner, engine);

        this.ballsInit = true
    }
}

