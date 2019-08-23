import { handleLoginIn, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,asyncRouterMap, constantRouterMap } from '@/router/index'
// import { asyncRouterMap, constantRouterMap } from '@/router';
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    // return roles.some(role => route.meta.role.indexOf(role) >= 0)
    // console.log(route.meta.role.indexOf(roles) >= 0);
    return route.meta.role.indexOf(roles) >= 0
  } else {
    return true
  }
}

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  routers: constantRouterMap,
  addRouters: []
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
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers;
    state.routers = constantRouterMap.concat(routers);
    // console.log(state.routers,'constantRouterMap');
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      handleLoginIn({"args":userInfo}).then((response) => {
        const obj  = userInfo;
        localStorage.setItem("managerInfo",JSON.stringify(response.obj));
        commit('SET_TOKEN', obj.token);
        setToken(obj.token);//dreamtouch
        resolve()
      }).catch(error => {
        console.log(error);
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // getInfo(state.token).then(response => {
        const { result } = JSON.parse(localStorage.getItem("managerInfo"));
        if (!result) {
          reject('Verification failed, please Login again.')
        }
        const { realName } = result
        commit('SET_NAME', realName)
        resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        localStorage.removeItem("managerInfo");
      commit('SET_NAME', '');
        resolve()
      // }).catch(error => {
      //   reject(error)
      // })
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

  //计算可访问路由
  generateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const { roles } = data;
      // console.log(roles);
      const accessedRouters = asyncRouterMap.filter(v => {
        // console.log(roles,v,'roles');
        if (roles.indexOf('100') >= 0) return true;
        if (hasPermission(roles, v)) {
          // console.log(hasPermission(roles, v),'hasPermission');
          if (v.children && v.children.length > 0) {
            v.children = v.children.filter(child => {
              if (hasPermission(roles, child)) {
                // console.log(roles,child,'child');
                return child
              }
              return false;
            });
            return v
          } else {
            return v
          }
        }
        return false;
      });
      commit('SET_ROUTERS', accessedRouters);
      resolve(state.routers);
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

