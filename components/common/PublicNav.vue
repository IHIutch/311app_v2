<template>
  <b-navbar type="light" variant="white" fixed="top" class="shadow-sm h-14">
    <b-navbar-brand to="/"> Buffalo 311 </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-item to="/register" class="mr-2">Register</b-nav-item>
      <b-nav-item to="/log-in" class="mr-2">Log In</b-nav-item>
      <b-button variant="primary" to="/create"> Create New Report </b-button>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
export default {
  name: 'PublicNav',
}
</script>
