<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 操作对话框 -->
    <el-dialog 
    :visible="transactDialogVisble" 
    @close="()=>{this.transactDialogVisble = false}" 
    width="500px">
      <el-form>
        <el-form-item prop="transact_reason" label="修改意见">
          <el-input v-model="transactData.reason" type="textarea">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="transact">确定</el-button>
          <el-button type="danger" @click="()=>{
            transactDialogVisble=false; 
            transactData = {reason:''};
            currOrderId=''
          }">取消</el-button>
        </el-form-item>
      </el-form>
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
              @click="handle=>{
                currOrderId = scope.row.order_id;
                currTransactResult = hdl.label;
                transactDialogVisble = true;
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
import { transact_order } from '@/api/order'
import { get_user_project_info, get_project_info } from '@/api/form'
import { get_transact_order } from '@/api/user'
export default {
  components: {
    ProjectForm,
    ProjectDetailDialog
  },
  mounted() {
    const token = this.$store.getters.token 
    this.get_transact_order(token)

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
        {label:'审批类型',prop:'operation_key'},
        {label:'详情', prop:'propose_reason'},
        {label: '审批状态', prop: 'status'},
        {label: '审批结果', prop: 'transact_result'},
        {label:'审批申请人',prop:'proposer'},
      ],

      // 项目名称模糊查找
      filterName: '',
  
      //详情页对话框
      detailDialogVisible: false,
      detailData: {},

      //决议对话框
      currOrderId: '',
      currTransactResult: '',
      transactDialogVisble: false,
      transactData: {
        reason: ''
      }
    }
  },
  methods: {
    showDetailDialog(row) {
      const project_id = row.project_id
      get_project_info({project_id: project_id}).then(response=>{
        this.detailData = response.data[0]
      })      
      this.detailDialogVisible = true;
    },
    get_transact_order(token) {
      this.toReviewData = []
      this.reviewedData = []
      get_transact_order(token).then(response=>{
        
        response.data.forEach(row=>{
          if(row.status == '审批中') {
            this.toReviewData.push(row)
          } else {
            this.reviewedData.push(row)
          }
        })      
      })
    },
    transact() {
      const token = this.$store.getters.token 
      transact_order(token, {
        order_id: this.currOrderId,
        transact_result: this.currTransactResult,
        transact_reason: this.transactData.reason
      }).then(()=>{
        this.get_transact_order(token); 
        this.$store.dispatch('user/getInfo')
        this.transactDialogVisble = false
      })
    },
  },

}
</script>

<style>

</style>