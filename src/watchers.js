const form = document.querySelector('#form');
const errorMessage = document.querySelector('#error_message')
const modalTitle = document.querySelector('.modal-title')
const modalDescription = document.querySelector('.modal-body')
const modalCloseBtn = document.querySelector('.modal-btn-close')
const modalLinkBtn = document.querySelector('.modal-btn-preview')

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

  items.forEach(feed => createFeed(feed, container, i18n));
}

function createFeed(feed, container, i18n) {
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
}

const renderPosts = (container, titleElement, items, i18n) => {
  const currentPostsCount = container.children.length;

  titleElement.textContent = i18n.t('rss.posts');
  items.slice(0, items.length - currentPostsCount)
    .reverse()
    .forEach(post => createPost(post, container, i18n));
}

function createPost(post, container, i18n) {
  const div = document.createElement('div')
  div.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-4')

  const cardLink = document.createElement('a')
  const cardBtn = document.createElement('button')

  cardBtn.classList.add('btn', 'btn-outline-primary', 'btn-sm')

  cardLink.textContent = post.title
  cardLink.href = post.link
  cardLink.setAttribute('target', '_blank');
  cardLink.classList.add(post.visited ? 'fw-normal' : 'fw-bold');
  cardLink.addEventListener('click', (e) => {
    post.visited = true;

    e.target.classList.remove('fw-bold');
    e.target.classList.add('fw-normal', 'text-secondary');
  })

  cardBtn.setAttribute('data-bs-toggle', 'modal');
  cardBtn.setAttribute('data-bs-target', '#modal');
  cardBtn.textContent = i18n.t('rss.linkBtn')

  cardBtn.addEventListener('click', (event) => {
    renderModal(event, post, i18n)
  })

  div.append(cardLink, cardBtn)
  container.prepend(div)
}

function renderModal(event, post, i18n) {
  const linkPost = event.target.parentElement.querySelector('a')

  linkPost.classList.remove('fw-bold')
  linkPost.classList.add('fw-normal', 'text-secondary')

  modalTitle.textContent = post.title
  modalDescription.textContent = post.description
  modalCloseBtn.textContent = i18n.t('modal.close')
  modalLinkBtn.textContent = i18n.t('modal.openEntire')

  modalLinkBtn.addEventListener('click', () => {
    window.open(post.link, '_blank')
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
  