<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 日志对话框 -->
      <el-dialog title="录入日志" :visible.sync="logDialogVisible">
        <el-form>
          <el-form-item>
            <el-date-picker v-model="logTime" value-format="yyyyMMdd" placeholder="请选择日期"/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="logContent"  type="textarea" placeholder="请输入日志内容"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="commitLog">保存</el-button>
            <el-button type="danger" @click="()=>{logDialogVisible=false; logContent=''; logTime=''; currProjectId=''}">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>  
    <!-- 详情页对话框 -->
  <project-detail-dialog 
    :detailData="detailData" 
    :detailDialogVisible="detailDialogVisible"
    :closeCallBack="()=>{this.detailDialogVisible = false}">
  </project-detail-dialog>
    <!-- 修改表单对话框 -->
      <el-dialog title="项目表单编辑" :visible.sync="editDialogVisible" width="1000px">
        <project-form 
        :projectForm="editDialogData" 
        :update="true" 
        :confirmCallBack="retcode=>{
          if(retcode == 0) {
            this.editDialogVisible=false
            this.flushProjectInfo()
          }
        }">
        </project-form>
      </el-dialog>  
      <!-- 表格 -->
    <el-header>
      <el-button icon="el-icon-plus" @click="toNewProject" type="success">创建项目</el-button>
      <el-input style="width: 300px" v-model="filterName" placeholder="输入项目名称自动检索"/> 
    </el-header>
    <el-main>
      <el-table :data="rawtableData.filter(data => !filterName || data.project_name.includes(filterName))" border>
        <el-table-column label="项目名称">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="点击显示详情" placement="right-end">
              <el-button type="text" @click="showDetailDialog(scope.$index)">{{scope.row.project_name}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="项目状态">
          <template slot-scope="scope">
            <project-status-tag :scope=scope></project-status-tag>
          </template>
        </el-table-column>
        <el-table-column v-for="(col,index) in tableCols" :key="index" :label="col.label" :prop="col.prop">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button icon="el-icon-s-tools" type="primary">
                管理
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
                  v-for="(handler,index) in manageHandler" 
                  :key="index"
                  :disabled="handler.disable(scope.row)"
                  @click.native="handler.handle(scope.row)">
                 {{handler.label}}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import ProjectForm from '../../components/Form/ProjectForm.vue'
import ProjectDetailDialog from '../../components/Dialog/ProjectDetailDialog.vue'
import ProjectStatusTag from '../../components/Tag/ProjectStatusTag.vue'
import { get_user_project_info, get_project_info, create_project_log } from '@/api/form'
import { propose_order } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  components: {
    ProjectForm,
    ProjectDetailDialog,
    ProjectStatusTag
  },
  computed: {
  },
  mounted() {
    get_user_project_info(this.$store.getters.token).then(response=>{
      const {data, status} = response
      console.log(response)
      this.rawtableData = data 
      console.log(Object.keys(this.rawtableData[0]))
    })
  },
  data () {
    return {
      // 我的项目展示的列名配置
      rawtableData: [],
      tableCols:[
      ],
      // 项目名称模糊查找
      filterName: '',
      // 录入日志对话框
      logDialogVisible: false,
      logContent: '',
      logTime: '',
      currProjectId: '',

      // 管理选项
      manageHandler: [
        {
          label: '修改', 
          handle: row=>{this.showEditDialog(row)}, 
          disable: row=>{
            let flag = false 
            row.orders.forEach(order => {
              if (order.operation_key=='修改项目信息' && order.status=='审批中') {
                flag = true 
              } 
            });
            return flag  
          }
        },
        {label: '申请一级复核', handle: row=>{this.applyl1Review(row)}, disable: row=>{return row.status!='进行中'}},
        {label: '申请二级复核', handle: row=>{this.applyL2Review(row)}, disable: row=>{return row.status!='一级复核通过'}},
        {label: '申请三级复核', handle: row=>{this.applyL3Review(row)}, disable: row=>{return row.status!='二级复核通过'}},
        {label: '终止', handle: row=>{this.applyStop(row)}, disable: row=>{return false}},
        {label: '录入日志', handle: row=>{ this.currProjectId = row.project_id; this.logDialogVisible = true;}, disable: row=>{return false}}
      ],
      //详情页对话框
      detailDialogVisible: false,
      detailData: {},

      // 修改页对话框
      editDialogVisible: false,
      editDialogData: {}
    }
  },
  methods: {
    toNewProject() {
      this.$router.push({path: '/project/new_project'})
    },
    showDetailDialog(index) {
      const project_id = this.rawtableData[index].project_id
      get_project_info({project_id: project_id}).then(response=>{
        this.detailData = response.data[0]
        console.log("detailData", this.detailData)
      })      
      this.detailDialogVisible = true;
    },
    showEditDialog(row) {
      const project_id = row.project_id
      get_project_info({project_id: project_id, get_log_info: false}).then(response=>{
        this.editDialogData = response.data[0]
      })
      this.editDialogVisible = true;
    },
    applyL1Review(row) {
      const token = getToken()
      propose_order(token, {
        event_class: 'review',
        event_type: '一级审核',
        // transactor: row.${some reviewer} 
        transactor: 'super_user',
        project_id: row.project_id
      })
      pull_detail({project_id: row.project_id, get_member_info:false, get_log_info:false})
    },
    applyL2Review(row) {
      const token = getToken()
      propose_order(token, {
        event_class: 'review',
        event_type: '二级审核',
        // transactor: row.${some reviewer} 
        transactor: 'super_user',
        project_id: row.project_id
      })
      pull_detail({project_id: row.project_id, get_member_info:false, get_log_info:false})
    },
    applyL3Review(row) {
      const token = getToken()
      propose_order(token, {
        event_class: 'review',
        event_type: '三级审核',
        // transactor: row.${some reviewer} 
        transactor: 'super_user',
        project_id: row.project_id
      })
      pull_detail({project_id: row.project_id, get_member_info:false, get_log_info:false})
    },
    commitLog() {
      const token = getToken()
      console.log(this.currProjectId)
      create_project_log(token, {
        project_id: this.currProjectId,
        content: this.logContent,
        create_time: this.logTime,
      }).then(response=>{
        this.logDialogVisible=false;
        this.logContent=''
        this.logTime=''
        this.$message({message:'保存成功', type: 'success'})
      })
    },
    flushProjectInfo() {
      get_user_project_info(this.$store.getters.token).then(response=>{
        const {data, status} = response
        this.rawtableData = data 
      })
    },
  },
}
</script>

<style>

</style>