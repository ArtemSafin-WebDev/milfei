import axios from 'axios';

export default function forms() {
    const callbackForms = Array.from(document.querySelectorAll('.js-callback-form'));

    callbackForms.forEach(form => {
        const actionURL = form.getAttribute('action');
        const success = form.querySelector('.modal__callback-modal-form-success');
        const error = form.querySelector('.modal__callback-modal-form-error');
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
                        if (res.data.success) {
                            form.reset();
                            $(form)
                                .parsley()
                                .reset();
                            success.classList.add('active');
                            console.log('Response', res.data);
                            setTimeout(() => {
                                success.classList.remove('active');
                            }, 4000);
                        } else {
                            error.classList.add('active');
                            console.log('Error', res.data.error);
                            setTimeout(() => {
                                error.classList.remove('active');
                            }, 4000);
                        }
                    })
                    .catch(err => {
                        error.classList.add('active');
                        console.log('Error', err);
                        setTimeout(() => {
                            error.classList.remove('active');
                        }, 4000);
                    });
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
                message.textContent = '...';
                message.style.display = '';

                axios({
                    method: 'post',
                    url: actionURL,
                    data: formData
                })
                    .then(res => {
                        setTimeout(() => {
                            if (res.data.success) {
                                message.textContent = res.data.message;
                                setTimeout(() => {
                                    message.style.display = 'none';
                                    message.textContent = '...';
                                    input.value = '';
                                }, 4000);
                            } else {
                                message.textContent = res.data.error;
                                setTimeout(() => {
                                    message.style.display = 'none';
                                    message.textContent = '...';
                                    input.value = '';
                                }, 4000);
                            }
                        }, 300);
                    })
                    .catch(err => {
                        console.error(err);
                        message.textContent = err.message;
                        setTimeout(() => {
                            message.style.display = 'none';
                            message.textContent = '...';
                            input.value = '';
                        }, 4000);
                    });
            }
        });
    });
}
