import axios from 'axios';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

export default function servicesFilter() {
    const elements = Array.from(document.querySelectorAll('.js-services-filter'));

    elements.forEach(element => {
        const select = element.querySelector('.services-filter__category-select');
        const selectBtn = element.querySelector('.services-filter__category-select-current');
        const selectDropdown = element.querySelector('.services-filter__category-select-dropdown');
        const tagsContainer = element.querySelector('.services-filter__tags');
        const form = element.querySelector('form');
        const actionURL = form.getAttribute('action');
        const allTags = Array.from(element.querySelectorAll('.services-filter__tag-input'));
        const searchBtn = element.querySelector('.services-filter__modes-btn--search');
        const searchInput = element.querySelector('.services-filter__category-search-input');
        const closeSearch = element.querySelector('.services-filter__modes-btn--close-search');
        const showTagsCloud = element.querySelector('.services-filter__tags-cloud');
        const results = element.querySelector('.services-filter__results');
        const tagsNotFound = element.querySelector('.services-filter__tags-not-found');
        let offset = 0;
        const showMoreTags = Array.from(element.querySelectorAll('.services-filter__show-more-tags'));
        const resultsNotFound = document.querySelector('.services-results__not-found');
        const loader = element.querySelector('.loader');

        console.log('Action', actionURL);

        selectBtn.addEventListener('click', event => {
            event.preventDefault();
            selectDropdown.classList.toggle('shown');
            select.classList.toggle('active');
        });

        showMoreTags.forEach(btn =>
            btn.addEventListener('click', event => {
                event.preventDefault();
                btn.parentElement.classList.toggle('show-all');
            })
        );

        document.addEventListener('click', event => {
            if (event.target.matches('.services-filter__category-select') || event.target.closest('.services-filter__category-select')) {
                return;
            }

            selectDropdown.classList.remove('shown');
            select.classList.remove('active');
        });

        allTags.forEach(tag => {
            tag.addEventListener('change', () => {
                if (tag.matches('.js-all-tag') && tag.checked) {
                    const tagsExceptAll = allTags.filter(tag => !tag.matches('.js-all-tag'));
                    tagsExceptAll.forEach(tag => (tag.checked = false));
                } else {
                    const allTag = allTags.find(tag => tag.matches('.js-all-tag'));
                    allTag.checked = false;
                }

                const checkedTag = allTags.find(tag => tag.checked);
                if (!checkedTag) {
                    const allTag = allTags.find(tag => tag.matches('.js-all-tag'));
                    allTag.checked = true;
                }

                sendData();
            });
        });


       

        function sendData() {
            const formData = new FormData(form);
            formData.append('offset', offset);
            loader.classList.remove('hidden');
            axios({
                method: 'post',
                url: actionURL,
                data: formData
            })
                .then(res => {
                    console.log('Response', res.data);
                    loader.classList.add('hidden');
                    results.innerHTML = '';

                    if (typeof window.ym !== 'undefined') {
                        window.ym(89214903, 'reachGoal', 'filter');
                    }

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
                                    <div class="services-results">
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

                    if (window.matchMedia("(max-width: 640px)").matches) {
                        gsap.to(window, {
                            duration: 1.2,
                            ease: 'power2.out',
                            scrollTo: {
                                y: document.querySelector('.services-filter__results'),
                                autoKill: true,
                                offsetY: document.querySelector('.page-header').offsetHeight
                            }
                        });
                    }
                  
                })
                .catch(err => {
                    loader.classList.add('hidden');
                    console.error(err);
                });
        }

        if (results && loader) {
            sendData();
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', event => {
                event.preventDefault();
                element.classList.add('search-shown');
            });
        }

        const filterTags = () => {
            const value = searchInput.value.trim().toLowerCase();
            const filteredTags = allTags.filter(tag => {
                const text = tag
                    .closest('.services-filter__tag')
                    .querySelector('.services-filter__tag-content')
                    .textContent.trim()
                    .toLowerCase();

                console.log('TExt', text);

                if (text.includes(value)) return true;
                return false;
            });

            allTags.forEach(tag => {
                const label = tag.closest('.services-filter__tag');
                if (filteredTags.includes(tag)) {
                    label.classList.remove('hidden');
                } else {
                    label.classList.add('hidden');
                }
            });

            if (value) {
                showMoreTags.forEach(btn => btn.parentElement.classList.add('show-all'));
            } else {
                showMoreTags.forEach(btn => btn.parentElement.classList.remove('show-all'));
            }

            if (showTagsCloud) {
                showTagsCloud.classList.add('active');
            }

            if (tagsNotFound) {
                if (filteredTags.length) {
                    tagsNotFound.style.display = '';
                    tagsContainer.style.display = '';
                } else {
                    tagsNotFound.style.display = 'block';
                    tagsContainer.style.display = 'none';
                }
            }
        };

        if (searchInput) {
            searchInput.addEventListener('input', () => {
                filterTags();
            });
        }

        if (closeSearch) {
            closeSearch.addEventListener('click', event => {
                event.preventDefault();
                element.classList.remove('search-shown');
                searchInput.value = '';
                filterTags();
            });
        }

        form.addEventListener('submit', event => {
            event.preventDefault();
        });

        if (window.matchMedia('(max-width: 640px)').matches) {
            showTagsCloud.classList.add('active');
        }
    });
}
