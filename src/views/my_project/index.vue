<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 日志对话框 -->
      <el-dialog title="填写日志" :visible.sync="logDialogVisible">
        <el-form>
          <el-form-item>
            <el-date-picker v-model="logTime" value-format="yyyyMMdd" placeholder="请选择日期"/>
          </el-form-item>
          <el-form-item>
            <el-input v-model="logContent"  type="textarea" placeholder="请输入日志内容"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="()=>{logDialogVisible=false; logContent=''; logTime=''; this.$message('已保存')}">保存</el-button>
            <el-button type="danger" @click="()=>{logDialogVisible=false; logContent=''; logTime=''}">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>  
    <!-- 详情页对话框 -->
      <el-dialog title="项目详情" :visible.sync="detailDialogVisible" width="1000px">
        <el-divider content-position="left">基本信息</el-divider>
        <el-table :data="detailBasicData" :show-header="false" border :cell-style="detailBasicDataCellStyle">
          <el-table-column prop="key">
          </el-table-column>
          <el-table-column prop="value">
            <template slot-scope="scope">
              <el-tag v-if="detailBasicTagItem.includes(scope.row.key)" type="primary">{{scope.row.value}}</el-tag>
              <span v-if="!detailBasicTagItem.includes(scope.row.key)">{{scope.row.value}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="left">项目成员配置</el-divider>
          <el-table :data="detailMemberData" border>
            <el-table-column v-for="col in detailMemberDataCol" :prop="col.prop" :label="col.label">
            </el-table-column>
          </el-table>
        <el-divider content-position="left">日志信息</el-divider>
          <el-table :data="detailLogData" border empty-text="暂无日志数据">
            <el-table-column :sortable="col.prop=='date'" v-for="col in detailLogDataCol" :prop="col.prop" :label="col.label">
            </el-table-column>
          </el-table>
      </el-dialog>  
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
      <el-table :data="rawtableData.filter(data => !filterName || data.name.includes(filterName))" border>
        <el-table-column label="项目名称">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="点击显示详情" placement="right-end">
              <el-button type="text" @click="showDetailDialog(scope.$index)">{{scope.row.name}}</el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-for="col in tableCols" :label="col.label" :prop="col.prop">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button icon="el-icon-s-tools" type="primary">
                管理
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item 
                  v-for="handler in manageHandler" 
                  @click.native="handler.handle(scope.$index, scope.row)">
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
export default {
  components: {
    ProjectForm
  },
  data () {
    return {

// 模拟数据
// 我的项目表格
      rawtableData:[
        {
          name:'项目1',
          depart: '审计' ,
          busz_type: '经责',
          status:'实施中',
          owner:'包大人', 
          myRole: '项目负责人', 
          paid:'未收款', 
          date: '2019-09-01 19:00:00',
          start_date: '2019-10-01',
          processing_dur: ['2019-11-01', '2019-11-03'],
          review_dur:  ['2019-11-01', '2019-11-03'],
          finish_date: '2020-01-01',
          memberConfigData: [{
              role: '项目负责人',
              name: '包大人',
              salary: '1.0',
              job: '',
              }, {
              role: '项目经理',
              name: '王小虎',
              salary: '0.7',
              job: '',
              }, {
              role: '助理人员',
              name: '王大虎',
              salary: '0.5',
              job: '', 
            }],
            logs: [
            {
              date: '20191106',
              name: '王小虎',
              content: '今天送材料'
            }, 
            {
              date: '20191105',
              name: '包大人',
              content: '今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料'
            }]
        },
        {name:'项目2',status:'复核中',owner:'张龙', myRole: '实习生',paid:'已收款'},
        {name:'项目1',status:'已完成',owner:'赵虎', myRole: '项目经理',paid:'已收款'},
      ],
      // 我的项目展示的列名配置
      tableCols:[
        {label:'项目名称',prop:'name'},
        {label:'项目进度',prop:'status'},
        {label:'项目负责人',prop:'owner'},
        {label: '我的角色', prop: 'myRole'},
        {label:'是否收到款项',prop:'paid'},
      ],


      // 项目名称模糊查找
      filterName: '',
      // 录入日志对话框
      logDialogVisible: false,
      logContent: '',
      logTime: '',

      // 管理选项
      manageHandler: [
        {label: '修改', handle: index=>{this.showEditDialog(index)}},
        {label: '申请复核', handle: row=>{this.$message('复核')}},
        {label: '终止', handle: row=>{this.$message('终止')}},
        {label: '录入日志', handle: row=>{this.logDialogVisible = true}}
      ],
      //详情页对话框
      detailDialogVisible: false,
      detailBasicData: [],
      detailBasicDataCol: [
        {label:'项目名称',prop:'name'},
        {label:'项目进度',prop:'status'},
        {label:'项目负责人',prop:'owner'},
        {label:'是否收到款项',prop:'paid'},
      ],
      detailBasicTagItem: ['项目进度', '是否收到款项'],
      detailMemberData: [],
      detailMemberDataCol: [
            {label: '项目角色', prop: 'role'},
            {label: '名字', prop: 'name'},
            {label: '工时标准', prop: 'salary'},
            {label: '分工', prop: 'job'},
      ],
      detailLogData: [],
      detailLogDataCol: [
        {label: '日期', prop: 'date'},
        {label: '填写人', prop: 'name'},
        {label: '日志内容', prop: 'content'},
      ],
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
      let detailData = this.rawtableData[index]
      this.detailBasicData = this.detailBasicDataCol.map(col=>(
        {key: col.label, value: detailData[col.prop]}
      ))
      this.detailLogData = detailData.logs
      this.detailMemberData = detailData.memberConfig
      this.detailDialogVisible = true;
    },
    showEditDialog(index) {
      this.editDialogData = {...this.rawtableData[index]}
      this.editDialogVisible = true;
    },
    detailBasicDataCellStyle({ column }) {
      if (column.property == 'key') {
        return 'font-weight: bold;' 
      }
      return ''
    }
  },

}
</script>

<style>

</style>