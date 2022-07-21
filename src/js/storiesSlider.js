import { Swiper, EffectFade, Pagination } from 'swiper';

Swiper.use([EffectFade, Pagination]);

import gsap from 'gsap';

export default function storiesSlider() {
    const elements = Array.from(document.querySelectorAll('.js-stories-slider'));
    const storiesBtns = Array.from(document.querySelectorAll('.stories-btn'));

    console.log('NEW STORIES SCRIPT')

    storiesBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ym(89214903, 'reachGoal', 'stories');
        });
    });

    elements.forEach(element => {
        const container = element.querySelector('.swiper');

        const bullets = Array.from(element.querySelectorAll('.stories__slider-pagination-bullet'));
        const AUTOPLAY_DURATION = 15;
        const slides = Array.from(element.querySelectorAll('.swiper-slide'))
        let activeIndex = 0;

        let timer = null;

        let pausedToContinue = false;

        let currentTween = null;

        const allVideos = Array.from(element.querySelectorAll('video'));

        const playback = swiper => {
            const video = swiper.slides[swiper.realIndex].querySelector('video');
            if (video) {
                let videoDuration = video.duration;
                console.log('VIDEO duration before check', videoDuration)
                if (isNaN(videoDuration)) {
                    videoDuration = AUTOPLAY_DURATION;
                }

                console.log('VIDEO duration', videoDuration)
                autoplay(swiper.realIndex, videoDuration);
                allVideos.forEach(video => {
                    video.pause();
                    video.currentTime = 0;
                })
                
                video.play();
            } else {
                autoplay(swiper.realIndex);
            }
        };

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
                    console.log('Инициализация')
                    playback(swiper);

                    activeIndex = swiper.realIndex;
                },
                slideChange: swiper => {
                   
                    if (activeIndex === swiper.realIndex) return;
                    console.log("Смена слайда")
                    playback(swiper);

                    activeIndex = swiper.realIndex;
                }
            }
        });

        instance.init();

        container.addEventListener('pointerdown', () => {
            if (currentTween) {
                // console.log('Pausing tween')
                currentTween.pause();

                const currentSlide = slides[activeIndex];
                const video = currentSlide.querySelector('video');

                if (video) {
                    video.pause();
                }

                timer = setTimeout(() => {
                    pausedToContinue = true;
                }, 1000);
            } else {
                // console.log('No tween');
            }
        });
        container.addEventListener('pointerup', () => {
            if (currentTween) {
                // console.log('Resuming tween')

                const currentSlide = slides[activeIndex];
                const video = currentSlide.querySelector('video');

                if (video) {
                    video.play();
                }
                currentTween.resume();
            } else {
                // console.log('No tween');
            }
        });

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

        function autoplay(startIndex, duration = AUTOPLAY_DURATION) {
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
                    duration: duration,
                    ease: 'linear',
                    onComplete: () => {
                        instance.slideNext();
                    }
                }
            );
        }

        console.log('Stories btns', storiesBtns);

        storiesBtns.forEach(btn => {
            // if (!btn.hasAttribute('data-slider-index')) return;
            const index = btn.hasAttribute('data-slider-index') ? Number(btn.getAttribute('data-slider-index')) : 0;
            btn.addEventListener('click', event => {
                event.preventDefault();

                console.log('Stories index', index);

                instance.slideTo(index, 0);

                playback(instance);
            });
        });
    });
}
