<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :mini-variant="mini" permanent app>
      <v-sheet color="grey lighten-4" class="pa-4" v-if="user">
        <v-avatar class="mb-4" color="grey darken-1" size="64">
          <v-icon v-if="!user.icon" dark> mdi-account-circle </v-icon>
          <v-img v-else :src="'/' + user.icon" />
        </v-avatar>

        <div>{{ user.name }}</div>
      </v-sheet>

      <v-sheet color="grey lighten-4" class="pa-4" v-else>
        <v-avatar class="mb-4" color="grey darken-1" size="64">
          <v-icon dark> mdi-account-circle </v-icon>
        </v-avatar>

        <div>Guest</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text, action] in links"
          :key="icon"
          @click="handleClick(text)"
          :to="action || undefined"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-snackbar
        v-model="alert.active"
        :color="alert.color"
        timeout="1500"
        top
        content-class="text-center"
      >
        {{ alert.text }}
      </v-snackbar>

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",

  async mounted() {
    await this.$store.dispatch("getUser");
    if (this.user) {
      this.links.push([
        "mdi-help-circle",
        "Create Question",
        "/createQuestion",
      ]);
      this.links.push(["mdi-logout", "Logout"]);
    } else {
      this.links.push(["mdi-login", "Login", "/login"]);
    }
    return;
  },

  data: () => ({
    snackbar: true,

    cards: ["Today", "Yesterday"],
    drawer: null,
    links: [["mdi-home", "Home", "/"]],
  }),

  methods: {
    handleClick(name) {
      switch (name) {
        case "Logout":
          this.$store.dispatch("logout");
          this.$router.go();
          break;
      }
    },
  },

  computed: {
    user() {
      return this.$store.getters.user;
    },
    alert() {
      return this.$store.getters.alert;
    },
    mini() {
      return this.$vuetify.breakpoint.mdAndDown;
    },
  },
};
</script>