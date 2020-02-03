import { login, logout, get_user_info, read_message} from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  role: '',
  message: [],
  n_no_read: 0,
  transact_orders: []
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
  SET_NOTREAD: (state, n_no_read) => {
    state.n_no_read = n_no_read
  },
  SET_TRANSACTION: (state, transact_orders) => {
    state.transact_orders = transact_orders
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
      get_user_info(state.token).then(response => {
        if (!response.data) {
          reject('Verification failed, please Login again.')
        }
        const { name, avatar, role, message, transact_orders } = response.data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_ROLE', role)
        commit('SET_MESSAGE', message)
        commit('SET_TRANSACTION', transact_orders)
        let n_no_read = 0
        
        message.forEach(msg=>{
          if (msg.read_ == 0)
            n_no_read++
        })
        commit('SET_NOTREAD', n_no_read)
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
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },

  readMessage({ commit }) {
    return new Promise(resolve => {
      commit('SET_NOTREAD', 0)
      let msg_id_list = []
      state.message.forEach(msg=>{
        if (msg.read_ == 0)
        msg_id_list.push(msg.message_id)
      })
      read_message(state.token, {message_id: msg_id_list})
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

