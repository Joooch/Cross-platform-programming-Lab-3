<template>
  <v-app>
    <v-row>
      <v-col cols="12">
        <v-card width="95%" class="mx-auto" hover>
          <v-toolbar height="40%" flat color="primary" dark>
            <v-toolbar-title>Question: {{ question.title }}</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <quill-editor
              ref="Question"
              :options="config"
              content="question.content"
              @ready="onEditorReady($event)"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <h4>Question by {{ question.user ? question.user.name : "" }}</h4>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-toolbar
          width="95%"
          height="40%"
          class="mx-auto"
          flat
          color="secondary"
          dark
        >
          <v-toolbar-title>Answers:</v-toolbar-title>
        </v-toolbar>

        <v-col cols="12" v-for="(data, key) in answers" :key="key">
          <v-card width="95%" class="mx-auto" hover>
            <v-card-text>
              <quill-editor
                :options="config"
                :content="data.content"
                @ready="onEditorReady($event, key, true)"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <h4>Answer by {{ data.user.name }}</h4>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-col>

      <v-col cols="12" v-if="user && user.name">
        <v-card width="95%" class="mx-auto">
          <h1>Your answer</h1>
          <v-card-text>
            <quill-editor ref="Answer" :content="answerContent" />
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="mx-auto"
              color="success"
              depressed
              @click="sendAnswer"
            >
              Send My Answer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      config: {
        theme: "bubble",
      },
      content: "<h1> </h1>",
      answerContent: "",
      answers: {},
      question: {
        content: "",
      },
    };
  },
  methods: {
    onEditorReady(quill, key) {
      if (key != undefined) {
        this.answers[key].quill = quill;
        if (this.answers[key].JSONContent) {
          quill.setContents(this.answers[key].JSONContent);
        }
      }
      quill.disable();
    },
    async sendAnswer() {
      this.answerQuill.disable();
      const answers = await this.$store.dispatch("makeAnswer", {
        id: this.$route.params.id,
        content: JSON.stringify(this.answerQuill.getContents()),
      });

      for (const key in answers) {
        let answer = answers[key];
        answer.JSONContent = JSON.parse(answer.content);
        answer.content = "<h1> loading </h1>";
      }

      this.answers = answers;
      this.answerQuill.enable();
      this.answerQuill.setContents({});
    },
  },
  async mounted() {
    const response = await this.$store.dispatch("getQuestion", {
      id: this.$route.params.id,
    });

    if (!response) {
      this.$router.push("/");
      return;
    }
    this.question = {
      title: response.data.title,
      user: response.data.user,
      content: "<h1> </h1>",
    };
    this.questionQuill.setContents(JSON.parse(response.data.content));

    for (const key in response.data.answers) {
      let answer = response.data.answers[key];
      answer.JSONContent = JSON.parse(answer.content);
      answer.content = "<h1> loading </h1>";
    }

    this.answers = response.data.answers;
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    answerQuill() {
      return this.$refs.Answer.quill;
    },
    questionQuill() {
      return this.$refs.Question.quill;
    },
  },
};
</script>