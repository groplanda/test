const validate = require('validate.js');
import { debounce } from 'lodash';

export default function contactForm() {

    const forms = document.querySelectorAll('[data-js="form"]');

    const userRegExp = /^[а-яА-Я\s]*$/;

    const validationData = {
        name: {
            presence: true,
            length: {
                minimum: 2,
                maximum: 30,
                tooShort: 'Недостаточно символов',
                tooLong: 'Не более %{count} символов'
            },
            format: {
                pattern: userRegExp,
                message: "Только кириллица"
            }
        },
        confirm: {
            presence: true,
            numericality: {
                equalTo: 1
            }
        },
        company_site: {
            presence: true,
            url: {
                message: 'Неверная ссылка'  
            },
            length: {
                minimum: 2,
                maximum: 100,
                tooShort: 'Укажите сайт компании',
                tooLong: 'Не более %{count} символов'
            }
        },
        phone: {
            presence: true,
            length: {
                minimum: 12,
                maximum: 12,
                tooShort: 'Заполните номер телефона',
                tooLong: 'Неверно заполнен телефон'
            }
        }
    };

    const prepareFormData = (formData) => {
        let newFormData = new FormData();
        for (let pair of formData.entries()) {
          let key = pair[0];
          let value = pair[1];
          if (key === 'phone') {
            let phone = value.replace(/[- )(_]/g,'');
            newFormData.append(key, phone);
          } else {
            newFormData.append(key, value);
          }
        }
        return newFormData;
    };

    const showErrors = (form, errors) => {
        Object.keys(errors).forEach(key => {
            const input = form.querySelector(`[name=${key}]`);
            
            if (input) {
                input.classList.add('--error');
            }

            const error = form.querySelector(`[data-error-for="${key}"]`);

            if (error) {
                error.textContent = errors[key];
            }

        });
    };

    const resetErrors = (form) => {
        const inputs = form.querySelectorAll('[data-validation]');
        
        inputs.forEach(input => {
            input.classList.remove('--error');
        });
    };

    const clearErrorByName = (form, name) => {
        const input = form.querySelector(`[name=${name}]`);
        
        if (input) {
            input.classList.remove('--error');
        }
    };

    const showErrorByName = (payload) => {
        const input = payload.form.querySelector(`[name=${payload.name}]`);
        
        if (input) {
            input.classList.add('--error');
        }

        const error = payload.form.querySelector(`[data-error-for="${payload.name}"]`);

        if (error) {
            error.textContent = payload.error;
        }
    };

    const onValidate = (e) => {
        const input = e.target;
        const name = input.name;

        const validationName = input.dataset.validation;

        if (!validationName) {
            return;
        }

        let value;

        if (input.type === 'checkbox') {
            value =  input.checked ? 1 : 0;
        } else {
            value = name === 'phone' ? input.value.replace(/[- )(_]/g,'') : input.value;
        }

        const errors = validate.single(value, validationData[validationName]);
        
        const submit = input.form.querySelector('button[type="submit"]');
    
        if (errors === undefined) {
            clearErrorByName(input.form, name);
            submit.disabled = false;
            return;
        }
    
        errors.forEach(error => {
            showErrorByName({
                error,
                name,
                form: input.form
            });
        });
    
        submit.disabled = true;
    };

    const handleInput = (form) => {
        const inputs = form.querySelectorAll('input:not([type=hidden])');

        inputs.forEach(input => {
            input.addEventListener('input', debounce(onValidate, 200));
        });
    };

    const handleResponse = (response, formEl) => {
        
        if (!response.status) {
            if (response.errors.send !== undefined) {
                return;
            }
            showErrors(formEl, response.errors);
            return;
        }
        formEl.reset();
        
        showSuccess(formEl, response.data.title);

    };

    const showSuccess = (formEl, title) => {
        formEl.classList.add('--success');
        formEl.insertAdjacentHTML('afterbegin', `<p class="form__result">${title}</p>`)
    };

    forms.forEach(formEl => {

        handleInput(formEl);
        
        formEl.addEventListener('submit', async (e) => {
            e.preventDefault();
    
            resetErrors(formEl);

            try {
                const request = await fetch('/backend/send.php', {
                    method: 'POST',
                    body: prepareFormData(new FormData(formEl))
                });
                const response = await request.json();
                handleResponse(response, formEl);
            } catch (error) {
                throw new Error(error.message);
            }
        });
    });
    
}