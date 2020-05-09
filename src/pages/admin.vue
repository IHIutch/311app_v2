<template>
  <b-container>
    <b-row>
      <b-col cols="12">
        <h1>You are signed in as {{ currentUser }}</h1>
      </b-col>
      <b-col cols="12">
        <b-button @click="logOut()">Log Out</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "AdminPage",
  layout: "AdminLayout",
  data() {
    return {
      currentUser: null
    };
  },
  created() {
    this.getCurrentUser();
  },
  methods: {
    async getCurrentUser() {
      try {
        this.$fireAuth.onAuthStateChanged(user => {
          this.currentUser = user.email;
        });
      } catch (e) {
        alert(e);
      }
    },
    logOut() {
      this.$fireAuth.signOut().then(() => {
        this.$fireAuth.onAuthStateChanged(() => {
          if (this.$route.path === "/") {
            this.$router.go();
          } else {
            this.$router.push("/");
          }
        });
      });
    }
  }
};
</script>
