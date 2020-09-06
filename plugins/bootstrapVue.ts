import Vue from 'vue'
import {
  // BootstrapVue,
  BContainer,
  BRow,
  BCol,
  BCarousel,
  BFormRadioGroup,
  BFormRadio
} from 'bootstrap-vue'

const components = [
  { name: BContainer, value: 'b-container' },
  { name: BRow, value: 'b-row' },
  { name: BCol, value: 'b-col' },
  { name: BCarousel, value: 'b-carousel' },
  { name: BFormRadioGroup, value: 'b-form-radio-group' },
  { name: BFormRadio, value: 'b-form-radio' }
]

components.forEach((component) => {
  Vue.component(component.value, component.name)
})

// Install BootstrapVue
// Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
// Vue.use(IconsPlugin)
