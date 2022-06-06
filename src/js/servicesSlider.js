import { Swiper, EffectCreative, Pagination, Autoplay, Scrollbar } from 'swiper';

Swiper.use([EffectCreative, Pagination, Autoplay, , Scrollbar]);



export default function servicesSlider() {
   
    const elements = Array.from(document.querySelectorAll('.js-services-slider'));

    elements.forEach(element => {
        const container = element.querySelector('.swiper');

        new Swiper(container, {
            slidesPerView: 'auto',
            spaceBetween: 10,
            speed: 600,
            scrollbar: {
                el: element.querySelector('.services-slider__progress'),
                draggable: true,
                dragSize: 100
            },
            breakpoints: {
                641: {
                    slidesPerView: 4,
                    spaceBetween: 10,
                }
            }
            
        });
    });
}
