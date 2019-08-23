<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top: 20px">
      <div class="filter-left">
        <el-button  class="filter-item" type="primary" icon="el-icon-plus" @click="exportRecord">导出</el-button>
      </div>
      <div class="filter-right">
        <el-date-picker
          style="width: 390px"
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="购买时间开始"
          end-placeholder="购买时间结束"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
        <el-select v-model="nper" filterable placeholder="请选择期数" >
          <el-option
            :key="0"
            label="全部期数"
            :value="0">
          </el-option>
          <el-option
            v-for="item in options"
            :key="item.auto_id"
            :label="'第'+item.issue+'期'"
            :value="item.auto_id">
          </el-option>
        </el-select>
        <el-input placeholder="请输入用户名/UID" v-model="keywords" style="width: 200px;" class="filter-item"/>
        <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>

    </div>

    <el-table
      v-loading="listLoading"
      :data="recordList"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px"
    >
      <el-table-column label="期数" width="80px" align="center" prop="issue">
        <template slot-scope="scope">
          第{{scope.row.issue}}期
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center" prop="user_name"></el-table-column>
      <el-table-column label="UID" align="center" prop="user_id"></el-table-column>
      <el-table-column label="购买价格/USDT" align="right" prop="unit_price"></el-table-column>
      <el-table-column label="购买数量/AFT" align="right" prop="buy_aft"></el-table-column>
      <el-table-column label="购买金额/USDT" align="right" prop="pay_usdt"></el-table-column>
      <el-table-column label="购买时间" align="center" prop="create_time"></el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="getRecordList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: "purchase",
  components: { Pagination },
  data() {
    return {
      keywords: '',
      listLoading: true,
      total: 1,
      recordList: [],
      pageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      pageSize: window.$constant.GLOBAL_PAGE_SIZE,
      nper: 0, //  期数
      options: [],
      timeRange: null//  购买时间
    }
  },
  created() {
    this.getNperOptions()
    this.getRecordList()
  },
  methods: {
    //  获取全部期数
    getNperOptions() {
      var that = this
      let args = {
        status: '',
        page_index: 0,
        start_time: '',
        end_time: ''
      }
      window.$dt.post('/api/back/aft-config-list', args, res => {
        that.options = res.data.obj.issue_list
      })
    },
    //  获取抢购记录列表
    getRecordList() {
      let that = this
      let startTime, endTime
      if (!window.$dt.isEmpty(that.timeRange)) {
        startTime = that.timeRange[0]
        endTime = that.timeRange[1]
      } else {
        startTime = ''
        endTime = ''
      }
      let args = {
        start_time: startTime,
        end_time: endTime,
        keywords: that.keywords,
        page_index: that.pageIndex,
        page_size: that.pageSize,
        issue: that.nper,
        user_id: 0
      }
      window.$dt.post('/api/back/buy-record', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.recordList = res.data.obj.record_list
          that.total = res.data.obj.total
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //   导出抢购记录
    exportRecord() {
      let startTime, endTime
      if (!window.$dt.isEmpty(this.timeRange)) {
        startTime = this.timeRange[0]
        endTime = this.timeRange[1]
      } else {
        startTime = ''
        endTime = ''
      }
      location.href = window.$constant.BASE_URL + '/api/back/export-buy-record?start_time=' + startTime +
        '&end_time=' + endTime +
        '&keywords=' + this.keywords +
        '&issue=' + this.nper +
        '&user_id=0' +
        '&page_index=0'
    },
    //  搜索列表
    search() {
      this.pageIndex = 1
      this.getRecordList()
    }
  }
}
</script>

<style scoped>

</style>
