// console.image = function (url) {
//   // Create a new `Image` instance
//   var image = new Image()

//   image.onload = function () {
//     // Inside here we already have the dimensions of the loaded image
//     var style = [
//       // Hacky way of forcing image's viewport using `font-size` and `line-height`
//       'font-size: 1px;',
//       'line-height: ' + this.height + 'px;',

//       // Hacky way of forcing a middle/center anchor point for the image
//       'padding: ' + this.height * 0.5 + 'px ' + this.width * 0.5 + 'px;',

//       // Set image dimensions
//       'background-size: ' + this.width + 'px ' + this.height + 'px;',

//       // Set image URL
//       'background: url(' + url + ');'
//     ].join(' ')

//     // notice the space after %c
//     console.log('%c ', style)
//   }

//   // Actually loads the image
//   image.src = url
// }

export default () => {
  // console.image(
  //   'https://scontent.ftpe7-3.fna.fbcdn.net/v/t1.0-9/19989552_268355290315000_6989580815122488002_n.png?_nc_cat=102&_nc_sid=85a577&_nc_ohc=-T_slYouNOQAX_0T9IE&_nc_ht=scontent.ftpe7-3.fna&oh=ad1eb6bae834c23bef16a251a123b76a&oe=5F7EDBC0'
  // )
  console.log(
    '%c ',
    'font-size:100px; background:url(https://scontent.ftpe7-3.fna.fbcdn.net/v/t1.0-9/19989552_268355290315000_6989580815122488002_n.png?_nc_cat=102&_nc_sid=85a577&_nc_ohc=-T_slYouNOQAX_0T9IE&_nc_ht=scontent.ftpe7-3.fna&oh=ad1eb6bae834c23bef16a251a123b76a&oe=5F7EDBC0) no-repeat;background-size:contain;'
  )
  console.log(
    '%c STAY HERE, ALWAYS HAVE FUN ! : )',
    'background: #222; color: #fabf13; font-size: 80px; text-shadow: 3px 3px #fff; border: 3px inset #fabf13; padding: 20px;'
  )
  console.log(
    '%c STOP! <3      ',
    'font-size: 80px; color: #5ab9d1; font-weight:bold; text-shadow: 3px 3px #f87b3d; border: 3px ridge #5ab9d1;'
  )
  // console.log('%c <3', 'font-size: 50px; color: #5ab9d1; font-weight:bold;')
  // console.log('%c 呵呵呵～', 'font-size: 50px; color: #5ab9d1;')
}
