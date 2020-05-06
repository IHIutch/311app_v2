<template>
  <b-container>
    <b-row>
      <b-col cols="12">This is the admin page</b-col>
      <b-col cols="12">
        <b-button @click="logOut()">Log Out</b-button>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { auth } from "@/modules/firebase";

export default {
  name: "AdminPage",
  data() {
    return {};
  },
  methods: {
    logOut() {
      auth.signOut().then(() => {
        auth.onAuthStateChanged(() => {
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
