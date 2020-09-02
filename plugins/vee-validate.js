import { extend } from 'vee-validate'

extend('required', {
  validate(value) {
    return {
      required: true,
      valid: ['', null, undefined].indexOf(value) === -1
    }
  },
  message: '必填',
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
