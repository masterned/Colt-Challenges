const tag = name => name && document.createElement(name)
const text = string => string && document.createTextNode(string)

const assoc = key => val => obj => {
  if (val) obj[key] = val
  return obj
}

const identify = assoc('id')
const classify = assoc('className')
const name = assoc('name')
const value = assoc('value')
const title = assoc('title')
const labelFor = assoc('htmlFor')

const setAttribute = key => val => obj => {
  if (val) obj.setAttribute(key, val)
  return obj
}

const type = setAttribute('type')
const method = setAttribute('method')
const action = setAttribute('action')

const listen = event => fn => elem => {
  if (fn) elem.addEventListener(event, fn)
  return elem
}

const onclick = listen('click')

const append = child => parent => !child ? parent : parent.appendChild(child) && parent

const children = _children => elem => {
  if (_children)
    if (Array.isArray(_children))
      _children.forEach(
        child => child instanceof Element
          ? append(child)(elem)
          : append(fromTemplate(child))(elem)
      )
  return elem
}

const pipe = (...fns) => arg => fns.reduce((acc, fn) => fn(acc), arg)

const fromTemplate = template => pipe(
  identify(template.id),
  classify(template.class),
  name(template.name),
  value(template.value),
  title(template.title),
  labelFor(template.for),
  type(template.type),
  method(template.method),
  action(template.action),
  onclick(template.onclick),
  append(text(template.text)),
  children(template.children)
)(tag(template.tag))

const toggleHidden = elem => elem && elem.style && (
  elem.style.visibility = elem.style.visibility === 'hidden'
    ? 'visible'
    : 'hidden'
) && elem

const hide = elem => (elem.style.display = 'none') && elem

const show = elem => (elem.style.display = 'block') && elem

const step1 = fromTemplate({
  tag: 'div',
  id: 'step1',
  class: 'card',
  children: [
    {
      tag: 'h3',
      text: 'There\'s labels too!'
    },
    {
      tag: 'label',
      for: 'email',
      text: 'Your e-mail'
    },
    {
      tag: 'input',
      id: 'email',
      name: 'email',
      title: 'Your e-mail',
      type: 'email'
    },
    {
      tag: 'button',
      value: 'continue',
      text: 'continue',
      onclick: e => {
        e.preventDefault()
        hide(step1)
        show(step2)
        hide(step3)
      }
    }
  ]
})

const step2 = hide(fromTemplate({
  tag: 'div',
  id: 'step2',
  class: 'card',
  children: [
    {
      tag: 'label',
      for: 'password',
      text: 'Password'
    },
    {
      tag: 'input',
      id: 'password',
      name: 'password',
      title: 'password',
      type: 'password'
    },
    {
      tag: 'button',
      value: 'continue',
      text: 'continue',
      onclick: e => {
        e.preventDefault()
        hide(step1)
        hide(step2)
        show(step3)
      }
    },
    {
      tag: 'button',
      value: 'back',
      text: 'back',
      onclick: e => {
        e.preventDefault()
        show(step1)
        hide(step2)
        hide(step3)
      }
    }
  ]
}))

const step3 = hide(fromTemplate({
  tag: 'div',
  id: 'step3',
  class: 'card',
  children: [
    {
      tag: 'p',
      text: 'Finish!'
    },
    {
      tag: 'button',
      value: 'submit',
      text: 'submit'
    },
    {
      tag: 'button',
      value: 'back',
      text: 'back',
      onclick: e => {
        e.preventDefault()
        hide(step1)
        show(step2)
        hide(step3)
      }
    }
  ]
}))

const form = fromTemplate({
  tag: 'form',
  method: 'POST',
  action: '#',
  children: [
    {
      tag: 'a',
      class: 'step-link',
      text: 'Step 1',
      href: '#',
      onclick: e => {
        e.preventDefault()
        show(step1)
        hide(step2)
        hide(step3)
      }
    },
    step1,
    {
      tag: 'a',
      class: 'step-link',
      text: 'Step 2',
      href: '#',
      onclick: e => {
        e.preventDefault()
        hide(step1)
        show(step2)
        hide(step3)
      }
    },
    step2,
    {
      tag: 'a',
      class: 'step-link',
      text: 'Step 3',
      href: '#',
      onclick: e => {
        e.preventDefault()
        hide(step1)
        hide(step2)
        show(step3)
      }
    },
    step3
  ]
})

const stepper = document.getElementById('stepper')
append(form)(stepper)
