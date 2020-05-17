<template>
  <div>
    <b-navbar type="light" variant="white" fixed="top" class="shadow-sm h-14">
      <b-navbar-brand to="/">
        Buffalo 311
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button variant="primary" to="/create">
          Create New Report
        </b-button>
      </b-navbar-nav>
    </b-navbar>
    <div class="pt-14">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicLayout"
};
</script>
