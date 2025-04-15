import onChange from 'on-change';
import axios from 'axios';
import { validateRssInput, runStartRender, renderRssPosts } from './watchers.js';
import { object, string } from 'yup';
import i18next from 'i18next';
import { nanoid } from 'nanoid'
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
    feeds: [],
    uiState: {
      validate: {
        isValid: null,
        message: null
      }
    }
  }

  const watchedValidate = onChange(state.uiState.validate, (path, value) => {
    validateRssInput(path, value, i18nInstance)
  })

  const watchedState = onChange(state, (path, value) => {
    renderRssPosts(path, value, i18nInstance)
  })

  const setValidateFields = (isValid, message) => {
    watchedValidate.isValid = false;

    watchedValidate.isValid = isValid
    watchedValidate.message = message
  }

  const refreshRssFeed = (list) => {
    setTimeout(() => {
      const promises = list.map(url => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`));
      console.log(list);

      Promise.all(promises)
        .then(data => {
          data.forEach(response => {
            const result = parseRssResponse(response);
            const newPosts = result.posts.filter(post => !watchedState.posts.some(p => post.link === p.link));

            if(newPosts.length > 0) watchedState.posts = [ ...newPosts, ...watchedState.posts ];
          });

          refreshRssFeed(list);
        })
        .catch(error => console.log(error));
    }, 5000);
  }

  const arr = []
  const validate = (url) => {
    return new Promise((resolve, error) => {
        if(arr.includes(url)) {
          setValidateFields(false, 'rssAlreadyAdded')
          return
        }
        urlSchema.validate({url})
          .then(_ => {
            isUrlHasRssFeed(url)
              .then(_ => {
                arr.push(url)
                setValidateFields(true, 'success');
                resolve(url)
              })
              .catch(errorMesssage => setValidateFields(false, errorMesssage));
          })
          .catch(_ => setValidateFields(false,'invalidUrl'))
    })
  }

  function isUrlHasRssFeed (url) {
    return new Promise((resolve, error) => {
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
        .then(response => {
          if(response.status != 200 && response.status != 201) {
            error('connectionError');
            return
          }

          const parser = new DOMParser()
          const data = parser.parseFromString(response.data.contents, 'text/xml')

          try {
            const feedTitle = data.querySelector('channel > title').textContent
            resolve(url)
          } catch(err) {
            error('noValidRss')
          }
        })
        .catch(e => error('connectionError'))
    })
  }

  const parseRssResponse = (response) => {
      const nanoId = nanoid(6)
      const parser = new DOMParser()
      const data = parser.parseFromString(response.data.contents, 'text/xml')

      const feedTitle = data.querySelector('channel > title')?.textContent ?? ''
      const feedDescription = data.querySelector('channel > description')?.textContent ?? ''
      const postsXML = data.querySelectorAll('channel > item')

      const feed = {
        id: nanoId,
        title: feedTitle,
        description: feedDescription
      };

      const posts = []

      postsXML.forEach(item => {
        posts.push({
          id: nanoId,
          title: item.querySelector('title').textContent,
          description: item.querySelector('description').textContent,
          link: item.querySelector('link').textContent
        })
      });

      return ({
        nanoId,
        feed,
        posts,
      });
  }


  function getDataPosts(url) {
    axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${url}`)
      .then(function (response) {
        const result = parseRssResponse(response);

        watchedState.feeds = [ result.feed, ...watchedState.feeds ];         
        watchedState.posts = [ ...result.posts, ...watchedState.posts ];
      })
      .catch(_ => setValidateFields(false, 'connectionError'));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);

    validate(data.get('url')) 
      .then(url => getDataPosts(url))
    //.catch(message => handleValidateFailed(message))
  })

  refreshRssFeed(arr);
}

runApp()
