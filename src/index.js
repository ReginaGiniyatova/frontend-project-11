import { object, string } from 'yup';

const urlSchema = object({
    url: string().required().url()
})

const arr = []
const form = document.querySelector('#form');
const errorMessage = document.querySelector('#error_message')

const handleValidateFailed = (message) => {
    const input = document.querySelector('#url-input')
    input.classList.add('border');
    input.classList.add('border-danger');
    input.classList.add('border-2');
    errorMessage.classList.add('visible')
    errorMessage.classList.remove('invisible')
    errorMessage.textContent = message
}

const handleValidateSuccess = () => {
    const input = document.querySelector('#url-input')
    input.classList.remove('border');
    input.classList.remove('border-danger');
    input.classList.remove('border-2');
    form.reset()
    input.focus()
    errorMessage.classList.remove('visible')
    errorMessage.classList.add('invisible')
    errorMessage.textContent = ''
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    console.log(data.get('url'))
    validate(data.get('url')) 
    .then(_ => handleValidateSuccess())
    .catch(message => handleValidateFailed(message))
})

const validate = (url) => {
    return new Promise((resolve, error) => {
        if(arr.includes(url)) {
            error('Адрес уже был добавлен!')
            return
        }
        urlSchema.validate({url})
        .then(_ => {
            arr.push(url)
            resolve()
        })
        .catch(_ => error('Неверный формат RSS ленты'))
    })
}


