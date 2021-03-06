import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		list: null,

		user: false,
		alert: {
			active: false,
			text: "",
			color: "error"
		}
	},
	mutations: {
		setUser: (state, payload) => {
			payload.icon = payload.icon || "/user.jpg";
			state.user = payload;
		},
		setQuestions_list: (state, payload) => {
			state.list = payload;
		},

		setAlert: (state, payload) => {
			state.alert.active = true;
			state.alert.text = payload[0];
			state.alert.color = payload[1] ? payload[1] : "red darken-1 white--text";
		},
	},
	getters: {
		user: state => {
			return state.user;
		},
		list: state => {
			return state.list;
		},
		alert: state => {
			return state.alert;
		}
	},
	actions: {
		getUser: async (context) => {
			await axios.get('/user')
				.then(res => {
					if (res.status == 200 && res.data.name) {
						context.commit('setUser', res.data);
					}
				}).catch(console.error);
		},
		getQuestionsList: async (context) => {
			let response = await axios.get('/question/list');
			context.commit('setQuestions_list', response.data);
		},

		logout: async () => {
			return await axios.post("/user/logout");
		},
		register: (context, payload) => {
			return axios.post("/user/register", {
				name: payload.name,
				password: payload.password,
			})
		},
		login: (context, payload) => {
			return axios.post("/user/login", {
				name: payload.name,
				password: payload.password
			});
		},
		alert: (context, payload) => {
			context.commit('setAlert', payload);
		},

		getQuestion: async (context, payload) => {
			return await axios.get( "/question/get/" + payload.id ).catch( err => {
				context.commit('setAlert', [err]);
			})
		},
		createQuestion: async (context, payload) => {
			return await axios.post("/question/create", payload).catch((err) => {
				context.commit('setAlert', [err]);
			}).then( res => {
				return res.data.id
			});
		},
		makeAnswer: async (context, payload) => {
			return await axios.post("/question/makeAnswer", payload).catch((err) => {
				context.commit('setAlert', [err]);
			}).then( res => {
				return res.data
			});
		}
	},
})
