import axios from 'axios';

export default function favourites() {
    document.addEventListener('click', event => {
        if (event.target.matches('.service-card__like-btn') || event.target.closest('.service-card__like-btn')) {
            event.preventDefault();
            const btn = event.target.matches('.service-card__like-btn') ? event.target : event.target.closest('.service-card__like-btn');
            if (!btn.hasAttribute('data-id')) {
                console.error('Fav btn has no ID attribute');
                return;
            }
            const id = btn.getAttribute('data-id');

            if (!btn.classList.contains('active')) {
                if (localStorage.getItem('favourites') !== null) {
                    const currentFavourites = JSON.parse(localStorage.getItem('favourites'));
                    currentFavourites.push(id);

                    const uniqueFavourites = [...new Set(currentFavourites)];

                    localStorage.setItem('favourites', JSON.stringify(uniqueFavourites));
                } else {
                    localStorage.setItem('favourites', JSON.stringify([id]));
                }

                btn.classList.add('popover-shown');

                btn.popoverTimer = setTimeout(() => {
                    btn.classList.remove('popover-shown');
                }, 3000);
            } else {
                const currentFavourites = JSON.parse(localStorage.getItem('favourites'));

                const filteredFavourites = currentFavourites.filter(otherId => otherId !== id);

                localStorage.setItem('favourites', JSON.stringify(filteredFavourites));
                // btn.classList.remove('active');

                btn.classList.remove('popover-shown');

                if (btn.popoverTimer) {
                    clearTimeout(btn.popoverTimer);
                    btn.popoverTimer = null;
                }
            }

            checkFavourites();
            checkFavouritesInHeader();
        }
    });


    window.addEventListener('scroll', () => {
        const btns = Array.from(document.querySelectorAll('.service-card__like-btn'));

        btns.forEach(btn => {
            btn.classList.remove('popover-shown');

            if (btn.popoverTimer) {
                clearTimeout(btn.popoverTimer);
                btn.popoverTimer = null;
            }
        })
    }, {
        passive: true
    })

    function checkFavourites() {
        if (localStorage.getItem('favourites') === null) return;
        const currentFavourites = JSON.parse(localStorage.getItem('favourites'));

        console.log('Current fav', currentFavourites);

        const btns = Array.from(document.querySelectorAll('.service-card__like-btn'));

        btns.forEach(btn => {
            if (!btn.hasAttribute('data-id')) return;
            const btnId = btn.getAttribute('data-id');

            if (currentFavourites.includes(btnId)) {
                btn.classList.add('active');
                btn.title = 'Удалить из избранного';
            } else {
                btn.classList.remove('active');
                btn.title = 'Добавить в избранное';
            }
        });
    }

    function checkFavouritesInHeader() {
        const link = document.querySelector('.page-header__favourites');
        if (!link) return;
        if (localStorage.getItem('favourites') === null) {
            link.classList.remove('active');
        } else {
            const currentFavourites = JSON.parse(localStorage.getItem('favourites'));

            console.log(currentFavourites, 'FOR HEADER');
            if (currentFavourites.length === 0) {
                link.classList.remove('active');
            } else {
                link.classList.add('active');
            }
        }
    }

    checkFavourites();

    checkFavouritesInHeader();

    window.checkFavourites = checkFavourites;

    const favContainers = Array.from(document.querySelectorAll('.js-favourites'));

    favContainers.forEach(container => {
        const action = container.getAttribute('data-action');
        const results = container.querySelector('.favourites__results');
        const resultsNotFound = container.querySelector('.services-results__not-found');
        const loader = container.querySelector('.loader');
        const form = container.querySelector('form');
        let currentFavourites = [];
        if (localStorage.getItem('favourites') !== null) {
            currentFavourites = JSON.parse(localStorage.getItem('favourites'));
        }

        let formData = null;

        if (form) {
            formData = new FormData(form);
        } else {
            formData = new FormData();
        }

        formData.append('favourites', currentFavourites.join(','));

        if (action) {
            loader.classList.remove('hidden');
            axios({
                method: 'post',
                url: action,
                data: formData
            })
                .then(res => {
                    console.log('Response', res.data);
                    loader.classList.add('hidden');
                    results.innerHTML = '';

                    if (resultsNotFound) {
                        if (!res.data?.items?.length && !res.data?.sections?.items?.length) {
                            results.style.display = 'none';
                            resultsNotFound.style.display = 'block';
                        } else {
                            results.style.display = '';
                            resultsNotFound.style.display = '';
                        }
                    }

                    if (res.data.items) {
                        const list = document.createElement('ol');
                        list.className = 'services-results-list';

                        results.appendChild(list);

                        res.data.items.forEach(item => {
                            const li = document.createElement('li');
                            li.className = 'services-results-list-item';
                            const card = document.createElement('div');
                            card.className = 'service-card service-card--link';

                            card.innerHTML = `
                            <div class="service-card__content">
                                <h4 class="service-card__title">
                                    ${item.name}
                                </h4>
                            </div>
                            <div class="service-card__price">
                                ${Number(item.price).toLocaleString()} ₽
                            </div>
                            <a href="${item.isModal ? '#callback-modal' : item.url}" class="service__card-link-wrapper">

                            </a>
                            <div class="service-card__btns">
                                <div class="service-card__like-btn-wrapper">
                                    <a href="#" class="service-card__like-btn" data-id="${item.id}">
                                        <svg width="14" height="14" aria-hidden="true"
                                            class="icon-heart">
                                            <use xlink:href="#heart"></use>
                                        </svg>

                                    </a>
                                    <span class="service-card__like-btn-popover">
                                        <span class="service-card__like-btn-popover-inner">
                                            Добавлено в <a href="/favorites">избранное</a>
                                        </span>
                                    </span>
                                </div>
                                <a href="${item.isModal ? '#callback-modal' : item.url}" class="service-card__btn">
                                    ${item.btnText}
                                </a>
                            </div>
                        `;

                            li.appendChild(card);

                            list.appendChild(li);
                        });
                    } else if (res.data.sections) {
                        const accordionsWrapper = document.createElement('div');
                        accordionsWrapper.className =
                            'accordions accordions--no-gap services-device__accordions services-device__accordions--with-top-margin';

                        results.appendChild(accordionsWrapper);

                        res.data.sections.forEach(section => {
                            const accordion = document.createElement('div');
                            accordion.className = 'accordions__accordion accordions__accordion--transparent js-accordion';

                            accordion.innerHTML = `<div class="accordions__accordion-btn js-accordion-btn">
                        <span class="accordions__accordion-btn-text">
                            ${section.name}
                        </span>

                            <svg width="14" height="14" aria-hidden="true" class="icon-caret">
                                <use xlink:href="#caret"></use>
                            </svg>
                        </div>
                        <div class="accordions__accordion-content js-accordion-content">
                            <div
                                class="accordions__accordion-content-inner accordions__accordion-content-inner--small-padding">
                                <div class="services-results favourites__results">
                                    <ol class="services-results-list">
                                        ${section.items
                                            .map(
                                                item => `
                                            <li class="services-results-list-item">
                                                <div class="service-card service-card--link">
                                                    <div class="service-card__content">
                                                        <h4 class="service-card__title">
                                                            ${item.name}
                                                        </h4>
                                                    </div>
                                                    <div class="service-card__price">
                                                        ${Number(item.price).toLocaleString()} ₽
                                                    </div>
                                                    <a href="${item.isModal ? '#callback-modal' : item.url}" class="service__card-link-wrapper">
                        
                                                    </a>
                                                    <div class="service-card__btns">
                                                        <div class="service-card__like-btn-wrapper">
                                                            <a href="#" class="service-card__like-btn" data-id="${item.id}">
                                                                <svg width="14" height="14" aria-hidden="true"
                                                                    class="icon-heart">
                                                                    <use xlink:href="#heart"></use>
                                                                </svg>
                        
                                                            </a>
                                                            <span class="service-card__like-btn-popover">
                                                                <span class="service-card__like-btn-popover-inner">
                                                                    Добавлено в <a href="/favorites">избранное</a>
                                                                </span>
                                                            </span>
                                                        </div>
                                                        <a href="${item.isModal ? '#callback-modal' : item.url}" class="service-card__btn">
                                                            ${item.btnText}
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                            `
                                            )
                                            .join(' ')}
                                    </ol>
                                </div>
                            </div>
                        </div>`;

                            accordionsWrapper.appendChild(accordion);
                        });
                    }

                    if (window.checkFavourites) {
                        window.checkFavourites();
                    }

                    checkFavouritesInHeader();
                })
                .catch(err => {
                    loader.classList.add('hidden');
                    console.error(err);
                });
        } else {
            console.error('Не указан атрибут action');
            return;
        }
    });
}
