<template>
  <v-app id="inspire">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Register</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon="mdi-account"
                  v-model="name"
                  label="Username"
                  type="text"
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-lock"
                  v-model="password"
                  label="Password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  prepend-icon="mdi-lock-alert"
                  v-model="confirm_password"
                  label="Confirm Password"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn to="login">Login</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="register">Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      name: "",
      password: "",
      confirm_password: "321",
    };
  },
  methods: {
    register() {
      if (this.password != this.confirm_password) {
        this.$store.dispatch("alert", ["Password mismatch"]);
        return;
      }

      this.$store
        .dispatch("register", {
          name: this.name,
          password: this.password,
        })
        .then(() => {
          this.$store.dispatch("alert", ["Success!", "success"]);
          this.$router.push("/");
          this.$router.go();
        })
        .catch((err) => {
          this.$store.dispatch("alert", [err.response.data.error]);
        });
    },
  },
};
</script>