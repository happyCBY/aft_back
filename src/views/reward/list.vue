<template>
  <div class="app-container">
    <div class="filter-container" style="margin-top: 20px">
      <div class="filter-left"></div>
      <div class="filter-right">
        <el-input placeholder="请输入用户名/UID" v-model="keywords" style="width: 200px;" class="filter-item"/>
        <el-button  class="filter-item" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
    </div>
    <el-table
      v-loading="listLoading"
      :data="rewardList"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px"
    >
      <el-table-column label="用户名"  align="center" prop="user_name"></el-table-column>
      <el-table-column label="UID"  align="center" prop="user_id"></el-table-column>
      <el-table-column label="累计邀请人数/人" align="center" prop="invite_num"></el-table-column>
      <el-table-column label="累计奖励金额/USDT" align="right" prop="sum_rake_back"></el-table-column>
      <el-table-column label="排名" align="center" prop="rank">
        <template slot-scope="scope">
          第{{scope.row.rank}}名
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="goToDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="getRewardList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
export default {
  name: "reward-list",
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      total: 1,
      rewardList: [],
      pageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      pageSize: window.$constant.GLOBAL_PAGE_SIZE,
      keywords: ''
    }
  },
  created() {
    this.getRewardList()
  },
  methods: {
    //  获取用户奖励记录列表
    getRewardList() {
      var that = this
      that.listLoading = true
      var args = {
        keywords: that.keywords,
        page_index: that.pageIndex,
        page_size: that.pageSize
      }
      window.$dt.post('/api/back/rake-back-rank', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.rewardList = res.data.obj.rank_list
          that.total = res.data.obj.total
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  搜索列表
    search() {
      this.pageIndex = 1
      this.getRewardList()
    },
    goToDetail(item) {
      this.$router.push({ path: '/reward/detail', query: { id: item.user_id }})
    }
  }
}
</script>

<style scoped>

</style>
