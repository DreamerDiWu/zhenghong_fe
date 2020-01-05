<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 操作对话框 -->
    <el-dialog :visible="decisionDialogVisible" @close="()=>{this.decisionDialogVisible = false}" width="1000px">
      <el-form :model="decisionData">
        <el-form-item prop="reason" label="修改意见">
          <el-input v-model="this.decisionData.reason" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button type="primary" @click="makeDecision">确定</el-button>
        <el-button type="danger" @click="()=>{decisionDialogVisible=false; decisionData.reason=''; currDecision=''; currEventId=''}">取消</el-button>
      </el-form-item>
    </el-dialog>
    <!-- 详情页对话框 -->
    <project-detail-dialog 
      :detailData="detailData" 
      :detailDialogVisible="detailDialogVisible"
      :closeCallBack="()=>{this.detailDialogVisible = false}">
    </project-detail-dialog>
      <!-- 表格 -->
    <el-header height="10px">
      <el-input style="width: 300px" v-model="filterName" placeholder="输入项目名称自动检索"/> 
    </el-header>
    <el-main style="margin-top: 20px">
      <el-divider content-position="left">待我审核的项目</el-divider>
      <el-table empty-text="暂无审核事项" :data="toReviewData.filter(data => !filterName || data.project_name.includes(filterName))" border>
        <el-table-column label="项目名称">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="点击显示详情" placement="right-end">
              <el-button type="text" @click="showDetailDialog(scope.row)">{{scope.row.project_name}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column 
        v-for="(col, index) in tableCols"
         :label="col.label" 
         :key="index"
         :prop="col.prop">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button 
              v-for="(hdl, index) in handler" 
              :key="index"
              :type="hdl.buttonType" 
              @click="()=>{
                this.currEventId = scope.row.event_id;
                this.currDecision = hdl.label;
                this.decisionDialogVisible = true;
              }"
              >
              {{hdl.label}}
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="left">已审核的项目</el-divider>
      <el-table empty-text="暂无数据" :data="reviewedData.filter(data => !filterName || data.project_name.includes(filterName))" border>
        <el-table-column label="项目名称">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="点击显示详情" placement="right-end">
              <el-button type="text" @click="showDetailDialog(scope.row)">{{scope.row.project_name}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column 
        v-for="(col,index) in tableCols"
         :label="col.label" 
         :key="index"
         :prop="col.prop">
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import ProjectForm from '../../components/Form/ProjectForm.vue'
import ProjectDetailDialog from '../../components/Dialog/ProjectDetailDialog.vue'
import { pullReview, updateEvent } from '@/api/user'
import { pull, pull_detail } from '@/api/form'
export default {
  components: {
    ProjectForm,
    ProjectDetailDialog
  },
  mounted() {
    const token = this.$store.getters.token 
    this.pullReview(token)

  },
  data () {
    return {
      // 我的项目展示的列名配置
      toReviewData: [],
      reviewedData: [],
      handler: [
        {label:'通过',buttonType:'success'},
        {label:'驳回',buttonType:'danger'},
      ],
      tableCols:[
        {label:'审核类型',prop:'event_type'},
        {label:'详情', prop:'extra_info'},
        {label: '审核状态', prop: 'status'},
        {label:'项目负责人',prop:'owner_user_name'},
      ],

      // 项目名称模糊查找
      filterName: '',
  
      //详情页对话框
      detailDialogVisible: false,
      detailData: {},

      //决议对话框
      currEventId: '',
      currDecision: '',
      decisionDialogVisible: false,
      decisionData: {
        reason: ''
      }
    }
  },
  methods: {
    showDetailDialog(row) {
      const project_id = row.project_id
      pull_detail({project_id: project_id, get_member_info:true, get_log_info: true}).then(response=>{
        this.detailData = response.data[0]
      })      
      this.detailDialogVisible = true;
    },
    pullReview(token) {
      this.toReviewData = []
      this.reviewedData = []
      pullReview(token).then(response=>{
        response.data.forEach(row=>{
          if(row.status.indexOf('中')!=-1) {
            this.toReviewData.push({event_id: row.event_id, status: row.status, ...row.project_info})
          } else {
            this.reviewedData.push({event_id: row.event_id, status: row.status, ...row.project_info})
          }
        })      
      })
    },
    makeDecision(decision) {
      const token = this.$store.getters.token 
      updateEvent(token, {
        event_id: this.currEventId,
        event_class: 'review', 
        event_type: 'handle',
        status: this.currDecision,
      }).then(()=>{
        this.pullReview(token); 
        this.$store.dispatch('user/getInfo')
      })
    },
  },

}
</script>

<style>

</style>