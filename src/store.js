import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        nodeList: [],
        scrollPosition: {}
    },
    getters: {
        getNodeList: state => {
            return state.nodeList
        },
        getScrollPosition: state => {
            return state.scrollPosition
        }
    },
    mutations: {
        setNodeList(state, payload) {
            state.nodeList = payload
        },
        setScrollPosition(state, payload) {
            state.scrollPosition = payload
        }
    },
    actions: {
        listenNodeListChange(context, payload) {
            context.commit('setNodeList', payload)
        },
        listenScrollPosition(context, payload) {
            context.commit('setScrollPosition', payload)
        }
    }
})