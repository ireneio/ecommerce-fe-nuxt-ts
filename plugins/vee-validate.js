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

extend('minNumber', {
  validate(value, args) {
    return Number(value) >= Number(args.val)
  },
  params: ['val'],
  message: '最小值為{val}'
})

extend('maxNumber', {
  validate(value, args) {
    return Number(value) <= Number(args.val)
  },
  params: ['val'],
  message: '最大值為{val}'
})

extend('eqZero', {
  validate(value, args) {
    return Number(value) === 0
  },
  params: ['val'],
  message: '最小值為 0'
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

extend('oneOf', {
  validate(value, args) {
    return (
      [...args].findIndex((item) => item.toString() === value.toString()) > -1
    )
  },
  params: ['val']
})

// 統一編號
extend('isTaiwanReceipt', {
  validate(value, args) {
    return /^[0-9]{8}$/.test(value)
  },
  message: '非正確統一編號格式'
})

// 自然人憑證
extend('isTaiwanDigitalCert', {
  validate(value, args) {
    return /^[a-zA-Z]{2}[0-9]{14}$/.test(value)
  },
  message: '非正確自然人憑證格式（2 碼英文字母加上 14 碼數字）'
})

// 手機載具
extend('isTaiwanMobileCarrier', {
  validate(value, args) {
    return /^\/{1}[0-9A-Z]{7}$/.test(value)
  },
  message: '非正確手機載具格式（斜線 【 / 】 加上 7 碼數字或大寫字母）'
})
