import axios from 'axios';

export default function forms() {
    const callbackForms = Array.from(document.querySelectorAll('.js-callback-form'));

    callbackForms.forEach(form => {
        const actionURL = form.getAttribute('action');
        const success = form.querySelector('.modal__callback-modal-form-success');
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (
                $(form)
                    .parsley()
                    .isValid()
            ) {
                const formData = new FormData(form);

                axios({
                    method: 'post',
                    url: actionURL,
                    data: formData
                })
                    .then(res => {
                        form.reset();
                        $(form)
                            .parsley()
                            .reset();
                        success.classList.add('active');
                        console.log('Response', res.data);
                        setTimeout(() => {
                            success.classList.remove('active');
                        }, 4000);
                    })
                    .catch(err => console.error(err));
            }
        });
    });

    const sendPhone = Array.from(document.querySelectorAll('.js-send-phone'));
    sendPhone.forEach(form => {
        const input = form.querySelector('input[type="tel"]');
        const message = form.nextElementSibling;
        const actionURL = form.getAttribute('action');
        message.style.display = 'none';

        input.addEventListener('input', event => {
            console.log(input.value);

            const isValidPhoneNumber = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(input.value);

            console.log('Is valid', isValidPhoneNumber);

            if (isValidPhoneNumber) {
                axios({
                    method: 'post',
                    url: actionURL,
                    data: formData
                })
                    .then(res => {
                        message.style.display = '';

                        setTimeout(() => {
                            message.style.display = 'none';
                            input.value = '';
                           
                        }, 4000);
                    })
                    .catch(err => console.error(err));
            }
        });
    });
}
