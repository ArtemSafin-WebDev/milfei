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

            const tagsNotShowAll = allTags.filter(tag => !tag.matches('.js-all-tag'));

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
        }

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
        })
    });
}