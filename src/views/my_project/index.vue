<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 确认框 -->
    <el-dialog
      title="提示"
      :visible="confirmDialogVisible"
      width="30%"
      @close="confirmDialogVisible = false"
      center>
      <span>注意：项目提交后若修改需要通过申请</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitProject">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 申请普通填写表 -->
    <order-form 
    :append="true" 
    :orderFormVisible="orderFormVisible" 
    :transactors="transactors"
    :closeCallBack="()=>{orderFormVisible=false; orderOperationKey=''; currProjectId=''}"
    :submitCallBack="(orderForm)=>{
      proposeOrder(currProjectId,orderForm.transactor, orderOperationKey,orderForm.propose_reason,{})
      this.currProjectId = ''
      this.orderOperationKey = ''
      this.orderFormVisible = false;
    }"
    ></order-form>
    <publish-form
      :publishFormVisible="publishFormVisible"
      :transactors="transactors"
      :closeCallBack="()=>{publishFormVisible=false; currProjectId=''}"
      :submitCallBack="(publishData)=>{
        proposeOrder(
          currProjectId, 
          publishData.transactor, 
          '报告制作', 
          ['报告编号:'+publishData.publish_id, '制作时间:'+publishData.publish_time, '报告份数:'+publishData.publish_copy].join('\n'), 
          publishData
        )
        currProjectId = ''
        publishFormVisible = false  
      }"
    ></publish-form>
    <charge-form
      :chargeFormVisible="chargeFormVisible"
      :transactors="transactors"
      :closeCallBack="()=>{chargeFormVisible=false; currProjectId=''}"
      :submitCallBack="(chargeData)=>{
        proposeOrder(
          currProjectId, 
          chargeData.transactor, 
          '收款确认', 
          ['收款金额:'+chargeData.charge_amount, '收款时间:'+chargeData.charge_time].join('\n'),
          chargeData
        )
        currProjectId = ''
        chargeFormVisible = false  
      }"
    ></charge-form>
    <save-form
      :saveFormVisible="saveFormVisible"
      :transactors="transactors"
      :closeCallBack="()=>{saveFormVisible=false; currProjectId=''}"
      :submitCallBack="(saveData)=>{
        proposeOrder(
          currProjectId, 
          saveData.transactor, 
          '底稿存档', 
          ['存档编号:'+saveData.save_id, '存档时间:'+saveData.save_time].join('\n'),
          saveData
        )
        currProjectId = ''
        saveFormVisible = false  
      }" 
    ></save-form>
    <checkout-form
      :checkoutFormVisible="checkoutFormVisible"
      :transactors="transactors"
      :closeCallBack="()=>{checkoutFormVisible=false; currProjectId=''}"
      :submitCallBack="(checkoutData)=>{
        proposeOrder(
          currProjectId, 
          checkoutData.transactor, 
          '工资计发', 
          ['计发金额:'+checkoutData.checkout_amount, '计发时间:'+checkoutData.checkout_time, '计发明细:'+checkoutData.checkout_detail].join('\n'),
          checkoutData
        )
        currProjectId = ''
        checkoutFormVisible = false  
      }" >
    </checkout-form>
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
        :confirmCallBack="(retcode)=>{
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
              <el-button icon="el-icon-s-tools" type="primary" 
              :disabled="scope.row.status == '已中止' || scope.row.status == '已完结'">
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
import OrderForm from '../../components/Form/OrderForm.vue'
import ChargeForm from '../../components/Form/ChargeForm.vue'
import SaveForm from '../../components/Form/SaveForm.vue'
import CheckoutForm from '../../components/Form/CheckoutForm.vue'
import PublishForm from '../../components/Form/PublishForm.vue'
import ProjectDetailDialog from '../../components/Dialog/ProjectDetailDialog.vue'
import ProjectStatusTag from '../../components/Tag/ProjectStatusTag.vue'
import { get_user_project_info, get_project_info, create_project_log, submit_project } from '@/api/form'
import { propose_order } from '@/api/order'
import { getToken } from '@/utils/auth'

export default {
  components: {
    ProjectForm,
    ProjectDetailDialog,
    ProjectStatusTag,
    OrderForm,
    PublishForm,
    ChargeForm,
    SaveForm,
    CheckoutForm
  },
  computed: {
  },
  mounted() {
    get_user_project_info(this.$store.getters.token).then(response=>{
      const {data, status} = response
      console.log(response)
      this.rawtableData = data 
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

      // 项目指针
      currProjectId: '',
      // 录入日志对话框
      logDialogVisible: false,
      logContent: '',
      logTime: '',
      
      transactors: [
        {label: '刘星', value: '103530090@qq.com'},
        {label: '陈锐', value: '11844971@qq.com'},
        {label: '谭梅', value: '2334098655@qq.com'}
      ],
      // 管理选项
      manageHandler: [
        {
          label: '修改项目信息', 
          handle: row=>{this.showEditDialog(row)}, 
          disable: row=>{return row.status == '已暂停' || this.hasOrderStatus(row, '修改项目信息', '审批中')}
        },
        {
          label: '提交项目', 
          handle: row=>{
            this.confirmDialogVisible = true;
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return (row.status != '未提交')}
        },
        {
          label: '申请一级复核', 
          handle: row=>{this.proposeStatusChange(row.project_id, row.review_lv1_user_name, '一级复核')}, 
          disable: row=>{return row.status == '已暂停' || this.hasOrderStatus(row, '一级复核', '审批中') || row.lv1_review == "是" }
        },
        {
          label: '申请二级复核', 
          handle: row=>{this.proposeStatusChange(row.project_id, row.review_lv2_user_name, '二级复核')}, 
          disable: row=>{return row.status == '已暂停' || this.hasOrderStatus(row, '二级复核', '审批中') || row.lv2_review == "是" || row.lv1_review != "是"}
        },
        {
          label: '申请三级复核', 
          handle: row=>{this.proposeStatusChange(row.project_id, row.review_lv3_user_name, '三级复核')}, 
          disable: row=>{return row.status == '已暂停' || this.hasOrderStatus(row, '三级复核', '审批中') || row.lv3_review == "是" || row.lv2_review != "是" || row.lv1_review != "是"}
        },
        {
          label: '报告制作', 
          handle: row=>{
            this.publishFormVisible = true;
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return (row.status == '已暂停' || row.lv3_review != "是" || row.publish == '是')}
        },
        {
          label: '收款确认', 
          handle: row=>{
            this.chargeFormVisible = true;
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return (row.status == '已暂停' || row.lv3_review != "是" || row.charge == '是')}
        },
        {
          label: '底稿存档', 
          handle: row=>{
            this.saveFormVisible = true;
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return (row.status == '已暂停' || row.lv3_review != "是" || row.save == '是')}
        },
        {
          label: '工资计发', 
          handle: row=>{
            this.checkoutFormVisible = true;
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return (row.status == '已暂停' || row.charge != "是" || row.checkout == '是')}
        },
        {
          label: '中止项目', 
          handle: row=>{
            this.orderFormVisible = true;
            this.orderOperationKey = '中止项目';
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return false}
        },
        {
          label: '暂停项目', 
          handle: row=>{
            this.orderFormVisible = true;
            this.orderOperationKey = '暂停项目';
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return row.status == '已暂停'}
        },
        {
          label: '恢复项目', 
          handle: row=>{
            this.orderFormVisible = true;
            this.orderOperationKey = '恢复项目';
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return row.status != '已暂停'}
        },
        {
          label: '完结项目', 
          handle: row=>{
            this.orderFormVisible = true;
            this.orderOperationKey = '完结项目';
            this.currProjectId = row.project_id
          }, 
          disable: row=>{return row.status == '已暂停' || row.checkout != '是'}
        },
        {
          label: '录入日志', 
          handle: row=>{ 
            this.currProjectId = row.project_id; this.logDialogVisible = true;
          }, 
          disable: row=>{return row.status == '已暂停'}
        },
      ],

      //详情页对话框
      detailDialogVisible: false,
      detailData: {},
      confirmDialogVisible: false,
      // 报告制作填报
      publishFormVisible: false,
      // 底稿存档填报
      saveFormVisible: false,
      // 收款填报
      chargeFormVisible: false,
      // 计发工资填报
      checkoutFormVisible: false,
      // 修改页对话框
      editDialogVisible: false,
      editDialogData: {},

      //申请表
      orderFormVisible: false,
      orderOperationKey: ''

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
    commitLog() {
      const token = getToken()
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
    proposeOrder(project_id, transactor, operation_key, propose_reason, data) {
      propose_order(
        this.$store.getters.token, 
        {
          project_id: project_id,
          transactor: transactor,
          operation_key: operation_key, 
          propose_reason: propose_reason,
          data: data
        }
      ).then(response=>{
        if (response.status === 200) {
          this.$message({
            message: operation_key + "申请已发送",
            type: 'success'
          });
          this.orderDialogVisible = false 
          this.orderForm = {}
          this.flushProjectInfo()
        }
      })
    },
    proposeStatusChange(project_id, transactor, operation_key) {
      this.proposeOrder(project_id, transactor, operation_key, '', {})
    },
    hasOrderStatus(row, operation_key, status) {
      let flag = false 
      row.orders.forEach(order => {
        if (order.operation_key==operation_key && order.status==status) {
          flag = true 
        } 
      });
      return flag  
    },
    submitProject() {
      submit_project(this.$store.getters.token, {project_id: this.currProjectId}).then(response=>{
        if (response.status==200) {
          this.$message.success("提交成功")
          this.confirmDialogVisible = false
          this.flushProjectInfo()
        } else {
          this.$message.error("提交失败")
        }
      })
    },
  },
}
</script>

<style>

</style>