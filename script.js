gsap.registerPlugin(ScrollTrigger);

// Prevent scrolling initially
document.body.classList.add('no-scroll');

// DOM Elements
const door1 = document.getElementById("d1");
const door2 = document.getElementById("d2");
const circle = document.querySelector(".circle");
const circleContainer = document.querySelector(".circle-c");
const heart = document.querySelector(".heart");
const gallerySection = document.querySelector(".gallery-section");
const rose = document.getElementById("rose");
const allPics = document.querySelectorAll(".pics");

// Circle pulsing animation
const cLoop = gsap.from(circle, {
    opacity: 0.5,
    scale: 0.8,
    repeat: -1,
    yoyo: true,
    ease: "none",
    duration: 2,
});

// Set initial position for intro text
gsap.set(".intro-text-h", {
    xPercent: -50,
    yPercent: -50
});

// Door opening animation on circle click
circleContainer.onclick = function() {
    cLoop.kill();

    const speed = 0.8 / 2;
    const currentS = gsap.getProperty(circle, "scale");
    const targetS = 0.8;
    const difference = Math.abs(targetS - currentS);
    const dynamicTime = difference / speed;

    const tl = gsap.timeline();

    tl.to(circle, {
        duration: dynamicTime,
        scale: 0.8,
        ease: "none"
    });
    
    tl.to(door1, {
        xPercent: -100,
        ease: "expo.inOut",
        duration: 2.5
    });
    
    tl.to(door2, {
        xPercent: 100,
        ease: "expo.inOut",
        duration: 2.5
    }, "<");
    
    tl.set(["#d1", "#d2"], {
        display: "none",
    });
    
    tl.to(circle, {
        scale: 0,
        opacity: 0,
        duration: 2.5,
        ease: "power2.out"
    });
    
    tl.to(heart, {
        strokeDashoffset: 0,
        duration: 1.5
    }, "-=0.5");
    
    tl.to(heart, {
        fillOpacity: 1,
        duration: 2,
    });
    
    tl.to(heart, {
        scale: 0.9,
        duration: 1,
    });
    
    tl.to(heart, {
        scale: 1,
        duration: 1,
        stroke: "#FFAEC0",
        filter: "drop-shadow(0 0 10px #FFAEC0)",
    });
    
    tl.to(heart, {
        scale: 0.9,
        duration: 1
    });
    
    tl.to(heart, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in"
    });
    
    tl.set([".circle-c", ".heart-c"], { display: "none" });
    
    tl.to(".bg", {
        opacity: 1,
        duration: 1,
        ease: "linear"
    });
    
    tl.to(".intro-text-h", {
        opacity: 1,
        duration: 0.1
    });
    
    tl.from(".intro-text-h span", {
        opacity: 0,
        duration: 2,
        ease: "power3.out",
        y: "30px",
        stagger: 0.5,
        force3D: true
    });
    
    tl.to(".scroll-down", {
        opacity: 0.8,
        duration: 0.5,
        ease: "power2.in",
        delay: 1,
    });
    
    tl.set(".gallery-section", { display: "flex" });
    
    // Enable scrolling after animation completes
    tl.call(() => {
        document.body.classList.remove('no-scroll');
    });
    
    // Initialize gallery scroll animation AFTER gallery is displayed
    tl.call(() => {
        initGalleryAnimation();
    });
};

// Function to initialize gallery animation
function initGalleryAnimation() {
    // Split text into characters for animation
    const caption = document.querySelector('.caption');
    const subCap = document.querySelector('.sub-cap');
    const chars1 = caption.textContent.split("");
    const chars2 = subCap.textContent.split("");

    caption.innerHTML = chars1.map(char => `<span class="char1">${char}</span>`).join("");
    subCap.innerHTML = chars2.map(charr => `<span class="char2">${charr}</span>`).join("");

    // Ensure pics are positioned at bottom
    gsap.set(".pics", { 
        xPercent: -50,
        x: 0,
        bottom: "5vh",
        left: "50%",
        top: "auto"
    });

    // Gallery scroll animation timeline
    const tl2 = gsap.timeline({
        scrollTrigger: {
            trigger: ".gallery-section",
            start: "top top",
            end: "+=6000",
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
                // When scroll reaches the end (progress = 1), transition
                if (self.progress >= 0.99 && !window.yesNoTransitioned) {
                    window.yesNoTransitioned = true;
                    transitionToYesNoPage();
                }
            }
        }
    });

    // 1. Rose & Card entrance
    tl2.from("#rose", { 
        opacity: 0, 
        scale: 0.2, 
        duration: 2, 
        ease: "back.out(1.7)" 
    });

    tl2.from(".caption-card", { 
        scale: 0.5, 
        y: 100, 
        opacity: 0, 
        duration: 3 
    }, "-=1");

    // 2. Text Bounce animation
    tl2.from(".char1", { 
        y: -50, 
        opacity: 0, 
        ease: "bounce.out", 
        stagger: 0.1 
    });

    tl2.from(".char2", { 
        y: -30, 
        opacity: 0, 
        ease: "bounce.out", 
        stagger: 0.05 
    }, "-=0.5");

    // 3. Pictures drop animation - they stack at the bottom
    tl2.to({}, { duration: 2 }); // Pause before first pic

    allPics.forEach((pic, i) => {
        tl2.fromTo(pic, 
            {
                y: -1000,
                rotation: i % 2 === 0 ? -15 : 15,
                opacity: 0,
                bottom: "5vh"
            },
            {
                y: 0,
                rotation: [5, -3, 7, -8][i] || 0,
                opacity: 1,
                duration: 3,
                ease: "bounce.out",
                bottom: "5vh"
            }
        );

        // Viewing time pause
        tl2.to({}, { duration: 4 }); 
    });
    
    // Final pause before transitioning
    tl2.to({}, { duration: 2 });
}

// Function to transition from gallery to yes-no page
function transitionToYesNoPage() {
    const transitionTl = gsap.timeline();
    
    // Fade out gallery
    transitionTl.to(".gallery-section", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.inOut"
    });
    
    // Show yes-no page
    transitionTl.set(".yes-no", { display: "flex" });
    
    // Fade in yes-no page
    transitionTl.from(".yes-no", {
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
    });
    
    // Animate glow points
    transitionTl.from(".glow-point", {
        scale: 0,
        opacity: 0,
        duration: 1.5,
        stagger: 0.3,
        ease: "power2.out"
    }, "-=1");
    
    // Animate text box
    transitionTl.from(".text", {
        scale: 0.8,
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "back.out(1.7)"
    }, "-=1");
    
    // Animate text content
    transitionTl.from(".text p", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");
    
    // Animate "WILL YOU??" text
    transitionTl.from(".text2", {
        scale: 0,
        opacity: 0,
        rotation: -10,
        duration: 1.5,
        ease: "elastic.out(1, 0.5)"
    }, "-=0.5");
    
    // Animate buttons
    transitionTl.from(".buttons", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
    }, "-=0.5");
    
    transitionTl.from(".y", {
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.8");
    
    transitionTl.from(".n", {
        x: 100,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.7)"
    }, "-=0.8");
}

// Button Click Handlers - Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const yesBtn = document.querySelector(".y");
    const noBtn = document.querySelector(".n");
    const textResult = document.querySelector(".text3");
    
    if (yesBtn) {
        yesBtn.onclick = function() {
            // Button celebration animation
            gsap.to(yesBtn, {
                scale: 1.2,
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power2.out"
            });
            
            // Show result text with animation
            textResult.innerHTML = "Love you soooo muchhhhh.<br>Can't wait to meet youuuu...❤️❤️😘";
            
            gsap.from(textResult, {
                scale: 0.8,
                opacity: 0,
                y: 20,
                duration: 1,
                ease: "back.out(2)"
            });
            
            // Confetti effect with hearts
            createHeartConfetti();
        };
    }
    
    if (noBtn) {
        noBtn.onclick = function() {
            // Shake animation for NO button
            gsap.to(noBtn, {
                x: -10,
                duration: 0.1,
                yoyo: true,
                repeat: 5,
                ease: "power1.inOut"
            });
            
            // Show alert after shake
            setTimeout(() => {
                alert("NAHHH. You are mine forever, go click YES!!!");
                
                // Move button to random position
                const maxX = window.innerWidth * 0.3;
                const maxY = window.innerHeight * 0.2;
                const x = (Math.random() - 0.5) * maxX;
                const y = (Math.random() - 0.5) * maxY;
                
                gsap.to(noBtn, { 
                    x: x, 
                    y: y, 
                    duration: 0.3,
                    ease: "power2.out"
                });
            }, 600);
        };
    }
});

// Function to create heart confetti effect
function createHeartConfetti() {
    const yesNoSection = document.querySelector('.yes-no');
    
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '♥';
        heart.style.position = 'absolute';
        heart.style.fontSize = `${Math.random() * 30 + 20}px`;
        heart.style.color = '#FFB3C1';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        yesNoSection.appendChild(heart);
        
        gsap.fromTo(heart, 
            {
                opacity: 0,
                scale: 0,
                rotation: 0
            },
            {
                opacity: 1,
                scale: 1.5,
                rotation: 360,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    gsap.to(heart, {
                        y: -200,
                        opacity: 0,
                        duration: 2,
                        ease: "power1.in",
                        onComplete: () => heart.remove()
                    });
                }
            }
        );
    }
}