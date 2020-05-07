<template>
  <AdminLayout>
    <b-container>
      <b-row>
        <b-col cols="12">This is the admin page</b-col>
        <b-col cols="12">
          <b-button @click="logOut()">Log Out</b-button>
        </b-col>
      </b-row>
    </b-container>
  </AdminLayout>
</template>

<script>
import AdminLayout from "@/layouts/AdminLayout";
import { auth } from "@/modules/firebase";

export default {
  name: "AdminPage",
  components: { AdminLayout },
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
    },
  },
};
</script>
