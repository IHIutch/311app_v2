<template>
  <div></div>
</template>

<script>
export default {
  name: 'AccountPage',
  layout: 'PublicLayout',
  middleware: 'auth',
  asyncData({ $axios, route, error, $config }) {
    return $axios
      .$get(`api/v1/auth/user`)
      .then((res) => {
        if (res) {
          return {
            ...res,
          }
        } else {
          throw new Error(error)
        }
      })
      .catch((err) => {
        if (err) {
          error({ statusCode: 404, error: 'You must log in to see this page.' })
        }
      })
  },
}
</script>
