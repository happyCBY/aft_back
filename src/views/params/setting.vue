<template>
  <div class="app-container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="280px" class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="AFT出币账号：" prop="account" label-width="180px">
              <el-input v-model="ruleForm.account" style="width:250px" maxlength="25" placeholder="请输入AFT出币账号"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每人总（所有期数）累计限购量/AFT：" prop="limit">
              <el-input v-model="ruleForm.limit" style="width:250px" placeholder="请输入每人总（所有期数）累计限购量"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="一级用户佣金比例/%：" prop="firstLevelPer" label-width="180px">
              <el-input v-model="ruleForm.firstLevelPer" style="width:250px" maxlength="25" placeholder="请输入一级用户佣金比例"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级用户佣金比例/%：" prop="secondLevelPer">
              <el-input v-model="ruleForm.secondLevelPer" style="width:250px" placeholder="请输入二级用户佣金比例"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="解锁比例/%：" prop="percent" label-width="180px">
              <el-input v-model="ruleForm.percent" style="width:250px" placeholder="请输入解锁比例"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="募集抢购规则：" prop="purchaseRules" required label-width="180px">
          <div id="purchaseRules" data-sample-short>
          </div>
        </el-form-item>
        <el-form-item label="邀请奖励规则：" prop="rewardRules" required label-width="180px">
          <div id="rewardRules" data-sample-short>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
var ckeditorPurchase, ckeditorReward
export default {
  name: 'setting',
  data() {
    return {
      ruleForm: {
        account: '',
        percent: '',
        firstLevelPer: '',
        secondLevelPer: '',
        purchaseRules: '',
        rewardRules: '',
        limit: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入AFT出币账号' }
        ],
        limit: [
          { required: true, message: '请输入每人总（所有期数）累计限购量' },
          { validator: function(rule, value, callback) {
            if (/^([1-9]\d*)?$/.test(value) == false) {
              callback(new Error('数量只能输入正整数'))
            } else {
              callback()
            }
          }
          }
        ],
        percent: [
          { required: true, message: '请输入解锁比例' },
          { validator: function(rule, value, callback) {
            if (/^([1-9]\d*|0)(\.\d{1,4})?$/.test(value) == false) {
              callback(new Error('解锁比例只能输入数字，最多保留4位小数'))
            } else {
              callback()
            }
          }
          }
        ],
        firstLevelPer: [
          { required: true, message: '请输入一级用户佣金比例' },
          { validator: function(rule, value, callback) {
            if (/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value) == false) {
              callback(new Error('佣金比例只能输入数字，最多保留2位小数'))
            } else {
              callback()
            }
          }
          }
        ],
        secondLevelPer: [
          { required: true, message: '请输入二级用户佣金比例' },
          { validator: function(rule, value, callback) {
            if (/^([1-9]\d*|0)(\.\d{1,2})?$/.test(value) == false) {
              callback(new Error('佣金比例只能输入数字，最多保留2位小数'))
            } else {
              callback()
            }
          }
          }
        ],
        purchaseRules: [
          { required: true, message: '请输入募集抢购规则' }
        ],
        rewardRules: [
          { required: true, message: '请输入邀请奖励规则' }
        ]
      }
    }
  },
  mounted() {
    this.getConfig()
  },
  methods: {
    //  初始化编辑器
    editorInitialize() {
      const that = this
      ckeditorPurchase = CKEDITOR.replace('purchaseRules', {
        filebrowserImageUploadUrl: '/api/back/upload'
      })
      ckeditorReward = CKEDITOR.replace('rewardRules', {
        filebrowserImageUploadUrl: '/api/back/upload'
      })
      ckeditorPurchase.on('change', function() {
        that.ruleForm.purchaseRules = ckeditorPurchase.getData()
      })
      ckeditorReward.on('change', function() {
        that.ruleForm.rewardRules = ckeditorReward.getData()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updateConfig()
        } else {
          return false
        }
      })
    },
    //  获取参数信息
    getConfig() {
      window.$dt.post('/api/back/get-system-config', {}, res => {
        if (res.data.retcode === 1) {
          this.ruleForm = {
            account: res.data.obj.account,
            limit: res.data.obj.limit_purchase,
            firstLevelPer: res.data.obj.first_commission,
            secondLevelPer: res.data.obj.second_commission,
            percent: res.data.obj.unlock_proportion,
            purchaseRules: res.data.obj.purchase_rule,
            rewardRules: res.data.obj.reward_rule
          }
          this.editorInitialize()
          ckeditorPurchase.setData(this.ruleForm.purchaseRules)
          ckeditorReward.setData(this.ruleForm.rewardRules)
        } else {
          this.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  编辑参数
    updateConfig() {
      let args = {
        account: this.ruleForm.account,
        limit_purchase: this.ruleForm.limit,
        unlock_proportion: this.ruleForm.percent,
        first_commission: this.ruleForm.firstLevelPer,
        second_commission: this.ruleForm.secondLevelPer,
        purchase_rule: this.ruleForm.purchaseRules,
        reward_rule: this.ruleForm.rewardRules
      }
      window.$dt.post('/api/back/update-system-config', args, res => {
        if (res.data.retcode === 1) {
          this.$message.success(res.data.msg.prompt)
          this.getConfig()
        } else {
          this.$message.error(res.data.msg.prompt)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
