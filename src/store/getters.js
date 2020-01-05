const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  message: state => state.user.message, 
  notReadNumber: state => state.user.notReadNumber, 
  review_event: state => state.user.review_event
}
export default getters
