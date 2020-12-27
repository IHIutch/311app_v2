<template>
  <div>
    <b-container class="pb-5 pt-20">
      <b-row>
        <b-col cols="6" offset="3">
          <div class="bg-white shadow-sm p-4 rounded-sm">
            <div class="mb-5">
              <h1>Reset Password</h1>
              <span class="text-muted">Request a password reset link</span>
            </div>
            <b-form @submit.prevent="reset()">
              <b-form-group label="Email" label-for="email" class="mb-8">
                <b-form-input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  placeholder="Enter email"
                ></b-form-input>
              </b-form-group>
              <div class="d-flex">
                <div class="mr-3">
                  <b-button type="submit" variant="primary" :disabled="busy">
                    <span v-if="busy" class="mr-2">
                      <b-spinner small label="Submitting..." />
                    </span>
                    <span>{{ busy ? 'Sending...' : 'Send Link' }}</span>
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
  name: 'ForgotPasswordPage',
  layout: 'PublicLayout',
  data() {
    return {
      email: '',
      errorMessage: null,
      busy: false,
    }
  },
  methods: {
    reset() {
      this.busy = true
    },
  },
}
</script>
