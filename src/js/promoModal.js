import Cookies from 'js-cookie'

export default function promoModal() {
   
    if (typeof window.openModal !== 'function') return;


    document.addEventListener('closemodal', event => {
        const modal = event.detail.modal;
        if (!modal) return;
        if (modal.querySelector('.promo__card')) {
            Cookies.set('promomodal', 'hidden', { expires: 1 })
        }
    })

    if (Cookies.get('promomodal') === 'hidden') return;

    const promoModal = document.querySelector('#promo-modal')


    if (!promoModal) return;

    const input = promoModal.querySelector('.js-modal-timer');


    setTimeout(() => {
        window.openModal('#promo-modal')
    }, input.value.trim() ? Number(input.value) * 1000 : 15000)

}