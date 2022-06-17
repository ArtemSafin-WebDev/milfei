export default function selectService() {
    const modalInput = document.querySelector('.js-selected-service');
    const selector = '.service__card-link-wrapper[href^="#"]';
    if (!modalInput) return;
    document.addEventListener('click', event => {
        if (event.target.matches(selector) || event.target.closest(selector)) {
            const link = event.target.matches(selector) ? event.target : event.target.closest(selector);
            const title = link.querySelector('.service-card__title');

            if (title) {
                modalInput.value = title.textContent;
            }
        }
    })
}