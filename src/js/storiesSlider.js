import { Swiper, EffectFade, Pagination } from 'swiper';

Swiper.use([EffectFade, Pagination]);

export default function storiesSlider() {
    const elements = Array.from(document.querySelectorAll('.js-stories-slider'));

    elements.forEach(element => {
        const container = element.querySelector('.swiper');
        const storiesBtns = Array.from(document.querySelectorAll('.stories-btn'));

        const instance = new Swiper(container, {
            slidesPerView: 1,
            effect: 'fade',
            speed: 600,
            fadeEffect: {
                crossFade: true
            },
            pagination: {
                el: element.querySelector('.stories__slider-pagination'),
                type: 'bullets',
                clickable: true
            }
        });

        container.addEventListener('click', event => {
            console.log('Event', event);

            if (event.offsetX >= container.offsetWidth / 2) {
                instance.slideNext();
            } else {
                instance.slidePrev();
            }
        });

        console.log('Stories btns', storiesBtns)

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
