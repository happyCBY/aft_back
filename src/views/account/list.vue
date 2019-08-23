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
      :data="userList"
      border
      fit
      highlight-current-row
      style="width: 100%;margin-top: 20px"
    >
      <el-table-column label="用户名" align="center" prop="user_name"></el-table-column>
      <el-table-column label="UID" align="center" prop="user_id"></el-table-column>
      <el-table-column label="累计锁仓金额/AFT" align="right" prop="sum_lock_aft"></el-table-column>
      <el-table-column label="累计解锁金额/AFT" align="right" prop="sum_unlock_aft"></el-table-column>
      <el-table-column label="累计邀请人数/人" align="center" prop="total_invite_count"></el-table-column>
      <el-table-column label="一级邀请人数/人" align="center" prop="direct_invite_count"></el-table-column>
      <el-table-column label="二级邀请人数/人" align="center" prop="second_invite_count"></el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="default" size="mini" @click="goToDetail(scope.row,'record')">邀请记录</el-button>
          <el-button type="primary" size="mini" @click="goToDetail(scope.row,'purchase')">历史抢购</el-button>
          <el-button type="warning" size="mini" @click="goToDetail(scope.row,'unlock')">历史解锁</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="getUserList" />
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
      userList: [],
      pageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      pageSize: window.$constant.GLOBAL_PAGE_SIZE,
      keywords: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    //  获取用户列表
    getUserList() {
      var that = this
      that.listLoading = true
      var args = {
        keywords: that.keywords,
        page_index: that.pageIndex,
        page_size: that.pageSize
      }
      window.$dt.post('/api/back/user-list', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.userList = res.data.obj.user_list
          that.total = res.data.obj.total
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  搜索列表
    search() {
      this.pageIndex = 1
      this.getUserList()
    },
    goToDetail(item, type) {
      this.$router.push({ path: '/account/detail', query: { id: item.user_id, type: type }})
    }
  }
}
</script>

<style scoped>

</style>
