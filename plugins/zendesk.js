import { $axios } from '~/utils/api'

export default ({ store, app }) => {
  // if(process.env.NODE_ENV === 'production') {
  // }

  function createZopimElement(d, s) {
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
      $.src = `https://v2.zopim.com/?${process.env.zendeskKey}`
      z.t = +new Date()
      $.type = 'text/javascript'
      e.parentNode.insertBefore($, e)
      resolve()
    })
  }

  // if (process.client) {
  //   window.addEventListener('load', async function () {
  //     await createZopimElement(document, 'script')

  //     // Wait for Zopim to Load
  //     const waitForZopim = setInterval(function () {
  //       if (
  //         window.$zopim === undefined ||
  //         window.$zopim.livechat === undefined
  //       ) {
  //         return
  //       }
  //       // $zopim(async function () {
  //       //   $zopim.livechat.window.hide()
  //       //   console.log($zopim)

  //       //   // location.href = 'https://uat-stayfun.mayohr.com/Zendesk/GetJwt'
  //       //   // $axios
  //       //   //   .get('https://uat-stayfun.mayohr.com/Zendesk/GetJwt')
  //       //   //   .then((res) => console.log(res))
  //       //   // Get Jwt
  //       //   // const result = await store.dispatch('zendesk/getZendeskJwt', {
  //       //   //   token: app.$cookies.get('accessToken'),
  //       //   //   userToken: app.$cookies.get('accessToken')
  //       //   // })
  //       //   // console.log(result)

  //       //   // const xhr = new XMLHttpRequest()
  //       //   // xhr.open('get', 'https://uat-stayfun.mayohr.com/Zendesk/GetJwt')
  //       //   // xhr.onload = function (res) {
  //       //   //   console.log(res)
  //       //   //   console.log(res.responseText)
  //       //   // }
  //       //   // xhr.onerror = function (err) {
  //       //   //   console.log(err)
  //       //   // }
  //       //   // xhr.send()

  //       //   // store.commit('zendesk/setZendeskJwt')

  //       //   $zopim.livechat.authenticate({
  //       //     // Authenticate Zendesk
  //       //     jwtFn: function (cb) {
  //       //       // store
  //       //     }
  //       //   })
  //       // })
  //       clearInterval(waitForZopim)
  //     }, 100)
  //   })

  //   // $(function () {
  //   //   $zopim(function () {
  //   //     $zopim.livechat.window.hide()

  //   //     $zopim.livechat.authenticate({
  //   //       // Authenticate zendesk
  //   //     })
  //   //     $zopim.livechat.setNotes('人員ID：@loginInfo.serialno')
  //   //     //$zopim.livechat.addTags("tag1", "tag2");

  //   //     $('#zensesk_btn').show()
  //   //     $('#zensesk_btn')
  //   //       .unbind('click')
  //   //       .bind('click', function () {
  //   //         if ($zopim.livechat.window.getDisplay() == false) {
  //   //           $zopim.livechat.window.show()
  //   //         } else {
  //   //           $zopim.livechat.window.hide()
  //   //         }
  //   //       })
  //   //   })
  //   // })
  // }

  // return (function (e, t) {
  //   if (!window.outbound) {
  //     for (
  //       var n = (window.outbound = []),
  //         o = [
  //           'identify',
  //           'track',
  //           'handlePush',
  //           'registerApnsToken',
  //           'registerGcmToken',
  //           'disableApnsToken',
  //           'disableGcmToken'
  //         ],
  //         r = 0;
  //       r < o.length;
  //       r++
  //     ) {
  //       var i = o[r]
  //       n[i] = (function (e) {
  //         return function () {
  //           var t = Array.prototype.slice.call(arguments)
  //           return t.unshift(e), n.push(t), n
  //         }
  //       })(i)
  //     }
  //     if (!e.getElementById('outbound-js')) {
  //       var s = e.createElement('script')
  //       ;(s.type = 'text/javascript'),
  //         (s.id = 'outbound-js'),
  //         (s.async = !0),
  //         (s.src = 'https://cdn.outbound.io/' + t + '.js')
  //       var u = e.getElementsByTagName('script')[0]
  //       u.parentNode.insertBefore(s, u)
  //     }
  //   }
  // })(document, 'PUBLIC_KEY')
}
