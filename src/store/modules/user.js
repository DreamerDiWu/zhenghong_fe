import { login, logout, getInfo, updateEvent } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  role: '',
  message: [],
  notReadNumber: 0,
  review_event: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  },
  SET_MESSAGE: (state, message) => {
    state.message = message
  },
  SET_NOTREAD: (state, notReadNumber) => {
    state.notReadNumber = notReadNumber
  },
  SET_REVIEW: (state, review_event) => {
    state.review_event = review_event
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const {data} = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (!response.data) {
          reject('Verification failed, please Login again.')
        }
        const { name, avatar, role, message, review_event } = response.data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role)
        commit('SET_MESSAGE', message)
        commit('SET_REVIEW', review_event)
        let notReadNum = 0
        
        message.forEach(msg=>{
          if (msg.status == 'not_read')
            notReadNum++
        })
        commit('SET_NOTREAD', notReadNum)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLE', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    console.log('resetToken')
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  handleRead({ commit }) {
    return new Promise(resolve => {
      commit('SET_NOTREAD', 0)
      let event_id_batch = []
      state.message.forEach(msg=>{
        if (msg.status == 'not_read')
        event_id_batch.push(msg.event_id)
      })
      updateEvent(state.token, {event_id: event_id_batch, event_type: 'notice'})
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

