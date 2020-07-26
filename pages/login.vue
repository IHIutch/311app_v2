<template>
  <b-container class="py-5">
    <b-row>
      <b-col cols="6" offset="3">
        <div class="bg-white shadow-sm p-4 rounded-sm">
          <div v-if="errorMessage" class="mb-4">
            <b-alert variant="danger" show>{{ errorMessage }}</b-alert>
          </div>
          <b-form @submit.prevent="signIn()">
            <b-form-group label="Email" label-for="email">
              <b-form-input
                id="email"
                v-model="form.email"
                type="email"
                required
                placeholder="Enter email"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Password" label-for="password">
              <b-form-input
                id="password"
                v-model="form.password"
                required
                placeholder="Enter password"
                type="password"
              ></b-form-input>
            </b-form-group>
            <b-button type="submit" variant="primary" :disabled="isLoggingIn">
              <span v-if="isLoggingIn">
                <b-spinner small label="Submitting..." />
              </span>
              <span v-else>Log In</span>
            </b-button>
          </b-form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "LoginPage",
  layout: "PublicLayout",
  data() {
    return {
      form: {
        email: "",
        password: ""
      },
      errorMessage: null,
      isLoggingIn: false
    };
  },
  methods: {
    signIn() {
      let self = this;
      this.isLoggingIn = true;
      this.$fireAuth
        .signInWithEmailAndPassword(this.form.email, this.form.password)
        .then(userData => {
          self.$router.push("/admin");
          return userData;
        })
        .catch(error => {
          this.isLoggingIn = false;
          this.errorMessage = error.message;
        });
    }
  }
};
</script>
