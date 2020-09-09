const createZopimElement = (d, s) => {
  return new Promise((resolve) => {
    const z = function (c) {
      z._.push(c)
    }
    const $ = (z.s = d.createElement(s))
    const e = d.getElementsByTagName(s)[0]
    z.set = function (o) {
      z.set._.push(o)
    }
    z._ = []
    z.set._ = []
    $.async = !0
    $.setAttribute('charset', 'utf-8')
    $.src = `https://v2.zopim.com/?${process.env.ZENDESK_KEY}`
    z.t = +new Date()
    $.type = 'text/javascript'
    e.parentNode.insertBefore($, e)
    resolve()
  })
}

export default async ({ store, app }) => {
  try {
    // Send Get Token Request
    await store.dispatch('zendesk/getZendeskJwt', {
      token: app.$cookies.get('accessToken')
    })

    if (process.client) {
      await createZopimElement(window.document, 'script')

      // Wait for Zopim to Load
      const waitForZopim = setInterval(function () {
        // Double check if process.env === client
        if (
          window.$zopim === undefined ||
          window.$zopim.livechat === undefined
        ) {
          return
        }
        window.$zopim(function () {
          // $zopim.livechat.window.hide()
          window.$zopim.livechat.authenticate({
            // Authenticate Zendesk
            jwtFn(cb) {
              // Use token to authenticate Zendesk
              const { token } = store.state.zendesk.zendeskJwt
              cb(token)
            }
          })
        })
        window.$zopim.livechat.setNotes('人員ID：@loginInfo.serialno')
        clearInterval(waitForZopim)
      }, 100)
    }
  } catch (e) {
    // Failed to get JWT from backend
  }
}
