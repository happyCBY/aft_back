<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top: 20px">
      <div class="filter-left">
        <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="goToDetail('add')">添加</el-button>
      </div>
      <div class="filter-right">
        <el-date-picker
          style="width: 390px"
          v-model="timeRange"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
        >
        </el-date-picker>
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>

    </div>

    <el-table
      v-loading="listLoading"
      :data="settingList"
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
      <el-table-column label="募集AFT" align="right" prop="aft_raise"></el-table-column>
      <el-table-column label="抢购价格/USDT" align="right" prop="unit_price"></el-table-column>
      <el-table-column label="单期每人限购量/AFT" align="right" prop="limit_purchase"></el-table-column>
      <el-table-column label="开始时间" align="center" prop="start_time"></el-table-column>
      <el-table-column label="结束时间" align="center" prop="end_time"></el-table-column>
      <el-table-column label="状态" width="80px" align="center" prop="status">
        <template slot-scope="scope">
          {{scope.row.status |enumFormat(statusFilter)}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goToDetail('edit',scope.row)">详情</el-button>
          <el-button size="mini" type="warning" @click="goToClose(scope.row)" v-if="scope.row.status===1">
            关闭
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total"  :page.sync="pageIndex" :limit.sync="pageSize" @pagination="getSettingList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: "setting-list",
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      total: 1,
      settingList: [],
      pageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      pageSize: window.$constant.GLOBAL_PAGE_SIZE,
      operatorId: null,
      status: '',
      options: window.$constant.SETTING_STATUS_OPTIONS,
      timeRange: null,
      statusFilter: window.$constant.SETTING_STATUS
    }
  },
  created() {
    this.getSettingList()
  },
  methods: {
    //  获取期数列表
    getSettingList() {
      var that = this
      let startTime, endTime
      if (!window.$dt.isEmpty(this.timeRange)) {
        startTime = this.timeRange[0]
        endTime = this.timeRange[1]
      } else {
        startTime = ''
        endTime = ''
      }
      that.listLoading = true
      var args = {
        page_index: that.pageIndex,
        page_size: that.pageSize,
        status: that.status,
        start_time: startTime,
        end_time: endTime
      }
      window.$dt.post('/api/back/aft-config-list', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.settingList = res.data.obj.issue_list
          that.total = res.data.obj.total
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  二次确认关闭期数
    goToClose(item) {
      this.$confirm('确定要将该期数关闭, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.closeNper(item)//  确认删除后调用删除接口
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    //  关闭期数
    closeNper(item) {
      var that = this
      var args = {
        auto_id: item.auto_id,
        status: -1
      }
      window.$dt.post('/api/back/update-aft-status', args, res => {
        if (res.data.retcode === 1) {
          that.$message.success(res.data.msg.prompt)
          that.getSettingList()//  关闭后刷新数据
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  搜索列表
    search() {
      this.pageIndex = 1
      this.getSettingList()
    },
    goToDetail(type, data) {
      if (data) {
        this.$router.push({ path: '/setting/detail', query: { type: type, id: data.auto_id }})
      } else {
        this.$router.push({ path: '/setting/detail', query: { type: type }})
      }
    }
  }
}
</script>

<style scoped>

</style>
