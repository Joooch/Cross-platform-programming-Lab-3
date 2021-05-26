<template>
  <div class="home">
    <div class="text-center" v-if="loading">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>

    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <p class="headline mb-1">All Questions</p>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card
            button
            hover
            class="mx-auto"
            max-width="75%"
            outlined
            v-for="(data, key) in list"
            :key="key"
            @click="$router.push('/questions/' + data._id)"
          >
            <v-list-item two-line>
              <v-card min-width="60px">
                <div class="text-center">{{ data.views || 0 }}</div>
                <v-list-item-subtitle class="text-center"
                  >views</v-list-item-subtitle
                >
              </v-card>

              <v-card-actions> </v-card-actions>
              <v-list-item-content>
                <a class="headline mb-1">
                  {{ data.title }}
                </a>

                <v-list-item-subtitle>{{
                  data.user.name
                }}</v-list-item-subtitle>
                <v-list-item-subtitle>
                  asked {{ new Date(data.date).toLocaleString() }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {},
  mounted() {
    this.$store.dispatch("GET_LIST");
    return;
  },
  data() {
    return {
      panel: [0, 1],
    };
  },
  computed: {
    list() {
      return this.$store.getters.list;
    },
    loading() {
      return this.$store.getters.list == null;
    },
  },
};
</script>
