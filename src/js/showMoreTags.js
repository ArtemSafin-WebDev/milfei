export default function showMoreTags() {
    const elements = Array.from(document.querySelectorAll('.js-show-more-tags'));

    elements.forEach(element => {
        element.addEventListener('click', event => {
            event.preventDefault();
            element.parentElement.classList.toggle('show-all');
        })
    })
}