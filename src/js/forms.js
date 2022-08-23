import axios from 'axios';

export default function forms() {
    const callbackForms = Array.from(document.querySelectorAll('.js-callback-form'));

    callbackForms.forEach(form => {
        const actionURL = form.getAttribute('action');
        const success = form.querySelector('.modal__callback-modal-form-success');
        const error = form.querySelector('.modal__callback-modal-form-error');
        const successMessage = form.querySelector('.modal__callback-modal-form-success-heading');
        const errorMessage = form.querySelector('.modal__callback-modal-form-error-heading');
        const returnBtn = form.querySelector('.modal__callback-return-back');
        const submit = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', event => {
            event.preventDefault();
           
            if (
                $(form)
                    .parsley()
                    .isValid()
            ) {
                const formData = new FormData(form);
                if (submit) {
                    submit.disabled = true;
                }
               
                axios({
                    method: 'post',
                    url: actionURL,
                    data: formData
                })
                    .then(res => {
                        if (submit) {
                            submit.disabled = false;
                        }
                      
                        if (res.data.success) {
                            if (typeof window.ym !== 'undefined') {
                                window.ym(89214903, 'reachGoal', 'lead');
                            }
                            form.reset();
                            $(form)
                                .parsley()
                                .reset();
                            successMessage.textContent = res.data.message;
                            success.classList.add('active');

                            console.log('Response', res.data);
                            // setTimeout(() => {
                            //     success.classList.remove('active');
                            // }, 4000);
                        } else {
                            errorMessage.textContent = res.data.error;
                            error.classList.add('active');
                            console.log('Error', res.data.error);
                            setTimeout(() => {
                                error.classList.remove('active');
                            }, 4000);
                        }
                    })
                    .catch(err => {
                        if (submit) {
                            submit.disabled = false;
                        }
                      
                        errorMessage.textContent = err.message;
                        error.classList.add('active');
                        console.log('Error', err);
                        setTimeout(() => {
                            error.classList.remove('active');
                        }, 4000);
                    });
            }
        });

        document.addEventListener('closemodal', event => {
            console.log('Closemodal event', event);
            if (event.detail.modal && event.detail.modal.matches('#callback-modal')) {
                success.classList.remove('active');
                error.classList.remove('active');
            }
        });

        if (returnBtn) {
            returnBtn.addEventListener('click', event => {
                event.preventDefault();
                error.classList.remove('active');
            });
        }
    });

    const sendPhone = Array.from(document.querySelectorAll('.js-send-phone'));
    sendPhone.forEach(form => {
        const input = form.querySelector('input[type="tel"]');
        const message = form.nextElementSibling;
        const actionURL = form.getAttribute('action');
        message.style.display = 'none';

        form.addEventListener('submit', event => {
            event.preventDefault();
        });

        input.addEventListener('input', event => {
            console.log(input.value);

            const isValidPhoneNumber = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(input.value);

            console.log('Is valid', isValidPhoneNumber);

            if (isValidPhoneNumber) {
                message.textContent = '...';
                message.style.display = '';
                const formData = new FormData(form);
                axios({
                    method: 'post',
                    url: actionURL,
                    data: formData
                })
                    .then(res => {
                        setTimeout(() => {
                            if (res.data.success) {
                                if (typeof window.ym !== 'undefined') {
                                    window.ym(89214903, 'reachGoal', 'lead');
                                }
                                message.classList.remove('has-error');
                                message.textContent = res.data.message;
                                setTimeout(() => {
                                    message.style.display = 'none';
                                    message.textContent = '...';
                                    input.value = '';
                                }, 4000);
                            } else {
                                message.textContent = res.data.error;
                                message.classList.add('has-error');
                                setTimeout(() => {
                                    message.style.display = 'none';
                                    message.textContent = '...';
                                    input.value = '';
                                    message.classList.remove('has-error');
                                }, 10000);
                            }
                        }, 300);
                    })
                    .catch(err => {
                        console.error(err);
                        message.textContent = err.message;
                        message.classList.add('has-error');
                        setTimeout(() => {
                            message.style.display = 'none';
                            message.textContent = '...';
                            input.value = '';
                            message.classList.remove('has-error');
                        }, 10000);
                    });
            } else {
                if (!input.value.includes('_')) {
                    message.style.display = '';
                    message.textContent = 'Неверный номер телефона';
                    message.classList.add('has-error');
                    setTimeout(() => {
                        message.style.display = 'none';
                        message.textContent = '...';
                        input.value = '';
                        message.classList.remove('has-error');
                    }, 10000);
                }
            }
        });
    });

    const certificateForms = Array.from(document.querySelectorAll('.js-certifiacte-form'));

    certificateForms.forEach(form => {
        const actionURL = form.getAttribute('action');
        const success = form.querySelector('.certificates__success');
        const error = form.querySelector('.certificates__error');
        const sendBlock = form.querySelector('.certificates__send');
        const tryAgainLinks = Array.from(form.querySelectorAll('.certificates__try-again'));
        const submit = form.querySelector('button[type="submit"]');
        form.addEventListener('submit', event => {
            event.preventDefault();
            if (
                $(form)
                    .parsley()
                    .isValid()
            ) {
                const formData = new FormData(form);
                if (submit) {
                    submit.disabled = true;
                }
                

                axios({
                    method: 'post',
                    url: actionURL,
                    data: formData
                })
                    .then(res => {
                        if (submit) {
                            submit.disabled = false;
                        }
                        
                        if (res.data.success) {
                           
                            form.reset();
                            $(form)
                                .parsley()
                                .reset();
                            sendBlock.style.display = 'none';
                            success.style.display = 'block';
                            error.style.display = '';
                            console.log('Response', res.data);
                            
                        } else {
                            sendBlock.style.display = 'none';
                            success.style.display = '';
                            error.style.display = 'block'
                            console.log('Error', res.data.error);
                        }
                    })
                    .catch(err => {
                        if (submit) {
                            submit.disabled = false;
                        }
                       
                        sendBlock.style.display = 'none';
                        success.style.display = '';
                        error.style.display = 'block'
                        console.log('Error', err);
                    });
            }
        });

        tryAgainLinks.forEach(link => link.addEventListener('click', event => {
            event.preventDefault();
            sendBlock.style.display = '';
            success.style.display = '';
            error.style.display = '';
        }))
    });
}
