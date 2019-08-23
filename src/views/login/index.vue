<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <img src="@/assets/img/pic_login_bg.jpg" style="height: 100%">
      <div style="padding: 150px 70px;background: white;width:400px;height: 100%">
        <div class="title-container">
          <h3 class="title">登录</h3>
        </div>
        <div>账号</div>
        <el-form-item prop="username" class="form-box">
          <img src="@/assets/img/ic_login_user.png">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <div>密码</div>
        <el-form-item prop="password" class="form-box">
          <img src="@/assets/img/ic_login_password.png">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
        </el-form-item>

        <el-button :loading="loading" type="primary" class="login-btn" @click.native.prevent="handleLogin">登录</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
// import { validUsername } from '@/utils/validate'
// import { handleLoginIn } from '@/api/user';
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    //登录密码显示
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = '';
      } else {
        this.passwordType = 'password';
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      let args = {
        "account": this.loginForm.username,
        "password": this.$sha256(this.loginForm.password)
      };
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.$store.dispatch('user/login',args).then((res) => {
            this.$router.push({ path: '/index' || '/' });
            this.loading = false
          }).catch((error) => {
            this.loading = false
          })
        } else {
          this.$message.error('请输入用户名密码');
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
/*$bg:#5796F3;*/
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
.form-box .el-form-item__content{
  display: flex;
  align-items: center;
}
/* reset element-ui css */
.login-container {
  font-size: 18px;
  color: #333333;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 80%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #032657;
      height: 47px;
      /*opacity:0.1;*/
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 2px solid #EFF2F5;
    color: #454545;
    margin-top: 10px;
  }

  .login-btn{
    width:100%;
    margin-top: 30px;
    margin-bottom:30px;
    background: #5796F3;
    border-radius: 22.5px;
  }
}
</style>

<style lang="scss" scoped>
$bg:#E3F1FF;
$dark_gray:#889aa4;
$black_color:#2A3D57;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    min-width: 1200px;
    height: 650px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      font-size: 30px;
      color: $black_color;
      margin: 0px auto 40px auto;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
