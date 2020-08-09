<template>
  <div>
    <b-container class="pb-5 pt-20">
      <b-row>
        <b-col cols="6" offset="3">
          <div class="bg-white shadow-sm p-4 rounded-sm">
            <div class="mb-5">
              <h1>Enter a New Password</h1>
            </div>
            <b-form @submit.prevent="update()" autocomplete="off">
              <b-form-group
                label="New Password"
                label-for="new-password"
                class="mb-8"
              >
                <b-form-input
                  id="new-password"
                  v-model="password"
                  type="password"
                  required
                  autocomplete="new-password"
                ></b-form-input>
              </b-form-group>
              <div class="d-flex">
                <div class="mr-3">
                  <b-button type="submit" variant="primary" :disabled="busy">
                    <span class="mr-2" v-if="busy">
                      <b-spinner small label="Submitting..." />
                    </span>
                    <span>
                      {{ busy ? "Updating..." : "Update Password" }}
                    </span>
                  </b-button>
                </div>
                <div>
                  <b-button variant="link" to="/login">
                    Back to Login
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
  name: "ResetPasswordPage",
  layout: "PublicLayout",
  data() {
    return {
      password: "",
      errorMessage: null,
      busy: false
    };
  },
  methods: {
    update() {
      this.busy = true;
    }
  }
};
</script>
