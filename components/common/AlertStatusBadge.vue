<template>
  <div>
    <b-badge pill :variant="badge.variant">{{ badge.text }}</b-badge>
  </div>
</template>

<script>
import { alertStatus } from '~/constants'

export default {
  name: 'AlertStatusBadge',
  props: {
    status: {
      type: String,
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
  },
  computed: {
    badge() {
      let variant, text
      if (this.status === alertStatus.PUBLISHED) {
        variant = 'warning'
        text = 'Active'
      } else if (this.status === alertStatus.ENDED) {
        variant = 'danger'
        text = 'Ended'
      } else {
        variant = 'primary'
        text = 'Blah'
      }
      return {
        variant,
        text,
      }
    },
  },
}
</script>
