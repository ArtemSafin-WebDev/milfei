export default function selectService() {
    const modalInput = document.querySelector('.js-selected-service');
    const selector = '.service__card-link-wrapper[href^="#"]';
    if (modalInput) {
        document.addEventListener('click', event => {
            if (event.target.matches(selector) || event.target.closest(selector)) {
                const wrapper = event.target.matches(selector) ? event.target : event.target.closest(selector);
                const link = wrapper.closest('.service-card');
                if (link) {
                    const title = link.querySelector('.service-card__title');

                    if (title) {
                        modalInput.value = title.textContent;

                        console.log('Value inserted');
                    }
                } else {
                    console.log('No link');
                }
            }
        });
    }
    const promoInput = document.querySelector('.js-selected-promo');
    const promoSelector = '.promo__card[href^="#"]';
    if (promoInput) {
        document.addEventListener('click', event => {
            if (event.target.matches(promoSelector) || event.target.closest(promoSelector)) {
                const link = event.target.matches(promoSelector) ? event.target : event.target.closest(promoSelector);
                const title = link.querySelector('.promo__card-card-title');
                if (title) {
                    promoInput.value = title.textContent;
                } else {
                    console.log('No title');
                }
            }
        });
    }
}
