let circularityVariant = 1;
let animating = false;
let circularityVisible = false;
let topEnter = true;
let locked = false;
let info = document.getElementById("info");
let count = 0;
let isMobile = window.innerWidth <= 809;
let circSection = document.getElementById("circ-process");

const frame1Animations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: 404, y: 349 },
    { rotation: 180, x: 0, y: 698 },
    { rotation: 270, x: -404, y: 349 }
];
const frame1MobileAnimations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: 250, y: 255 },
    { rotation: 180, x: 0, y: 510 },
    { rotation: 270, x: -250, y: 255 }
];

const frame2Animations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: -404, y: 349 },
    { rotation: 180, x: -808, y: 0 },
    { rotation: 270, x: -404, y: -349 }
];
const frame2MobileAnimations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: -250, y: 255 },
    { rotation: 180, x: -500, y: 0 },
    { rotation: 270, x: -250, y: -255 }
];
const frame3Animations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: -404, y: -349 },
    { rotation: 180, x: 0, y: -698 },
    { rotation: 270, x: 404, y: -349 }
];
const frame3MobileAnimations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: -250, y: -255 },
    { rotation: 180, x: 0, y: -510 },
    { rotation: 270, x: 250, y: -255 }
];

const frame4Animations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: 404, y: -349 },
    { rotation: 180, x: 808, y: 0 },
    { rotation: 270, x: 404, y: 349 }
];
const frame4MobileAnimations = [
    { rotation: 0, x: 0, y: 0 },
    { rotation: 90, x: 250, y: -255 },
    { rotation: 180, x: 500, y: 0 },
    { rotation: 270, x: 250, y: 255 }
];

const textAnimations = [
    {y: 0},
    {y: -194},
    {y: -450},
    {y: -765}
];
const textMobileAnimations = [
    {y: 0},
    {y: -254},
    {y: -508},
    {y: -762}
];

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,Observer)

    const myObserver = Observer.create({
        // target: window, // can be any element (selector text is fine)
        type: "wheel, scroll", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
        wheelSpeed: 1,
        tolerance: 20,
        preventDefault: false,
        onUp: ({deltaY}) => { 
            //info.innerText = `UP ${count++} ${locked ? 'locked' : 'unlocked'}`;
            if(locked){
                centerCircularity();
                if(!animating){
                    showPreviousVariant()
                }
            }
        },
        onDown: ({deltaY}) => { 
            //info.innerText = `DOWN ${count++} ${locked ? 'locked' : 'unlocked'}`;
            if(locked){
                centerCircularity();
                if(!animating){
                    showNextVariant();
                }
            }
        },
    });

    ScrollTrigger.create({
        trigger: "#circ-process",
        start: "top bottom",  // When the top of the element hits the bottom of the viewport
        end: "bottom top",    // When the bottom of the element hits the top of the viewport
        onEnter: () => {
            circularityVisible = true;
            topEnter = true;
            lockCircularity();
        },
        onLeave: () => {
            circularityVisible = false;
        },
        onEnterBack: () => {
            circularityVisible = true;
            topEnter = false;
            lockCircularity();
        },
        onLeaveBack: () => {
            circularityVisible = false;
        },
    });

    function showNextVariant(){
        if(circularityVariant < 4){
            circularityVariant++;
            animateCircularity();
        }else{
            // myObserver.disable();
            locked = false;
        }
        console.log("CIRCULARITY:", circularityVariant)
    }

    function showPreviousVariant(){
        if(circularityVariant > 1){
            circularityVariant--;
            animateCircularity();
        }else{
            // myObserver.disable();
            locked = false;
        }
        console.log("CIRCULARITY:", circularityVariant)
    }
    function animateCircularity() {
        animating = true;
        // Declare constants for duration and ease
        const duration = 1.5;
        const ease = "power1.inOut";

        // Create a timeline
        const timeline = gsap.timeline({
            onComplete: () => {
                console.log("All animations ended");
                animating = false;
            }
        });

        if (isMobile) {
            // Add animations to the timeline for mobile view
            timeline
                .to("#frame1", { ...frame1MobileAnimations[circularityVariant - 1], duration, ease })
                .to("#frame2", { ...frame2MobileAnimations[circularityVariant - 1], duration, ease }, 0) // Start at the same time as frame1
                .to("#frame3", { ...frame3MobileAnimations[circularityVariant - 1], duration, ease }, 0)
                .to("#frame4", { ...frame4MobileAnimations[circularityVariant - 1], duration, ease }, 0)
                .to("#circ-text-container", { ...textMobileAnimations[circularityVariant - 1], duration, ease }, 0);
        } else {
            // Add animations to the timeline for desktop view
            timeline
                .to("#frame1", { ...frame1Animations[circularityVariant - 1], duration, ease })
                .to("#frame2", { ...frame2Animations[circularityVariant - 1], duration, ease }, 0)
                .to("#frame3", { ...frame3Animations[circularityVariant - 1], duration, ease }, 0)
                .to("#frame4", { ...frame4Animations[circularityVariant - 1], duration, ease }, 0)
                .to("#circ-text-container", { ...textAnimations[circularityVariant - 1], duration, ease }, 0);
        }
    }
    function lockCircularity(){
        animating = true
        //myObserver.enable();
        gsap.to(window, {
            duration: 2,
            scrollTo: `#${circularityVariant == 1 ? 'circ-top' : ''}${circularityVariant == 4 ? 'circ-bottom' : ''}${circularityVariant > 1 && circularityVariant < 4 ?  'circ-center' : ''}`,
            ease: "power2.inOut",
            onComplete: () => { 
                animating=false; 
                locked = true;
                //lockBody("#any");
                //circSection.style.position = "fixed";
            }
        });
    }
    function centerCircularity(){
        gsap.to(window, {
            duration: 0,
            scrollTo: `#${circularityVariant == 1 ? 'circ-top' : ''}${circularityVariant == 4 ? 'circ-bottom' : ''}${circularityVariant > 1 && circularityVariant < 4 ?  'circ-center' : ''}`
        });
    }

});