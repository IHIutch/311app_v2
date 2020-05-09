<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <h1>
          This is the admin page
        </h1>
      </b-col>
      <b-col cols="12">
        <b-button @click="alert('Log Out')">Log Out</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "AdminPage",
  layout: "AdminLayout"
};
</script>
