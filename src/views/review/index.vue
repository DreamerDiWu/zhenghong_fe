<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 对话框 -->
      <el-dialog title="填写日志" :visible.sync="logDialogVisible">
        <el-form>
          <el-form-item label="备注">
            <el-input v-model="logContent"  type="textarea" placeholder="请输入理由"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="()=>{logDialogVisible=false; logContent=''; logTime=''; this.$message('已保存')}">保存</el-button>
            <el-button type="danger" @click="()=>{logDialogVisible=false; logContent=''; logTime=''}">取消</el-button>
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
    <el-main>
      <el-divider></el-divider>
      <el-divider content-position="left">待我审核的项目</el-divider>
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
            <el-button type="success" @click="handlePass(scope.$index, scope.row)">通过</el-button>
            <el-button type="danger" @click="handleReject(scope.$index, scope.row)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-divider content-position="left">已审核的项目</el-divider>
      
    </el-main>
  </el-container>
</template>

<script>
import ProjectForm from '../../components/Form/ProjectForm.vue'
import ProjectDetailDialog from '../../components/Dialog/ProjectDetailDialog.vue'

export default {
  components: {
    ProjectForm,
    ProjectDetailDialog
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
        {label:'项目进度',prop:'status'},
        {label:'项目负责人',prop:'owner'},
      ],


      // 项目名称模糊查找
      filterName: '',
  

      //详情页对话框
      detailDialogVisible: false,
      detailData: {},

    }
  },
  methods: {
    showDetailDialog(index) {
      this.detailData = this.rawtableData[index]
      this.detailDialogVisible = true;
    },
  },

}
</script>

<style>

</style>