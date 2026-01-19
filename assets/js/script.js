document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bubblesContainer = document.querySelector('.floating-bubbles');
    const bubbles = [];
    const isMobile = window.innerWidth <= 768;
    const bubbleCount = isMobile ? 4 : 6;
    
    if (bubblesContainer && !prefersReducedMotion) {
        for (let i = 0; i < bubbleCount; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            const size = isMobile ? 20 + Math.random() * 30 : 30 + Math.random() * 50;
            bubble.style.width = size + 'px';
            bubble.style.height = size + 'px';
            bubblesContainer.appendChild(bubble);
            
            bubbles.push({
                element: bubble,
                x: Math.random() * (bubblesContainer.offsetWidth - size),
                y: Math.random() * (bubblesContainer.offsetHeight - size),
                vx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
                vy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
                size: size
            });
        }
        
        function animateBubbles() {
            const containerWidth = bubblesContainer.offsetWidth;
            const containerHeight = bubblesContainer.offsetHeight;
            
            bubbles.forEach(bubble => {
                bubble.x += bubble.vx;
                bubble.y += bubble.vy;
                
                if (bubble.x <= 0 || bubble.x >= containerWidth - bubble.size) {
                    bubble.vx *= -1;
                    bubble.x = Math.max(0, Math.min(containerWidth - bubble.size, bubble.x));
                }
                
                if (bubble.y <= 0 || bubble.y >= containerHeight - bubble.size) {
                    bubble.vy *= -1;
                    bubble.y = Math.max(0, Math.min(containerHeight - bubble.size, bubble.y));
                }
                
                bubble.element.style.transform = `translate(${bubble.x}px, ${bubble.y}px)`;
            });
            
            requestAnimationFrame(animateBubbles);
        }
        
        animateBubbles();
    }
    
    const items = document.querySelectorAll('.grid-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });

    const video = document.querySelector('.welcome-video');
    const controlBtn = document.querySelector('.video-control');
    
    if (video && controlBtn) {
        video.muted = true;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                video.muted = true;
            });
        }
        
        controlBtn.addEventListener('click', () => {
            if (video.muted) {
                video.muted = false;
                controlBtn.classList.remove('muted');
                controlBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            } else {
                video.muted = true;
                controlBtn.classList.add('muted');
                controlBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            }
        });
    }

    const avatarWrapper = document.querySelector('.avatar-wrapper');
    const bentoGrid = document.querySelector('.bento-grid');
    const cardContainer = document.querySelector('.card-container');
    
    if (avatarWrapper && bentoGrid && cardContainer && !prefersReducedMotion) {
        const targetButtons = [items[0], items[1], items[2]];
        let animationComplete = false;
        let currentTarget = 0;
        let velocityY = 0;
        let avatarY = -200;
        let avatarX = 0;
        const gravity = 0.8;
        const bounceHeights = [300, 150, 50];
        let isTransitioning = false;
        let transitionStartX = 0;
        let transitionTargetX = 0;
        let transitionProgress = 0;
        
        avatarWrapper.style.top = avatarY + 'px';
        avatarWrapper.style.transition = 'none';
        
        function getButtonPosition(index) {
            const cardRect = cardContainer.getBoundingClientRect();
            const btnRect = targetButtons[index].getBoundingClientRect();
            return {
                x: btnRect.left - cardRect.left,
                y: btnRect.top - cardRect.top - 40
            };
        }
        
        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }
        
        function animateAvatar() {
            if (animationComplete) return;
            
            if (isTransitioning) {
                transitionProgress += 0.04;
                if (transitionProgress >= 1) {
                    transitionProgress = 1;
                    isTransitioning = false;
                    currentTarget++;
                }
                const eased = easeOutCubic(transitionProgress);
                avatarX = transitionStartX + (transitionTargetX - transitionStartX) * eased;
                avatarWrapper.style.left = avatarX + 'px';
            } else {
                velocityY += gravity;
                avatarY += velocityY;
                
                const targetPos = getButtonPosition(currentTarget);
                const targetBtn = targetButtons[currentTarget];
                
                if (avatarY >= targetPos.y && velocityY > 0) {
                    avatarY = targetPos.y;
                    
                    targetBtn.classList.add('exploding');
                    targetBtn.style.animation = 'buttonHit 0.6s ease';
                    
                    setTimeout(() => {
                        targetBtn.classList.remove('exploding');
                        targetBtn.classList.add('hit-active');
                        targetBtn.style.animation = '';
                    }, 600);
                    
                    if (currentTarget < bounceHeights.length - 1) {
                        velocityY = -Math.sqrt(2 * gravity * bounceHeights[currentTarget]);
                        
                        setTimeout(() => {
                            isTransitioning = true;
                            transitionProgress = 0;
                            transitionStartX = avatarX;
                            const nextPos = getButtonPosition(currentTarget + 1);
                            transitionTargetX = nextPos.x;
                        }, 200);
                    } else {
                        velocityY = -Math.sqrt(2 * gravity * bounceHeights[currentTarget]);
                        
                        setTimeout(() => {
                            if (Math.abs(velocityY) < 5) {
                                animationComplete = true;
                                avatarWrapper.style.transition = 'all 0.8s ease-out';
                                
                                const cardRect = cardContainer.getBoundingClientRect();
                                const videoContainer = document.querySelector('.video-container');
                                const profileInfo = document.querySelector('.profile-info');
                                const videoRect = videoContainer.getBoundingClientRect();
                                const profileRect = profileInfo.getBoundingClientRect();
                                
                                const finalX = 10;
                                const finalY = videoRect.bottom - cardRect.top - 100;
                                
                                avatarWrapper.style.left = finalX + 'px';
                                avatarWrapper.style.top = finalY + 'px';
                            }
                        }, 600);
                    }
                }
                
                avatarWrapper.style.top = avatarY + 'px';
            }
            
            requestAnimationFrame(animateAvatar);
        }
        
        const startAnimation = () => {
            const firstPos = getButtonPosition(0);
            if (firstPos && targetButtons[0]) {
                avatarX = firstPos.x;
                avatarWrapper.style.left = avatarX + 'px';
                animateAvatar();
            }
        };
        
        if (document.readyState === 'complete') {
            setTimeout(startAnimation, 1500);
        } else {
            window.addEventListener('load', () => {
                setTimeout(startAnimation, 1500);
            });
        }
    }
});