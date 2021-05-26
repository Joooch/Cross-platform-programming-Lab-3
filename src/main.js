import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import quillEditor from "./plugins/quillEditor.js";

Vue.config.productionTip = false

Vue.use( quillEditor );

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
