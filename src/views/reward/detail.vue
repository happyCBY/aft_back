<template>
  <div class="app-container" style="padding: 30px">
    <el-row>
      <el-col :span="3" class="detail-item-title">用户名：</el-col>
      <el-col :span="5" class="detail-item-content">{{detailObj.user_name|noDataFilter}}</el-col>
      <el-col :span="3" class="detail-item-title">UID：</el-col>
      <el-col :span="5" class="detail-item-content">{{detailObj.user_id|noDataFilter}}</el-col>
      <el-col :span="3" class="detail-item-title">排名：</el-col>
      <el-col :span="5" class="detail-item-content">第{{detailObj.rank|noDataFilter}}名</el-col>
    </el-row>
    <el-row>
      <el-col :span="3" class="detail-item-title">累计邀请人数：</el-col>
      <el-col :span="5" class="detail-item-content">{{detailObj.invite_num|noDataFilter}}人</el-col>
      <el-col :span="3" class="detail-item-title">累计奖励金额：</el-col>
      <el-col :span="5" class="detail-item-content">{{detailObj.get_usdt|noDataFilter}}USDT</el-col>
    </el-row>
    <div class="detail-title">历史每期奖励</div>
    <el-table
      v-loading="listLoading"
      :data="rewardList"
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
      <el-table-column label="邀请人数/人" align="center" prop="invite_num"></el-table-column>
      <el-table-column label="奖励金额/USDT" align="right" prop="sum_rake_back"></el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="pageIndex" :limit.sync="pageSize" @pagination="getRewardById" />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: "reward-detail",
  components: { Pagination },
  data() {
    return {
      detailObj: {},
      listLoading: false,
      rewardList: [],
      pageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      pageSize: window.$constant.GLOBAL_PAGE_SIZE,
      total: 1
    }
  },
  created() {
    this.getRewardDetail()
    this.getRewardById()
  },
  methods: {
    //  获取奖励详情
    getRewardDetail() {
      var that = this
      var args = {
        user_id: that.$route.query.id
      }
      window.$dt.post('/api/back/rake-back-detail', args, res => {
        if (res.data.retcode === 1) {
          that.detailObj = res.data.obj
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  获取每期
    getRewardById() {
      var that = this
      that.listLoading = true
      var args = {
        user_id: that.$route.query.id,
        page_index: that.pageIndex,
        page_size: that.pageSize
      }
      window.$dt.post('/api/back/issue-rake-back-rank', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.rewardList = res.data.obj.rake_back_record
          that.total = res.data.obj.total
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    }
  }
}
</script>

<style scoped>
  .member-main-info, .order-main-info, {
    padding: 20px;
  }

  .detail-title {
    font-size: 20px;
    font-weight: bold;
    padding: 10px 0;
  }

  .common-divider {
    height: 1px;
    width: 98%;
    margin-left: 1%;
    background: #eeeeee;
  }

  .detail-item-title, .detail-item-content {
    line-height: 40px;
    color: #333;
  }

  .detail-item-content {
    word-break: break-all;
  }
</style>
