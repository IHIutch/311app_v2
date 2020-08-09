<template>
  <div>
    <b-container class="pb-5 pt-20">
      <b-row>
        <b-col cols="6" offset="3">
          <div class="bg-white shadow-sm p-4 rounded-sm">
            <h1 class="mb-5">Log In</h1>
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
              <div class="d-flex">
                <div class="mr-3">
                  <b-button type="submit" variant="primary" :disabled="busy">
                    <span class="mr-2" v-if="busy">
                      <b-spinner small label="Submitting..." />
                    </span>
                    <span>{{ busy ? "Logging in..." : "Log In" }}</span>
                  </b-button>
                </div>
                <div>
                  <b-button variant="link" to="/forgot-password">
                    Forgot Password
                  </b-button>
                </div>
              </div>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
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
      busy: false
    };
  },
  methods: {
    signIn() {
      this.busy = true;
    }
  }
};
</script>
