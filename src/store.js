import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        nodeList: []
    },
    getters: {
        getNodeList: state => {
            return state.nodeList
        }
    },
    mutations: {
        setNodeList(state, payload) {
            state.nodeList = payload
        }
    },
    actions: {
        listenNodeListChange(context, payload) {
            context.commit('setNodeList', payload)
        }
    }
})