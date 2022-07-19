export default function pageHeaderPhones() {
    const phonesBtn = document.querySelector('.page-header__phones');
    if (!phonesBtn) return;

    phonesBtn.addEventListener('click', event => {
        event.preventDefault();
        phonesBtn.classList.toggle('active');

        if (window.closeMenu) {
            window.closeMenu();
        }
    })

    document.addEventListener('click', event => {
        const insideBtn = event.target.matches('.page-header__phones') || event.target.closest('.page-header__phones');
        const insideDropdown =  event.target.matches('.page-header__phones-dropdown') || event.target.closest('.page-header__phones-dropdown');

        if (insideBtn || insideDropdown) {
            return;
        } else {
            phonesBtn.classList.remove('active')
        }
    })
}