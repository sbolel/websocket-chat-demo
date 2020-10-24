/**
 * @module ws/www
 */
/* global window */

(function ({
  document,
  WebSocket
}) {
  document
    .querySelector('body')
    .insertBefore(
      document.createElement('ul'),
      document.querySelector('script')
    )

  const ul = document.querySelector('ul')

  const li = ({
    data = ''
  } = {}) => {
    const el = document.createElement('li')
    el.innerHTML = data
    return el
  }

  const log = ({
    data = ''
  } = {}) => {
    if (!data) return
    const el = li({ data })
    const { firstChild } = ul
    return firstChild ? ul.insertBefore(el, firstChild) : ul.appendChild(el)
  }

  const configSocket = ({
    url = 'ws://localhost:8000'
  } = {}) => {
    const socket = new WebSocket(url)
    return new Promise((resolve, reject) => {
      const onOpen = (event) => {
        console.debug('WebSocket connection opened', event)
        return resolve(socket)
      }
      const onClose = (event) => {
        console.debug('WebSocket connection closed', event)
        socket.removeEventListener('open', onOpen)
        socket.removeEventListener('close', onClose)
        socket.removeEventListener('error', onError)
        socket.removeEventListener('message', onMessage)
      }
      const onError = (error) => {
        console.error(error)
        return reject(error)
      }
      const onMessage = ({ data } = {}) => {
        console.debug('Server message received', data)
        log({ data })
      }
      socket.addEventListener('open', onOpen)
      socket.addEventListener('close', onClose)
      socket.addEventListener('error', onError)
      socket.addEventListener('message', onMessage)
    })
  }

  const main = async () => {
    try {
      const form = document.querySelector('form')
      const [input] = form
      const socket = await configSocket()
      const onSubmit = (event) => {
        const { target: [{ value } = {}] = [] } = event
        event.preventDefault()
        if (value) socket.send(value)
        input.value = ''
      }
      form.addEventListener('submit', onSubmit)
    } catch (error) {
      console.error(error)
    }
  }

  main()
})(window)
