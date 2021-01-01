<template>
  <b-navbar type="light" variant="white" fixed="top" class="shadow-sm h-14">
    <b-navbar-brand to="/"> Buffalo 311 </b-navbar-brand>
    <b-navbar-nav>
      <b-nav-item to="/" class="mr-2">Reports</b-nav-item>
      <b-nav-item to="/alerts" class="mr-2">Alerts</b-nav-item>
    </b-navbar-nav>
    <b-navbar-nav class="ml-auto">
      <template v-if="$auth.loggedIn">
        <b-nav-item class="mr-2" @click="logOut()">Log Out</b-nav-item>
      </template>
      <template v-else>
        <b-nav-item to="/register" class="mr-2">Register</b-nav-item>
        <b-nav-item to="/log-in" class="mr-2">Log In</b-nav-item>
      </template>
      <b-button variant="primary" to="/create"> Create New Report </b-button>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'PublicNav',
  methods: {
    logOut() {
      this.$auth.logout()
    },
  },
}
</script>
