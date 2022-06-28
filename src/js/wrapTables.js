function wrap(el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

export default function wrapTables() {
    const tables = Array.from(document.querySelectorAll('.article__content table'));

    tables.forEach(table => {
        const wrapper = document.createElement('div');
        wrapper.className = 'article__table-wrapper';
        wrap(table, wrapper);
    });
}
