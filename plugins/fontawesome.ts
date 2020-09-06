import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faShoppingCart,
  faUserCircle,
  faAngleDown,
  faAngleUp,
  faSearch,
  faPhoneAlt,
  faStar as faStarSolid,
  faExclamationCircle,
  faMapMarkerAlt,
  faChevronLeft,
  faThumbtack,
  faGlobe,
  faPaperclip,
  faCalendar,
  faCommentDots,
  faTicketAlt,
  faUser,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import {
  faQuestionCircle,
  faEyeSlash,
  faBell,
  faStar,
  faClock,
  faEnvelope
} from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const icons = [
  faQuestionCircle,
  faEyeSlash,
  faCheck,
  faBell,
  faShoppingCart,
  faUserCircle,
  faAngleDown,
  faAngleUp,
  faSearch,
  faStarSolid,
  faStar,
  faPhoneAlt,
  faExclamationCircle,
  faClock,
  faMapMarkerAlt,
  faChevronLeft,
  faThumbtack,
  faGlobe,
  faPaperclip,
  faCalendar,
  faEnvelope,
  faCommentDots,
  faTicketAlt,
  faUser,
  faArrowUp
]
icons.forEach((icon) => library.add(icon))

Vue.component('fa', FontAwesomeIcon)
