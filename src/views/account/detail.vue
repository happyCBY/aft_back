<template>
  <div class="app-container" style="padding: 30px">
    <el-row>
      <el-col :span="4" class="detail-item-title">用户名：</el-col>
      <el-col :span="8" class="detail-item-content">{{detailObj.user_name|noDataFilter}}</el-col>
      <el-col :span="4" class="detail-item-title">UID：</el-col>
      <el-col :span="8" class="detail-item-content">{{detailObj.user_id|noDataFilter}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="detail-item-title">累计邀请人数/人：</el-col>
      <el-col :span="8" class="detail-item-content">{{detailObj.total_invite_count|noDataFilter}}</el-col>
      <el-col :span="4" class="detail-item-title">累计花费/USDT：</el-col>
      <el-col :span="8" class="detail-item-content">{{detailObj.sum_pay_usdt|noDataFilter}}</el-col>
    </el-row>
    <el-row>
      <el-col :span="4" class="detail-item-title">累计解锁数量/AFT：</el-col>
      <el-col :span="8" class="detail-item-content">{{detailObj.sum_unlock_aft|noDataFilter}}</el-col>
      <el-col :span="4" class="detail-item-title">累计购买数量/AFT：</el-col>
      <el-col :span="8" class="detail-item-content">{{detailObj.sum_lock_aft|noDataFilter}}</el-col>
    </el-row>
    <el-tabs type="border-card" v-model="activeName" style="margin-top:20px">
      <el-tab-pane label="一级邀请用户" name="record">
        <div class="filter-container" style="margin-top: 20px">
          <div class="filter-left">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="exportUser(1)">导出</el-button>
            <span>&nbsp;&nbsp;一级邀请人数/人：{{detailObj.direct_invite_count}}</span>
          </div>
          <div class="filter-right">
            <el-input placeholder="请输入用户名/UID" v-model="firstKeywords" style="width: 200px;" class="filter-item"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search(1)">搜索</el-button>
          </div>
        </div>
        <el-table
          v-loading="listLoading"
          :data="firstLevelUserList"
          border
          fit
          highlight-current-row
          style="width: 100%;margin-top: 20px"
        >
          <el-table-column label="用户名" align="center" prop="user_name"></el-table-column>
          <el-table-column label="UID" align="center" prop="user_id"></el-table-column>
          <el-table-column label="累计购买金额/USDT" align="right" prop="sum_pay"></el-table-column>
          <el-table-column label="邀请人数/人" align="center" prop="total_invite_count"></el-table-column>
          <el-table-column label="邀请时间" align="center" prop="invite_time">
            <template slot-scope="scope">
              {{scope.row.invite_time|noDataFilter}}
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="firstLevelTotal>0" :total="firstLevelTotal" :page.sync="firstLevelPageIndex" :limit.sync="firstLevelPageSize" @pagination="getFirstLevelUser" />
      </el-tab-pane>
      <el-tab-pane label="二级邀请用户" name="first">
        <div class="filter-container" style="margin-top: 20px">
          <div class="filter-left">
            <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="exportUser(2)">导出</el-button>
            <span>&nbsp;&nbsp;二级邀请人数/人：{{detailObj.second_invite_count}}</span>
          </div>
          <div class="filter-right">
            <el-select v-model="superior" filterable placeholder="请选择所属上级用户" >
              <el-option
                key=""
                label="全部上级用户"
                value="">
              </el-option>
              <el-option
                v-for="item in options"
                :key="item.user_id"
                :label="item.user_name"
                :value="item.user_name">
              </el-option>
            </el-select>
            <el-input placeholder="请输入用户名/UID" v-model="secondKeywords" style="width: 200px;" class="filter-item"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="search(2)">搜索</el-button>
          </div>
        </div>
        <el-table
          v-loading="listLoading"
          :data="secondLevelUserList"
          border
          fit
          highlight-current-row
          style="width: 100%;margin-top: 20px"
        >
          <el-table-column label="用户名" align="center" prop="user_name"></el-table-column>
          <el-table-column label="UID" align="center" prop="user_id"></el-table-column>
          <el-table-column label="累计购买金额/USDT" align="right" prop="sum_pay"></el-table-column>
          <el-table-column label="所属上级用户" prop="invite_user_name"></el-table-column>
          <el-table-column label="邀请时间" align="center" prop="invite_time"></el-table-column>
        </el-table>
        <pagination v-show="secondLevelTotal>0" :total="secondLevelTotal" :page.sync="secondLevelPageIndex" :limit.sync="secondLevelPageSize" @pagination="getSecondLevelUser" />
      </el-tab-pane>
      <el-tab-pane label="历史抢购" name="purchase">
        <el-table
          v-loading="listLoading"
          :data="purchaseList"
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
          <el-table-column label="购买价格/USDT" align="right" prop="unit_price"></el-table-column>
          <el-table-column label="购买数量/AFT" align="right" prop="buy_aft"></el-table-column>
          <el-table-column label="购买金额/USDT" align="right" prop="pay_usdt"></el-table-column>
          <el-table-column label="抢购时间" align="center" prop="create_time"></el-table-column>
        </el-table>
        <pagination v-show="purchaseTotal>0" :total="purchaseTotal" :page.sync="purchasePageIndex" :limit.sync="purchasePageSize" @pagination="getHistoryPurchase" />
      </el-tab-pane>
      <el-tab-pane label="历史解锁" name="unlock">
        <el-table
          v-loading="listLoading"
          :data="unlockList"
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
          <el-table-column label="币种" align="center" prop="orderPrice">AFT</el-table-column>
          <el-table-column label="解锁数量/AFT" align="right" prop="unlock_aft"></el-table-column>
          <el-table-column label="锁仓数量/AFT" align="right" prop="total_locked"></el-table-column>
          <el-table-column label="解锁时间" align="center" prop="create_time"></el-table-column>
        </el-table>
        <pagination v-show="unlockTotal>0" :total="unlockTotal" :page.sync="unlockPageIndex" :limit.sync="unlockPageSize" @pagination="getHistoryUnlock" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: "account-detail",
  components: { Pagination },
  data() {
    return {
      detailObj: {},
      listLoading: false,
      rewardList: [],
      purchasePageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      purchasePageSize: window.$constant.GLOBAL_PAGE_SIZE,
      purchaseTotal: 1,
      activeName: 'record', //  默认选中一级邀请用户
      purchaseList: [],
      unlockList: [],
      unlockPageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      unlockPageSize: window.$constant.GLOBAL_PAGE_SIZE,
      unlockTotal: 1,
      firstKeywords: '',
      secondKeywords: '',
      superior: '', //  上级用户
      firstLevelUserList: [],
      firstLevelPageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      firstLevelPageSize: window.$constant.GLOBAL_PAGE_SIZE,
      firstLevelTotal: 1,
      secondLevelUserList: [],
      secondLevelPageIndex: window.$constant.GLOBAL_PAGE_INDEX,
      secondLevelPageSize: window.$constant.GLOBAL_PAGE_SIZE,
      secondLevelTotal: 1,
      options: []
    }
  },
  created() {
    this.activeName = this.$route.query.type || 'record'
    this.getAllFirstLevelUser()
    this.getUserDetail()
    this.getFirstLevelUser()
    this.getSecondLevelUser()
    this.getHistoryPurchase()
    this.getHistoryUnlock()
  },
  methods: {
    //  获取用户详情
    getUserDetail() {
      var that = this
      var args = {
        user_id: that.$route.query.id
      }
      window.$dt.post('/api/back/user-info', args, res => {
        if (res.data.retcode === 1) {
          that.detailObj = res.data.obj
        } else {
          that.$message.error(res.data.msg.prompt)
        }
      })
    },
    //  获取一级邀请用户
    getFirstLevelUser() {
      var that = this
      that.listLoading = true
      var args = {
        user_id: that.$route.query.id,
        keywords: that.firstKeywords,
        page_index: that.firstLevelPageIndex,
        page_size: that.firstLevelPageSize
      }
      window.$dt.post('/api/back/invite-list', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.firstLevelUserList = res.data.obj.invite_list
          that.firstLevelTotal = res.data.obj.total
        }
      })
    },
    //  获取所有一级邀请用户
    getAllFirstLevelUser() {
      var that = this
      var args = {
        user_id: that.$route.query.id,
        keywords: that.firstKeywords,
        page_index: 0
      }
      window.$dt.post('/api/back/invite-list', args, res => {
        if (res.data.retcode === 1) {
          that.options = res.data.obj.invite_list
        }
      })
    },
    //  获取二级邀请用户
    getSecondLevelUser() {
      var that = this
      that.listLoading = true
      var args = {
        user_id: that.$route.query.id,
        keywords: that.secondKeywords,
        invite_user_name: that.superior,
        page_index: that.secondLevelPageIndex,
        page_size: that.secondLevelPageSize
      }
      window.$dt.post('/api/back/second-invite-list', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.secondLevelUserList = res.data.obj.invite_list
          that.secondLevelTotal = res.data.obj.total
        }
      })
    },
    //  获取历史抢购
    getHistoryPurchase() {
      var that = this
      that.listLoading = true
      var args = {
        user_id: that.$route.query.id,
        page_index: that.purchasePageIndex,
        page_size: that.purchasePageSize
      }
      window.$dt.post('/api/back/buy-record', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.purchaseList = res.data.obj.record_list
          that.purchaseTotal = res.data.obj.total
        }
      })
    },
    //  获取历史每期解锁
    getHistoryUnlock() {
      var that = this
      that.listLoading = true
      var args = {
        user_id: that.$route.query.id,
        page_index: that.unlockPageIndex,
        page_size: that.unlockPageSize
      }
      window.$dt.post('/api/back/unlock-record', args, res => {
        that.listLoading = false
        if (res.data.retcode === 1) {
          that.unlockList = res.data.obj.record_list
          that.unlockTotal = res.data.obj.total
        }
      })
    },
    exportUser(type) {
      //  1是导出一级邀请用户 2是导出二级邀请用户
      if (type === 1) {
        location.href = window.$constant.BASE_URL + '/api/back/export-invite-list?keywords=' + this.firstKeywords + '&user_id=' + this.$route.query.id + '&page_index=0'
      } else {
        location.href = window.$constant.BASE_URL + '/api/back/export-second-invite-list?keywords=' + this.secondKeywords + '&invite_user_name=' + this.superior + '&user_id=' + this.$route.query.id + '&page_index=0'
      }
    },
    //  搜索列表
    search(type) {
      //  1是一级邀请用户 2是二级邀请用户
      if (type === 1) {
        this.firstLevelPageIndex = 1
        this.getFirstLevelUser()
      } else {
        this.secondLevelPageIndex = 1
        this.getSecondLevelUser()
      }
    }
  }
}
</script>

<style scoped>
  .detail-item-title, .detail-item-content {
    line-height: 40px;
    color: #333;
  }

  .detail-item-content {
    word-break: break-all;
  }
</style>
