alert("Code Loaded");
const frame1Animations = [
            { rotation: 0, x: 0, y: 0 },
            { rotation: 90, x: 404, y: 349 },
            { rotation: 180, x: 0, y: 698 },
            { rotation: 270, x: -404, y: 349 }
        ];

        const frame2Animations = [
            { rotation: 0, x: 0, y: 0 },
            { rotation: 90, x: -404, y: 349 },
            { rotation: 180, x: -808, y: 0 },
            { rotation: 270, x: -404, y: -349 }
        ];

        const frame3Animations = [
            { rotation: 0, x: 0, y: 0 },
            { rotation: 90, x: -404, y: -349 },
            { rotation: 180, x: 0, y: -698 },
            { rotation: 270, x: 404, y: -349 }
        ];

        const frame4Animations = [
            { rotation: 0, x: 0, y: 0 },
            { rotation: 90, x: 404, y: -349 },
            { rotation: 180, x: 808, y: 0 },
            { rotation: 270, x: 404, y: 349 }
        ];

        var observer = new IntersectionObserver(onIntersection, {
            root: null,   // default is the viewport
            threshold: 0.9 // Triggers when 100% of the target is visible
        });
        const section = document.querySelector('#circ-process');
        section.classList.add('circ-process');

        var circularityVariant = 1;
        var scrollLocked = false;
        var scrollTimeout; 
        var newScrollDetectable = true;

        observer.observe(section);

        window.addEventListener("scroll", function() {
            let lastScrollTop = getSectionTopOffset();
            let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            let scrollDown = currentScroll > lastScrollTop
            let scrollUp = currentScroll < lastScrollTop

            // if(scrollLocked ){
            //     window.scrollTo(0, lastScrollTop);
            // }
            // Prevent scrolling up
            
            if(scrollLocked){
                if(newScrollDetectable && ( scrollDown && circularityVariant >= 4 || scrollUp && circularityVariant <= 1)){
                    scrollLocked = false
                    console.log("Unlock!");
                    console.log("circularityVariant:", circularityVariant)
                    console.log("scrollDown", scrollDown)
                    console.log("scrollUp", scrollUp)
                    return
                }
                if(newScrollDetectable){
                    newScrollDetectable = false;
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        newScrollDetectable = true;
                    }, 2000);
                    if (scrollUp && circularityVariant > 1) {
                        console.log("Decrementation")
                        circularityVariant--;
                    }else if (scrollDown && circularityVariant < 4){
                        circularityVariant++;
                    }
                    console.log("Slide...")
                }
                window.scrollTo(0, lastScrollTop);
            }
            if(scrollLocked){
                console.log(circularityVariant);
                gsap.to("#frame1", {...frame1Animations[circularityVariant-1], duration: 0.5,  ease: "power1.inOut"});
                gsap.to("#frame2", {...frame2Animations[circularityVariant-1], duration: 0.5,  ease: "power1.inOut"});
                gsap.to("#frame3", {...frame3Animations[circularityVariant-1], duration: 0.5,  ease: "power1.inOut"});
                gsap.to("#frame4", {...frame4Animations[circularityVariant-1], duration: 0.5,  ease: "power1.inOut"});
            }
        });
        function onIntersection(entries, opts) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log("Inrtersection:", getSectionTopOffset())
                    section.scrollIntoView({
                        behavior: 'smooth',  // Optional: for smooth scrolling
                        block: 'start'       // Aligns the section to the top of the viewport
                    });
                    newScrollDetectable = false;
                    scrollTimeout = setTimeout(() => {
                        newScrollDetectable = true;
                    }, 2000);
                    scrollLocked = true;
                    
                }
            });
        }

        function getSectionTopOffset() {
            const section = document.querySelector('#circ-process');
            
            // Get the section's top position relative to the viewport
            const sectionTop = section.getBoundingClientRect().top;
            
            // Add the current scroll position to get the section's top relative to the document
            const sectionTopOffset = sectionTop + window.pageYOffset;

            return sectionTopOffset;
        }
