import axios from 'axios';

export default function servicesFilter() {
    const elements = Array.from(document.querySelectorAll('.js-services-filter'));

    elements.forEach(element => {
        const select = element.querySelector('.services-filter__category-select');
        const selectBtn = element.querySelector('.services-filter__category-select-current');
        const selectDropdown = element.querySelector('.services-filter__category-select-dropdown');
        const selectText = element.querySelector('.services-filter__category-select-current-text');
        const selectInputs = Array.from(element.querySelectorAll('.services-filter__category-select-item-input'));
        const selectItems = Array.from(element.querySelectorAll('.services-filter__category-select-item'));
        const tagsLayers = Array.from(element.querySelectorAll('.services-filter__tags-layer'));
        const form = element.querySelector('form');
        const actionURL = form.getAttribute('action');
        const allTags = Array.from(element.querySelectorAll('.services-filter__tag-input'));
        const selectAllTags = Array.from(element.querySelectorAll('.js-all-tag'));
        const searchBtn = element.querySelector('.services-filter__modes-btn--search');
        const searchInput = element.querySelector('.services-filter__category-search-input');
        const closeSearch = element.querySelector('.services-filter__modes-btn--close-search');
        const results = element.querySelector('.services-filter__results');
        let offset = 0;

        console.log('Action', actionURL);

        selectBtn.addEventListener('click', event => {
            event.preventDefault();
            selectDropdown.classList.toggle('shown');
            select.classList.toggle('active');
        });

        document.addEventListener('click', event => {
            if (event.target.matches('.services-filter__category-select') || event.target.closest('.services-filter__category-select')) {
                return;
            }

            selectDropdown.classList.remove('shown');
            select.classList.remove('active');
        });

        const setSelectValue = () => {
            let checkedRadio = selectItems.find(item => {
                const input = item.querySelector('input[type="radio"]');

                return input.checked;
            });
            let checkedRadioIndex = selectItems.findIndex(item => {
                const input = item.querySelector('input[type="radio"]');

                return input.checked;
            });

            if (!checkedRadio) {
                if (selectItems.length) {
                    checkedRadio = selectItems[0];
                    checkedRadio.querySelector('input[type="radio"]').checked = true;
                    checkedRadioIndex = 0;

                    console.log('Checked first radio');
                } else {
                    return;
                }
            }

            const radioValue = checkedRadio.querySelector('.services-filter__category-select-item-text').textContent;

            selectText.textContent = radioValue;

            console.log("CHECKED RADIO", checkedRadio)

            // const url = new URL(window.location);
            // url.searchParams.set('SECTION_ID', checkedRadio.querySelector('input').value);
            // window.history.pushState({}, '', url);

            tagsLayers.forEach(layer => {
                layer.classList.remove('active');
                const layerInputs = Array.from(layer.querySelectorAll('input[type="checkbox"]'));
                layerInputs.forEach(input => (input.disabled = true));
            });

            const currentTagsLayer = tagsLayers[checkedRadioIndex];

            currentTagsLayer.classList.add('active');

            const currentTags = Array.from(currentTagsLayer.querySelectorAll('input[type="checkbox"]'));

            currentTags.forEach(tag => (tag.disabled = false));

            offset = 0;

            allTags.forEach(tag => (tag.checked = false));

            selectAllTags.forEach(tag => (tag.checked = true));

            sendData();
        };

        selectInputs.forEach(item => {
            item.addEventListener('change', () => {
                selectDropdown.classList.remove('shown');
                select.classList.remove('active');

                setSelectValue();
            });
        });

        setSelectValue();

        allTags.forEach(tag => {
            tag.addEventListener('change', () => {
                if (tag.matches('.js-all-tag') && tag.checked) {
                    const otherTagsInGroup = Array.from(
                        tag.closest('.services-filter__tags-layer').querySelectorAll('.services-filter__tag-input:not(.js-all-tag)')
                    );

                    otherTagsInGroup.forEach(tag => (tag.checked = false));
                } else {
                    const allTagInGroup = tag.closest('.services-filter__tags-layer').querySelector('.js-all-tag');
                    allTagInGroup.checked = false;
                }
                sendData();
            });
        });

        function sendData() {
            const formData = new FormData(form);
            formData.append('offset', offset);
            axios({
                method: 'post',
                url: actionURL,
                data: formData
            })
                .then(res => {
                    console.log('Response', res.data);

                    results.innerHTML = '';

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
                                <a href="${item.url}" class="service__card-link-wrapper">
    
                                </a>
                                <a href="#" class="service-card__like-btn" style="visibility: hidden;">
                                    <svg width="14" height="14" aria-hidden="true" class="icon-heart">
                                        <use xlink:href="#heart"></use>
                                    </svg>
                                </a>
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
                                                        <a href="${item.url}" class="service__card-link-wrapper">
    
                                                        </a>
                                                        <a href="#" class="service-card__like-btn" style="visibility: hidden;">
                                                            <svg width="14" height="14" aria-hidden="true" class="icon-heart">
                                                                <use xlink:href="#heart"></use>
                                                            </svg>
                                                        </a>
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
                })
                .catch(err => {
                    console.error(err);
                });
        }

        searchBtn.addEventListener('click', event => {
            event.preventDefault();
            element.classList.add('search-shown');
        });

        const filterTags = () => {
            const value = searchInput.value.trim().toLowerCase();

            const tagsNotShowAll = allTags;
            // const tagsNotShowAll = allTags.filter(tag => !tag.matches('.js-all-tag'));

            const filteredTags = tagsNotShowAll.filter(tag => {
                const text = tag
                    .closest('.services-filter__tag')
                    .querySelector('.services-filter__tag-content')
                    .textContent.trim()
                    .toLowerCase();

                console.log('TExt', text);

                if (text.includes(value)) return true;
                return false;
            });

            tagsNotShowAll.forEach(tag => {
                const label = tag.closest('.services-filter__tag');
                if (filteredTags.includes(tag)) {
                    label.classList.remove('hidden');
                } else {
                    label.classList.add('hidden');
                }
            });
        };

        searchInput.addEventListener('input', () => {
            filterTags();
        });

        closeSearch.addEventListener('click', event => {
            event.preventDefault();
            element.classList.remove('search-shown');
            searchInput.value = '';
            filterTags();
        });

        form.addEventListener('submit', event => {
            event.preventDefault();
        });
    });
}
