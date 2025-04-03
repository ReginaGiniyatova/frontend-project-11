import onChange from 'on-change';
import { handleValidateFailed, handleValidateSuccess, runStartRender } from './watchers.js';
import { object, string } from 'yup';
import i18next from 'i18next';
import resources from './localization/languages.js';

const urlSchema = object({
    url: string().required().url()
})

function runApp() {
  const i18nInstance = i18next.createInstance();

  i18nInstance.init({
    lng: 'ru',
    resources
  }).then(() => {
    runStartRender(i18nInstance)
  })


  const state = {
    posts: [],
    uiState: {
      validate: {
        isValid: null,
        message: null
      }
    }
  }

  const watchedValidate = onChange(state.uiState.validate, (path, value) => {
    console.log('path: ', path)
    console.log('value: ', value)
    handleValidateFailed(path, value, i18nInstance)
  })

  const arr = []
  const validate = (url) => {
    return new Promise((resolve, error) => {
        if(arr.includes(url)) {
            // error('Адрес уже был добавлен!')
            watchedValidate.message = 'rssAlreadyAdded'
            return
        }
        urlSchema.validate({url})
        .then(_ => {
            arr.push(url)
            resolve()
        })
        // .catch(_ => error('Неверный формат RSS ленты'))
        .catch(_ => {
          watchedValidate.isValid = false
          watchedValidate.message = 'invalidUrl'
          // error(state.uiState.validate.message)
        })
    })
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    validate(data.get('url')) 
    .then(_ => handleValidateSuccess(i18nInstance))
    // .catch(message => handleValidateFailed(message))
  })
}

runApp()
