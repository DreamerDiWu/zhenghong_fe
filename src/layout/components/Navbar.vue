<template>
  <div class="navbar">
    <!-- 详情页对话框 -->
    <project-detail-dialog 
      :detailData="detailData" 
      :detailDialogVisible="detailDialogVisible"
      :closeCallBack="()=>{this.detailDialogVisible = false}">
    </project-detail-dialog>
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">     
      <el-badge :value="review_event.length" :hidden="review_event.length==0" class="review" style="margin-right:15px">
        <el-popover
          placement="right"
          width="400"
          trigger="click">
          <el-table :data="review_event" max-height="300px">
            <el-table-column label="待审核事项">
              <template slot-scope="scope">
                <el-card shadow="hover" style="width:100%">
                  <div slot="header" class="clearfix">
                    <el-tag type="warning" v-if="scope.row.status=='applying'">{{scope.row.status}}</el-tag>
                    <el-tag type="success" v-if="scope.row.status=='read'">{{scope.row.status}}</el-tag>
                    <span style="float:right">{{scope.row.create_time}}</span>
                  </div>
                  <span>{{scope.row.extra_info}}</span>
                  <el-button type="text" style="float:right" @click="toReview">点这里去审核</el-button>
                </el-card>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="mini" slot="reference" @click="pollMessage">审核</el-button>
        </el-popover> 
      </el-badge>
     <el-badge :value="notReadNumber" :hidden="notReadNumber==0" class="message" style="margin-right:15px">
        <el-popover
          placement="right"
          width="400"
          trigger="click"
          @hide="handleRead">
          <el-table :data="message" max-height="300px">
            <el-table-column label="消息通知">
              <template slot-scope="scope">
                <el-card shadow="hover" style="width:100%">
                  <div slot="header" class="clearfix">
                    <el-tag type="warning" v-if="scope.row.status=='not_read'">{{scope.row.status}}</el-tag>
                    <el-tag type="success" v-if="scope.row.status=='read'">{{scope.row.status}}</el-tag>
                    <span style="float:right">{{scope.row.create_time}}</span>
                  </div>
                  <span>{{scope.row.extra_info}}</span>
                  <el-button type="text" style="float:right" @click="showDetailDialog(scope.row)">点这里查看详情</el-button>
                </el-card>
              </template>
            </el-table-column>
          </el-table>
          <el-button size="mini" slot="reference" @click="pollMessage">通知</el-button>
        </el-popover> 
      </el-badge>
      <el-dropdown class="avatar-container" trigger="click">
        <el-button type="text">{{ avatar }}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              主页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ProjectDetailDialog from '../../components/Dialog/ProjectDetailDialog.vue'
import { pull, pull_detail } from '@/api/form'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ProjectDetailDialog
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'message',
      'notReadNumber',
      'review_event'
    ]),
  },
  data() {
    return {
            //详情页对话框
      detailDialogVisible: false,
      detailData: {},
    }
  },
  methods: {
    showDetailDialog(row) {
      console.log(row)
      const project_id = row.project_id
      pull_detail({project_id: project_id, get_member_info:true, get_log_info: true}).then(response=>{
        this.detailData = response.data[0]
      })      
      this.detailDialogVisible = true;
    },
    toReview() {
      this.$router.push('/review/index')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleRead() {
      this.$store.dispatch('user/handleRead')
    },
    pollMessage() {
      this.$store.dispatch('user/getInfo')
      console.log(this.$store.getters.review_event)
    },

  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 0px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
