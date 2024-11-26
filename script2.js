let circularityVariant = 1;
let animating = false;
let circularityVisible = false;
let topEnter = true;
let locked = false;
let requestedLock = false;
let requestDown = false;
let requestUp = false;
let info = document.getElementById("info");
let count = 0;
let isMobile = window.innerWidth <= 809;
let circSection = document.getElementById("process");
let reachedCircularity = false;
let endDown = false;
let endTop = true;
let lastVelocity = 0;
let detectedDownVeloce = false;
let isLockCalled = false;
let timeout;

// Get all the video elements on the page
const videos = document.querySelectorAll('video');
// Loop through each video and add an event listener
videos.forEach((video) => {
  video.addEventListener('play', () => {
    // Pause all other videos when one starts playing
    videos.forEach((otherVideo) => {
      if (otherVideo !== video && !otherVideo.paused && !otherVideo.ended) {
        otherVideo.currentTime = otherVideo.duration;
      }
    });
  });
});

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
    {y: -262},
    {y: -518},
    {y: -833}
];
const textMobileAnimations = [
    {y: 0},
    {y: -254},
    {y: -508},
    {y: -788}
];

document.addEventListener("DOMContentLoaded", (event) => {
    gsap.registerPlugin(ScrollTrigger,Observer, ScrollToPlugin)

    const processLink = document.querySelectorAll('a[href="./#process"]');
    const shopLink = document.querySelectorAll('a[href="./#product"]');

    function smoothScrollTo(event, targetSelector) {
        event.preventDefault();  // Prevent default action (jumping)
        
        const targetElement = document.querySelector(targetSelector);

        if (targetElement) {
            // Use GSAP to animate the scroll
            animating = true;
            gsap.to(window, {
                scrollTo: targetElement, // Target the element to scroll to
                duration: 1.5,           // Animation duration (seconds)
                ease: "power2.inOut",
                onComplete: () => {
                    animating = false;
                }
            });
        }
    }

    processLink.forEach(element => {
        element.addEventListener("click", function(event) {
            smoothScrollTo(event, "#process");
        }); 
    });
    
    shopLink.forEach(element => {
        element.addEventListener("click", function(event) {
            smoothScrollTo(event, "#product");
        });
    });
    
    
    ScrollTrigger.create({
        trigger: "#red",
        start: "top top",
        end: "bottom top",
        onEnter: () => {
            showNextVariant();
        },
        onLeave: () => {
        },
        onEnterBack: () => {
            showPreviousVariant()
        },
        onLeaveBack: () => {
        }
    })
    ScrollTrigger.create({
        trigger: "#green",
        start: "top top",
        end: "bottom top",
        onEnter: () => {
            showNextVariant();
        },
        onLeave: () => {
        },
        onEnterBack: () => {
            showPreviousVariant()
        },
        onLeaveBack: () => {
        }
    })
    ScrollTrigger.create({
        trigger: "#blue",
        start: "top top",  // When the top of the element hits the bottom of the viewport
        end: "bottom top",    // When the bottom of the element hits the top of the viewport
        onEnter: () => {
            showNextVariant();
        },
        onLeave: () => {
        },
        onEnterBack: () => {
            showPreviousVariant()
        },
        onLeaveBack: () => {
        },
    });

    function showNextVariant(){
        if(circularityVariant < 4){
            circularityVariant++;
            animateCircularity();
        }
        console.log("CIRCULARITY:", circularityVariant)
    }

    function showPreviousVariant(){
        if(circularityVariant > 1){
            circularityVariant--;
            animateCircularity();
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
});