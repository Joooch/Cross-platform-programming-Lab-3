<template>
  <v-app>
    <v-card>
      <v-toolbar flat color="blue-grey" dark>
        <v-toolbar-title>Create question</v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-text-field filled label="Title" v-model="title"></v-text-field>

        <quill-editor
          ref="Editor"
          :options="config"
          :content="content"
          @change="onEditorChange($event)"
        />
        <v-divider class="my-2"></v-divider>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="success" depressed @click="doPost"> Post </v-btn>
      </v-card-actions>
    </v-card>
  </v-app>
</template>

<script>
// import Quill from "quill";
// import someModule from "../plugins/quillEditor.js";
// Quill.register("quill-editor", someModule);

export default {
  name: "test",
  data() {
    return {
      config: {
        theme: "snow", // bubble
      },
      title: "",
      content: '<h2>Hello world</h2><p><img src="/kitty.gif"></p>',
    };
  },
  methods: {
    onEditorChange({ html }) {
      console.log(html);
    },
    async doPost() {
      //this.config.theme = "bubble"
      this.editor.disable();
      const id = await this.$store.dispatch("createQuestion", {
        title: this.title,
        content: JSON.stringify(this.editor.getContents()),
      });

      this.$router.push( '/questions/' + id );
    },
  },
  computed: {
    editor() {
      return this.$refs.Editor.quill;
    },
  },
  mounted() {
    console.log("this is current quill instance object", this.editor);
  },
};
</script>