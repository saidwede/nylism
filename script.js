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
                    console.log("Jump!")
                }
            });
        }
    }

    processLink.forEach(element => {
        element.addEventListener("click", function(event) {console.log("Clicked!");
            smoothScrollTo(event, "#process");
        }); 
    });
    
    shopLink.forEach(element => {
        element.addEventListener("click", function(event) {console.log("Clicked!");
            smoothScrollTo(event, "#product");
        });
    });
    
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    //alert(isTouchDevice);
    const gestureArea = document.getElementById('process');
    const hammer = new Hammer(gestureArea);
    hammer.get('swipe').set({
        direction: Hammer.DIRECTION_VERTICAL, // Detect vertical swipes only
        threshold: 10,                       // Minimum distance for swipe to register
        velocity: 0.3                        // Minimum velocity for swipe to register
    });
    hammer.on('swipeup', () => {
        checkRequestScrollingLock();
        if(locked && !endDown){
            if(!animating && !isLockCalled){
                showNextVariant();
            }
            animationCenter();
        }else{
            gsap.to(window, {
                duration: 1,  // Animation duration in seconds
                scrollTo: Math.max(0, window.scrollY + 300), // Scroll to 100px from the top
                ease: "power2.out" // Easing function for smooth effect
            });
        }
    });
    hammer.on('swipedown', () => {
        checkRequestScrollingLock();
        if(locked && !endTop){
            if(!animating && !isLockCalled){
                showPreviousVariant();
            }
            animationCenter();
        }else{
            gsap.to(window, {
                duration: 1,  // Animation duration in seconds
                scrollTo: Math.max(0, window.scrollY - 300), // Scroll to 100px from the top
                ease: "power2.out" // Easing function for smooth effect
            });
        }
    });


    const myObserver = Observer.create({
        // target: window, // can be any element (selector text is fine)
        type: "scroll", // comma-delimited list of what to listen for ("wheel,touch,scroll,pointer")
        wheelSpeed: 1,
        tolerance: 20,
        preventDefault: false,
        onUp: ({deltaY, velocityY}) => {
            if(requestedLock && requestUp){
                if(velocityY > lastVelocity){
                    detectedDownVeloce = true;
                }
                if(!isTouchDevice && detectedDownVeloce && velocityY < 2*lastVelocity && !animating && !isLockCalled){
                    showPreviousVariant();
                }
                lastVelocity = velocityY;
            }
            checkRequestScrollingLock();
            // if(locked && !endTop){
            //     animationCenter();
            // }
            if(locked && !endTop){
                if(!isTouchDevice && !animating && !isLockCalled){
                    showPreviousVariant();
                }
                animationCenter();
            }
        },
        onDown: ({deltaY, velocityY}) => {
            //console.log(parseInt(velocityY));
            if(requestedLock && requestDown){
                if(velocityY < lastVelocity){
                    detectedDownVeloce = true;
                }
                if(!isTouchDevice && detectedDownVeloce && velocityY > 2*lastVelocity && !animating && !isLockCalled){
                    showNextVariant();
                }
                lastVelocity = velocityY;
            }
            checkRequestScrollingLock();
            // if(locked && !endDown){
            //     animationCenter();
            // }
            if(locked && !endDown){
                if(!isTouchDevice && !animating && !isLockCalled){
                    showNextVariant();
                }
                animationCenter();
            }
        },
        onStop: () => {
            console.log("STOP!!!")
            if(requestedLock){
                requestedLock = false;
                lastVelocity = 0;
                centerCircularity();
            }
        },
        onStopDelay: 0
    });
    ScrollTrigger.create({
        trigger: "#top-seg",
        start: "top top",
        end: "bottom top",
        onEnter: () => {
            reachedCircularity = true;
            requestedLock = true;
            requestDown = true;
            detectedDownVeloce = false;
            // console.log("Top seg Enter");
        },
        onLeave: () => {
            // console.log("Top seg Leave");
        },
        onEnterBack: () => {
            // console.log("Top seg Enter Back");
        },
        onLeaveBack: () => {
            reachedCircularity = false;
            locked = false;
            requestedLock = false;
            detectedDownVeloce = false;
            // console.log("Top seg Leave Back");
        }
    })
    ScrollTrigger.create({
        trigger: "#top-bottom-seg",
        start: "top top",
        end: "bottom top",
        onEnter: () => {
            // console.log("Bottom seg Enter");
        },
        onLeave: () => {
            reachedCircularity = false;
            locked = false;
            requestedLock = false;
            // console.log("Bottom seg Leave");
        },
        onEnterBack: () => {
            reachedCircularity = true;
            requestedLock = true;
            requestUp = true;
            detectedDownVeloce = false;
            // console.log("Bottom seg Enter Back");
        },
        onLeaveBack: () => {
            // console.log("Bottom seg Leave Back");
        }
    })
    ScrollTrigger.create({
        trigger: "#process",
        start: "top bottom",  // When the top of the element hits the bottom of the viewport
        end: "bottom top",    // When the bottom of the element hits the top of the viewport
        onEnter: () => {
            circularityVisible = true;
            topEnter = true;
        },
        onLeave: () => {
            // console.log("Leave")
            circularityVisible = false;
            
        },
        onEnterBack: () => {
            circularityVisible = true;
            topEnter = false;
        },
        onLeaveBack: () => {
            // console.log("LeaveBack")
            circularityVisible = false;
            
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
                setTimeout(() => {
                    // console.log("All animations ended");
                    animating = false;
                    if(circularityVariant == 4){
                        gsap.to(window, {
                            duration: 0,
                            scrollTo: {
                                y: `#circ-bottom`,
                                offsetY: 2
                            },
                            onComplete: () => {
                                endDown = true;
                            }
                        });
                    }else{
                        endDown = false;
                    }

                    if(circularityVariant == 1){
                        gsap.to(window, {
                            duration: 0,
                            scrollTo: {
                                y: `#circ-top`,
                                offsetY: -2
                            },
                            onComplete: () => {
                                endTop = true;
                            }
                        });
                    }else{
                        endTop = false;
                    }

                }, 500);
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
        // console.log("lockCircularity")
        animating = true
        //myObserver.enable();
        gsap.to(window, {
            duration: 1,
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
            scrollTo: {
                y: `#${circularityVariant == 1 ? 'top-seg' : ''}${circularityVariant == 4 ? 'top-bottom-seg' : ''}${circularityVariant > 1 && circularityVariant < 4 ?  'circ-center' : ''}`,
                offsetY: circularityVariant == 1 ? -2 : 2
            },
            onComplete: () => {
                requestedLock = false;
                requestDown = false;
                requestUp = false;
                locked = true;
            }
        });
    }
    function checkRequestScrollingLock(){
        if(requestedLock){
            gsap.to(window, {
                duration: 0,
                scrollTo: {
                    y: `#${circularityVariant == 1 ? 'top-seg' : ''}${circularityVariant == 4 ? 'top-bottom-seg' : ''}${circularityVariant > 1 && circularityVariant < 4 ?  'circ-center' : ''}`,
                    offsetY: circularityVariant == 1 ? -2 : 2
                },
                onComplete: () => {
                }
            });
        }
    }
    function animationCenter(){
        clearTimeout(timeout);
        isLockCalled = true;
        gsap.to(window, {
            duration: 0,
            scrollTo: {
                y: `#circ-center`
            },
            onComplete: () => {
                timeout = setTimeout(() => {
                    isLockCalled = false;
                }, 200);
            }
        });
    }

});