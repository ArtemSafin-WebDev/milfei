import { Swiper, EffectFade, Pagination } from 'swiper';

Swiper.use([EffectFade, Pagination]);

import gsap from 'gsap';

export default function storiesSlider() {
    const elements = Array.from(document.querySelectorAll('.js-stories-slider'));
    const storiesBtns = Array.from(document.querySelectorAll('.stories-btn'));
   

    storiesBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ym(89214903,'reachGoal','stories')
        })
    })

    elements.forEach(element => {
        const container = element.querySelector('.swiper');
     
        const bullets = Array.from(element.querySelectorAll('.stories__slider-pagination-bullet'));
        const AUTOPLAY_DURATION = 15;
        let activeIndex = 0;

        let timer = null;

        let pausedToContinue = false;

        let currentTween = null;

        const instance = new Swiper(container, {
            slidesPerView: 1,
            effect: 'fade',
            speed: 300,
            fadeEffect: {
                crossFade: true
            },
            init: false,
            on: {
                init: swiper => {
                    autoplay(swiper.realIndex);
                    activeIndex = swiper.realIndex;
                },
                slideChange: swiper => {
                    if (activeIndex === swiper.realIndex) return;
                    autoplay(swiper.realIndex);
                    activeIndex = swiper.realIndex;
                }
            }
        });

        instance.init();


        container.addEventListener('pointerdown', () => {
            if (currentTween) {
                // console.log('Pausing tween')
                currentTween.pause();

                timer = setTimeout(() => {
                    pausedToContinue = true;
                }, 1000);
            } else {
                // console.log('No tween');
            }
        })
        container.addEventListener('pointerup', () => {
          
            if (currentTween) {
                // console.log('Resuming tween')
                currentTween.resume();
            } else {
                // console.log('No tween');
            }
        })

        container.addEventListener('click', event => {
            // if (timer) {
            //     clearTimeout(timer);
            //     timer = null;
            // }
            // if (pausedToContinue) {
            //     console.log('Paused to continue')
            //     pausedToContinue = false;
            //     return;
            // }
            // console.log('Click')

            if (event.offsetX >= container.offsetWidth / 2) {
                instance.slideNext();
            } else {
                instance.slidePrev();
            }
        });

        function autoplay(startIndex) {
            bullets.forEach(bullet => {
                gsap.set(bullet, {
                    '--slider-progress': 0
                });
                gsap.killTweensOf(bullet);
            });

          

            bullets.forEach((bullet, bulletIndex) => {
                if (bulletIndex < startIndex) {
                    gsap.set(bullet, {
                        '--slider-progress': 1
                    });
                }
            });
            currentTween = gsap.fromTo(
                bullets[startIndex],
                { '--slider-progress': 0 },
                {
                    '--slider-progress': 1,
                    duration: AUTOPLAY_DURATION,
                    ease: 'linear',
                    onComplete: () => {
                        instance.slideNext();
                    }
                }
            );
        }

      

        console.log('Stories btns', storiesBtns);

        storiesBtns.forEach(btn => {
            if (!btn.hasAttribute('data-slider-index')) return;
            const index = Number(btn.getAttribute('data-slider-index'));
            btn.addEventListener('click', event => {
                event.preventDefault();

                console.log('Stories index', index);

                instance.slideTo(index, 0);
            });
        });
    });
}
