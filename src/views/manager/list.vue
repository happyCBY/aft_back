<template>
  <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
        <el-form-item label="账号" prop="accountName">
          <el-input v-model="ruleForm.accountName" style="width:250px" maxlength="25" placeholder="请输入25个字符内的账号" disabled/>
        </el-form-item>
        <el-form-item label="管理员姓名" prop="adminName">
          <el-input v-model="ruleForm.adminName" style="width:250px" maxlength="25" placeholder="请输入25个字符内的账号" disabled/>
        </el-form-item>
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="ruleForm.oldPwd" style="width:250px" type="password" maxlength="30" placeholder="请输入原密码"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="ruleForm.password" style="width:250px" type="password" maxlength="30" placeholder="请输入新密码"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="cofirmpwd">
          <el-input v-model="ruleForm.cofirmpwd" style="width:250px" type="password" maxlength="30" placeholder="请再次输入新密码"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name: 'manager',
  data() {
    return {
      managerInfo: JSON.parse(localStorage.getItem('managerInfo')),
      ruleForm: {
        accountName: '',
        adminName: '',
        password: '',
        cofirmpwd: '',
        oldPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入密码' },
          { min: 6, message: '请输入不少于六位密码' }
        ],
        password: [
          { required: true, message: '请输入密码' },
          { min: 6, message: '请输入不少于六位密码' }
        ],
        cofirmpwd: [
          { required: true, message: '请输入确认密码' },
          { min: 6, message: '请输入不少于六位的确认密码' }
        ]
      }
    }
  },
  created() {
    this.ruleForm.adminName = this.managerInfo.real_name
    this.ruleForm.accountName = this.managerInfo.account
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addOrUpdateManager()
        } else {
          return false
        }
      })
    },
    //  新增/编辑管理员账号
    addOrUpdateManager() {
      if (this.ruleForm.password !== this.ruleForm.cofirmpwd) {
        this.$message.error('两次密码输入不一致,请重新输入')
      } else {
        let args = {
          account: this.ruleForm.accountName,
          old_password: this.$sha256(this.ruleForm.oldPwd),
          new_password: this.$sha256(this.ruleForm.cofirmpwd)
        }
        window.$dt.post('/api/back/change-password', args, res => {
          if (res.data.retcode === 1) {
            this.$message.success(res.data.msg.prompt)
          } else {
            this.$message.error(res.data.msg.prompt)
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
