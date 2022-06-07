export default function tagsCloud() {
    const elements = Array.from(document.querySelectorAll('.services-filter__tags-cloud'));

    elements.forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
            element.classList.toggle('active');
        })
    })
}