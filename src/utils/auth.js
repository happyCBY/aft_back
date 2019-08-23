import Cookies from 'js-cookie'

// const TokenKey = 'vue_admin_template_token'
const  TokenKey = 'dreamTouch'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, {expires: (1/24)*2})
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
