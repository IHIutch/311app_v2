<template>
  <div>
    <PublicNav />
    <nuxt class="pt-14" />
  </div>
</template>

<script>
import PublicNav from '@/components/common/PublicNav'

export default {
  name: 'PublicLayout',
  components: {
    PublicNav,
  },
}
</script>
