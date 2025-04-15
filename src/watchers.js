const form = document.querySelector('#form');
const errorMessage = document.querySelector('#error_message')

const runStartRender = (i18n) => {
  const title = document.querySelector('#title')
  const desc = document.querySelector('#description')
  const label = document.querySelector('#label')
  const btn = document.querySelector('#addButton')

  title.textContent = i18n.t('header')

  desc.textContent = i18n.t('description');
  label.textContent = i18n.t('label');
  btn.textContent = i18n.t('button');
}

const handleValidateState = (isValid, i18n) => {
  const input = document.querySelector('#url-input')

  if(!isValid) {
    input.classList.add('border', 'border-danger', 'border-2');
    errorMessage.classList.add('invisible', 'text-danger')
    errorMessage.classList.remove('visible', 'invisible')
    return
  }
  
  input.classList.remove('border', 'border-danger', 'border-2');
  form.reset()
  input.focus()

  errorMessage.classList.remove('text-danger', 'invisible')
  errorMessage.classList.add('text-success', 'visible')
}

const handleValidateMessage = (message, i18n) => {
  errorMessage.textContent = i18n.t(`feedback.${message}`)
}

const rssValidationActions = {
  'isValid': handleValidateState,
  'message': handleValidateMessage,
}

const validateRssInput = (path, value, i18n) => {
  return rssValidationActions[path](value, i18n);
}

const renderFeeds = (container, titleElement, items, i18n) => {
  container.innerHTML = '';

  titleElement.textContent = i18n.t('rss.feeds');

  items.forEach(feed => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;

    li.append(h3, p);

    container.append(li);
  })
}

const renderPosts = (container, titleElement, items, i18n) => {
  container.innerHTML = '';

  titleElement.textContent = i18n.t('rss.posts');
  items.forEach(post => {
    const div = document.createElement('div')
    div.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-4')

    const cardLink = document.createElement('a')
    const cardBtn = document.createElement('button')

    cardBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm')

    cardLink.textContent = post.title
    cardLink.href = post.link
    cardLink.setAttribute('target', '_blank');
    cardLink.classList.add('fw-bold');

    cardBtn.textContent = i18n.t('rss.linkBtn')

    div.append(cardLink, cardBtn)

    container.append(div)
  })
}

const renderRssPosts = (path, value, i18n) => {
  const postsCardTitle = document.querySelector('.card-title');
  const feedsCardTitle = document.querySelector('.feed-title');
  const posts = document.querySelector('#posts')
  const feeds = document.querySelector('#feeds')

  switch(path) {
    case 'feeds': renderFeeds(feeds, feedsCardTitle, value, i18n); break;
    case 'posts': renderPosts(posts, postsCardTitle, value, i18n); break;
    default: console.error(`Invalid path: ${path}, value: ${value}`); break;
  }
}

export { validateRssInput, runStartRender, renderRssPosts }
