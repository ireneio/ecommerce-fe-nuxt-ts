import { extend } from 'vee-validate'

extend('required', {
  validate(value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    }
  },
  message: '此欄位為必填',
  computesRequired: true
})

extend('max', {
  validate(value, args) {
    return Number(args.val) >= value.length
  },
  params: ['val'],
  message: '長度不可大於{val}'
})

extend('min', {
  validate(value, args) {
    return Number(args.val) < value.length
  },
  params: ['val'],
  message: '長度不可小於{val}'
})

extend('numeric', {
  validate(value, args) {
    // return !isNaN(value)
    return value.match(/^([0-9]+)$/)
  },
  params: ['val'],
  message: '必須為數字'
})

extend('taiwanPhone', {
  validate(value, args) {
    return value.length === 9 && value.match(/^([0-9]+)$/)
  },
  params: ['val'],
  message: '必須為 9 碼數字'
})

extend('chinaPhone', {
  validate(value, args) {
    return value.length === 10 && value.match(/^([0-9]+)$/)
  },
  params: ['val'],
  message: '必須為 10 碼數字'
})

extend('isEmail', {
  validate(value, args) {
    return value.includes('@') && value.indexOf('@') !== value.length - 1
  },
  params: ['val'],
  message: '非正確 Email 格式'
})

extend('isPassword', {
  validate(value, args) {
    // A-Z && a-z && 0-9
    // return value.match(/[A-Za-z]/) && value.match(/[0-9]/)
    return value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\w{8,12}$/)
  },
  params: ['val'],
  message: '非正確密碼格式'
})
