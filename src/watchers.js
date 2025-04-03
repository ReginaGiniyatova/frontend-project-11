const form = document.querySelector('#form');
const errorMessage = document.querySelector('#error_message')

const runStartRender = (i18n) => {
const title = document.querySelector('#title')
const desc = document.querySelector('#description')
const label = document.querySelector('#label')
const btn = document.querySelector('#btnAdded')

title.textContent = i18n.t('header')

desc.textContent = i18n.t('description');
label.textContent = i18n.t('label');
btn.textContent = i18n.t('button');
}

const handleValidateFailed = (path, value, i18n) => {
    if (path === 'isValid') {
      const input = document.querySelector('#url-input')
      input.classList.add('border');
      input.classList.add('border-danger');
      input.classList.add('border-2');
      errorMessage.classList.add('invisible')
      errorMessage.classList.remove('visible')
    } else if (path === 'message') {
      console.log(i18n.t(`feedback.${value}`))
      errorMessage.classList.remove('invisible')
      errorMessage.textContent = i18n.t(`feedback.${value}`)
    }
}

const handleValidateSuccess = (i18n) => {
    const input = document.querySelector('#url-input')
    input.classList.remove('border');
    input.classList.remove('border-danger');
    input.classList.remove('border-2');
    form.reset()
    input.focus()

    errorMessage.classList.remove('text-danger')
    errorMessage.classList.add('text-success')
    errorMessage.classList.remove('invisible')
    errorMessage.classList.add('visible')
    errorMessage.textContent = i18n.t('feedback.success')
}


export { handleValidateFailed, handleValidateSuccess, runStartRender }