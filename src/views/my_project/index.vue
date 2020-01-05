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
        <project-form :projectForm="editDialogData" :update="true" :confirmCallBack="retcode=>{this.editDialogVisible=(retcode == 0 ? false: true)}">
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
        <el-table-column label="项目进展">
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="400"
              trigger="hover">
              <el-timeline style="height:200px; width:400px; overflow:auto">
                <el-timeline-item
                  v-for="(event, index) in scope.row.events"
                  :key="index"
                  :timestamp="event.modify_time">
                  {{event.status}}
                </el-timeline-item>
              </el-timeline>
              <el-tag type="success" slot="reference">{{scope.row.status}}</el-tag>
            </el-popover>
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
import { pull, pull_detail, update } from '@/api/form'
import { updateEvent } from '@/api/user'
import { getToken } from '@/utils/auth'

export default {
  components: {
    ProjectForm,
    ProjectDetailDialog
  },
  computed: {
  },
  mounted() {
    console.log("this.$store.getters.token=", this.$store.getters.token)
    pull(this.$store.getters.token).then(response=>{
      const {data, status} = response
      console.log(response)
      this.rawtableData = data 
      console.log(Object.keys(this.rawtableData[0]))
    })
  },
  data () {
    return {
      
// 模拟数据
// 我的项目表格
      // rawtableData:[
      //   {
      //     name:'项目1',
      //     depart: '审计' ,
      //     busz_type: '经责',
      //     status:'实施中',
      //     owner:'包大人', 
      //     myRole: '项目负责人', 
      //     paid:'未收款', 
      //     date: '2019-09-01 19:00:00',
      //     start_date: '2019-10-01',
      //     processing_dur: ['2019-11-01', '2019-11-03'],
      //     review_dur:  ['2019-11-01', '2019-11-03'],
      //     finish_date: '2020-01-01',
      //     memberConfigData: [{
      //         role: '项目负责人',
      //         name: '包大人',
      //         salary: '1.0',
      //         job: '',
      //         }, {
      //         role: '项目经理',
      //         name: '王小虎',
      //         salary: '0.7',
      //         job: '',
      //         }, {
      //         role: '助理人员',
      //         name: '王大虎',
      //         salary: '0.5',
      //         job: '', 
      //       }],
      //       logs: [
      //       {
      //         date: '20191106',
      //         name: '王小虎',
      //         content: '今天送材料'
      //       }, 
      //       {
      //         date: '20191105',
      //         name: '包大人',
      //         content: '今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料'
      //       }]
      //   },
      //   {name:'项目2',status:'复核中',owner:'张龙', myRole: '实习生',paid:'已收款'},
      //   {name:'项目1',status:'已完成',owner:'赵虎', myRole: '项目经理',paid:'已收款'},
      // ],
      // 我的项目展示的列名配置
      rawtableData: [],
      tableCols:[
        {label:'项目负责人',prop:'owner_user_name'},
        {label: '我的角色', prop: 'myRole'},
        {label:'是否收到款项',prop:'paid'},
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
        {label: '修改', handle: row=>{this.showEditDialog(row)}},
        {label: '申请一级复核', handle: row=>{this.applyl1Review(row)}, disable: row=>{row.status!='进行中'}},
        {label: '申请二级复核', handle: row=>{this.applyL2Review(row)}},
        {label: '申请三级复核', handle: row=>{this.applyL3Review(row)}},
        {label: '终止', handle: row=>{this.applyStop(row)}},
        {label: '录入日志', handle: row=>{ this.currProjectId = row.project_id; this.logDialogVisible = true;}}
      ],
      //详情页对话框
      detailDialogVisible: false,
      detailData: {},

      // 修改页对话框
      editDialogVisible: false,
      editDialogData: []
    }
  },
  methods: {
    toNewProject() {
      this.$router.push({path: '/project/new_project'})
    },
    showDetailDialog(index) {
      const project_id = this.rawtableData[index].project_id
      pull_detail({project_id: project_id, get_member_info:true, get_log_info: true}).then(response=>{
        this.detailData = response.data[0]
        console.log("detailData", detailData)
      })      
      this.detailDialogVisible = true;
    },
    showEditDialog(row) {
      const project_id = row.project_id
      pull_detail({project_id: project_id, get_member_info:true, get_log_info: false}).then(response=>{
        this.editDialogData = response.data[0]
      })      
      this.editDialogVisible = true;
    },
    applyL1Review(row) {
      const token = getToken()
      updateEvent(token, {
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
      updateEvent(token, {
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
      updateEvent(token, {
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
      update(token, {
        project_id: this.currProjectId,
        logContent: this.logContent,
        logTime: this.logTime,
        updateLog: true
      }).then(response=>{
        this.logDialogVisible=false;
        this.logContent=''
        this.logTime=''
        this.$message({message:'保存成功', type: 'success'})
      })
    }
  },
}
</script>

<style>

</style>