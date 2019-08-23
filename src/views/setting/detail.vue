<template>
  <div class="app-container">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="180px" style="margin-top: 20px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="期数：">
            <el-input v-model="'第'+ruleForm.nper+'期' " style="width:250px" disabled/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="募集AFT：" prop="raise">
            <el-input v-model="ruleForm.raise" style="width:250px" placeholder="请输入募集AFT"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-model="ruleForm.status">
              <el-radio :label="1">已开启</el-radio>
              <el-radio :label="-1">已关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="单期每人限购量/AFT：" prop="limit">
            <el-input v-model="ruleForm.limit" style="width:250px" placeholder="请输入每人每期限购数"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="抢购价格/USDT：" prop="price">
            <el-input v-model="ruleForm.price" style="width:250px" placeholder="请输入抢购价格"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="起止时间：" prop="timeRange">
            <el-date-picker
              style="width: 390px"
              v-model="ruleForm.timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" v-if="status==null||status==0">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "setting-detail",
  data() {
    return {
      type: '', //  操作类型
      ruleForm: {
        nper: null,
        raise: '',
        status: 1,
        limit: '',
        price: '',
        timeRange: null
      },
      rules: {
        raise: [
          { required: true, message: '请输入募集AFT', trigger: 'blur' },
          { validator: function(rule, value, callback) {
            if (/^([1-9]\d*)?$/.test(value) == false) {
              callback(new Error('募集AFT只能输入正整数'))
            } else {
              callback()
            }
          }
          }
        ],
        limit: [
          { required: true, message: '请输入单期每人限购量' },
          { validator: function(rule, value, callback) {
            if (/^([1-9]\d*)?$/.test(value) == false) {
              callback(new Error('限购量只能输入正整数'))
            } else {
              callback()
            }
          }
          }
        ],
        price: [
          { required: true, message: '请输入抢购价格', trigger: 'blur' },
          { validator: function(rule, value, callback) {
            if (/^([1-9]\d*|0)(\.\d{1,4})?$/.test(value) == false) {
              callback(new Error('抢购价格只能输入数字，最多保留4位小数'))
            } else {
              callback()
            }
          }
          }
        ],
        timeRange: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ]
      },
      status: null
    }
  },
  created() {
    this.type = this.$route.query.type
    if (this.type === 'edit') {
      this.getSettingDetail()
    } else {
      this.getLatestId()
    }
  },
  methods: {
    //  获取最新期数
    getLatestId() {
      var that = this
      window.$dt.post('/api/back/get-newest-issue', {}, res => {
        if (res.data.retcode === 1) {
          that.ruleForm.nper = res.data.obj.issue
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  新增编辑期数详情
    addOrUpdateNews() {
      var that = this
      let startTime, endTime
      if (!window.$dt.isEmpty(this.ruleForm.timeRange)) {
        startTime = this.ruleForm.timeRange[0]
        endTime = this.ruleForm.timeRange[1]
      } else {
        startTime = ''
        endTime = ''
      }
      var args = {
        auto_id: this.$route.query.id,
        issue: this.ruleForm.nper,
        aft_raise: this.ruleForm.raise,
        unit_price: this.ruleForm.price,
        limit_purchase: this.ruleForm.limit,
        start_time: startTime,
        end_time: endTime,
        status: this.ruleForm.status
      }
      window.$dt.post('/api/back/upsert-aft-config', args, res => {
        if (res.data.retcode === 1) {
          that.$message.success(res.data.msg.prompt)
          that.$router.go(-1)
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  期数详情
    getSettingDetail() {
      var that = this
      var args = {
        auto_id: that.$route.query.id
      }
      window.$dt.post('/api/back/aft-config-detail', args, res => {
        if (res.data.retcode === 1) {
          that.ruleForm = {
            nper: res.data.obj.issue,
            raise: res.data.obj.aft_raise,
            status: res.data.obj.status,
            limit: res.data.obj.limit_purchase,
            price: res.data.obj.unit_price,
            timeRange: [res.data.obj.start_time, res.data.obj.end_time]
          }
          that.status = res.data.obj.status
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  表单验证，通过后提交新闻详情
    onSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addOrUpdateNews()
        } else {
          return false
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.type === 'add') {
      to.meta.title = '添加'
    } else {
      to.meta.title = '编辑'
    }
    next()
  }
}
</script>

<style scoped>

</style>
