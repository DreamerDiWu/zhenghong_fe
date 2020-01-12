const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  message: state => state.user.message, 
  n_no_read: state => state.user.n_no_read, 
  transact_orders: state => state.user.transact_orders
}
export default getters
