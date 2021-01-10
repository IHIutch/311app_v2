import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('date', (val, format) => {
  return dayjs(val).format(format)
})
