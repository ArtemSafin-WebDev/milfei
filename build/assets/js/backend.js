document.addEventListener('DOMContentLoaded', () => {
    const sendPhone = Array.from(document.querySelectorAll('.js-send-phone'));
    sendPhone.forEach(form => {
        const input = form.querySelector('input[type="tel"]');
        const message = form.nextElementSibling;

        message.style.display = 'none';

        input.addEventListener('input', event => {
            console.log(input.value);

            const isValidPhoneNumber = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/.test(input.value);

            console.log('Is valid', isValidPhoneNumber);

            if (isValidPhoneNumber) {
                // Ajax

                message.style.display = '';

                setTimeout(() => {
                    message.style.display = 'none';
                    input.value = '';
                }, 4000);
            }
        });
    });
});
