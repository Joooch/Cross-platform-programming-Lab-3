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
		SET_USER: (state, payload) => {
			payload.icon = payload.icon || "/user.jpg";
			state.user = payload;
		},
		SET_LIST: (state, payload) => {
			state.list = payload;
		},

		SET_ALERT: (state, payload) => {
			state.alert.active = true;
			state.alert.text = payload[0];
			state.alert.color = payload[1];
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
		GET_USER: async (context) => {
			await axios.get('/user')
				.then(res => {
					if (res.status == 200 && res.data.name) {
						context.commit('SET_USER', res.data);
					}
				}).catch(console.error);
		},
		GET_LIST: async (context) => {
			let response = await axios.get('/list');
			context.commit('SET_LIST', response.data);
		},

		logout: async () => {
			return await axios.post("/logout");
		},
		register: (context, payload) => {
			return axios.post("register", {
				name: payload.name,
				password: payload.password,
			})
		},
		login: (context, payload) => {
			return axios.post("/login", {
				name: payload.name,
				password: payload.password
			});
		},
		alert: (context, payload) => {
			context.commit('SET_ALERT', payload);
		},

		getQuestion: async (context, payload) => {
			return await axios.get( "/getQuestion/" + payload.id ).catch( err => {
				context.commit('SET_ALERT', [err, "error"]);
			})
		},
		createQuestion: async (context, payload) => {
			return await axios.post("/createQuestion", payload).catch((err) => {
				context.commit('SET_ALERT', [err, "error"]);
			}).then( res => {
				console.log(res);
				console.log(res.data.id);
				return res.data.id
			});
		},
		makeAnswer: async (context, payload) => {
			return await axios.post("/makeAnswer", payload).catch((err) => {
				context.commit('SET_ALERT', [err, "error"]);
			}).then( res => {
				console.log(res);
				console.log(res.data.id);
				return res.data
			});
		}
	},
})
