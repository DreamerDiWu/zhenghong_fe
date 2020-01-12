<template>

<el-form style="margin-top:20px" :model="projectForm" :rules="rules" ref="projectForm" label-width="100px"  class="demo-projectForm">
  <!-- 日志对话框 -->
  <el-dialog title="填写申请" :visible.sync="orderDialogVisible" append-to-body>
    <el-form>
      <el-form-item>
        <el-select v-model="orderForm.transactor" placeholder="请选择审批人">
          <el-option
            v-for="(transactor, index) in transactors"
            :key="index"
            :label="transactor.label"
            :value="transactor.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="orderForm.propose_reason"  type="textarea" placeholder="请输入理由"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="proposeOrder">确定</el-button>
        <el-button type="danger" @click="()=>{orderDialogVisible=false; orderForm={}}">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>  
  <!-- 基础信息 -->
  <el-form-item label="项目名称" prop="project_name">
    <el-input style="width: 500px" v-model="projectForm.project_name"></el-input>
  </el-form-item>
  <el-row>
    <el-col :span="8">
      <el-form-item style="width: 300px" label="日期" required prop="create_time">
        <el-tooltip effect="dark" content="日期格式：年-月-日: 时" placement="right-end">
            <el-date-picker type="datetime" placeholder="选择项目安排日期" v-model="projectForm.create_time" style="width: 100%;" format="yyyy-MM-dd HH:00:00" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-tooltip>  
      </el-form-item>
    </el-col>
    <el-col :span="6"> 
      <el-form-item label="部门-业务类型"  label-position="right" prop="depart" required label-width="120px">
        <el-cascader :options="departStruct" placeholder="请选择部门和业务类型" v-model="projectForm.departItem" @change="handleDepartChange">
        </el-cascader>
      </el-form-item>
    </el-col>
    <el-col :span="6" v-if="projectForm.departItem[projectForm.departItem.length-1] == '其他'">
      <el-form-item prop="busz_type_extra">
        <el-input v-model="projectForm.busz_type_extra" placeholder="请输入具体类型" maxlength="10"/>
      </el-form-item>    
    </el-col>
  </el-row>
  <!-- 审核配置 -->
  <el-row>
    <el-col v-for="(ritem, index) in reviewConfig" :key="index" :span="6">
      <el-form-item 
      required
      :prop="ritem.prop" 
      :label="ritem.label" >
      <el-tooltip effect="dark" :content="ritem.tip" placement="right-end">
        <el-select v-model="projectForm[ritem.prop]" placeholder="请选择">
          <el-option
            v-for="(item, index) in ritem.options"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-tooltip>  
      </el-form-item>
    </el-col>
  </el-row>
  <el-row>
    <el-form-item prop="should_charge_amount" label="合同收款">
      <el-input  style="width:200px" placeholder="请输入金额（单位元）" v-model="projectForm.should_charge_amount"></el-input>
    </el-form-item>
  </el-row>
  <!-- 成员配置 -->
  <el-divider content-position="left">项目成员配置</el-divider>
  <el-container style="margin-left:10px">
    <el-header>
      <el-dropdown>
      <el-button type="primary" size="medium">
          + 添加项目成员<i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="r in roles" :key="r" @click.native="handleNew(r)">{{r}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-header>
    <el-main>
      <el-table
        border
        :data="projectForm.memberConfigData">
        <el-table-column type="index" width="30"></el-table-column>
        <el-table-column
          label="项目角色"
          prop="role"
          width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.role }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
          prop="member_user_name"
          width="140">
          <template slot-scope="scope">
            <el-input size="mini" v-if="rowOnEdit[scope.$index]" v-model="scope.row.member_user_name">{{ scope.row.name }}</el-input>
            <span v-if="!rowOnEdit[scope.$index]">{{ scope.row.member_user_name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="工时"
          prop="salary"
          width="140">
          <template slot-scope="scope">
            <el-input-number  
              size="mini" 
              v-if="rowOnEdit[scope.$index]" 
              v-model="scope.row.salary" 
              :step="0.1" :precision="1" :max="1" :min="0"
            />
            <span v-if="!rowOnEdit[scope.$index]">{{ scope.row.salary }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="分工"
          width="180"
          prop="job">
          <template slot-scope="scope">
            <el-input size="mini" v-if="rowOnEdit[scope.$index]" v-model="scope.row.job">{{ scope.row.job }}</el-input>
            <span v-if="!rowOnEdit[scope.$index]">{{ scope.row.job }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="!rowOnEdit[scope.$index]"
              @click="handleEdit(scope.$index, scope.row)"
              :disabled="rowOnEdit.includes(true)">编辑</el-button>
            <el-button
              size="mini"
              type="success"
              v-if="rowOnEdit[scope.$index]"
              @click="handleSave(scope.$index, scope.row)">保存</el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="!rowOnEdit[scope.$index]"
              :disabled="scope.row.role === '项目负责人' || rowOnEdit.includes(true)"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
              size="mini"
              v-if="rowOnEdit[scope.$index]"
              @click="handleCancel(scope.$index, scope.row)">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
<!-- 时间安排 -->
  <el-divider content-position="left">计划时间安排</el-divider>
  <el-main>
    <el-form-item prop="processing_dur" label="项目实施时段" label-position="left" label-width="120px" >
      <el-date-picker
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        v-model="projectForm.processing_dur"
        value-format="yyyy-MM-dd"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="review_dur" label="项目复核时段" label-position="left" label-width="120px" >
      <el-date-picker
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        v-model="projectForm.review_dur"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="project_end_time" label="项目完成日期" label-position="left" label-width="120px">
      <el-date-picker
        value-format="yyyy-MM-dd"
        v-model="projectForm.project_end_time"
        type="date"
        placeholder="与合同委托要求时间一致">
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="description" label="实施计划" label-position="left" label-width="120px">
      <el-input type="textarea" v-model="projectForm.description" placeholder="请简述实施计划"></el-input>
    </el-form-item>
  </el-main>
  <!-- 提交按钮 -->
  <el-footer style="margin-left:20px">
    <el-button v-if="!update" type="primary" @click="submitForm('projectForm')">立即创建</el-button>
    <el-button v-if="update" type="primary" @click="submitUpdateForm('projectForm')">申请修改</el-button>
    <el-button @click="resetForm('projectForm')">重置</el-button>
  </el-footer>
</el-form>    
</template>
<script>
  import { create_project } from '@/api/form'
  import { propose_order } from '@/api/order'
  export default {
    props: {
        projectForm: {
            type: Object,
            default: ()=>{}
        },
        update: {
          type: Boolean,
          default: false
        },
        confirmCallBack: {
          type: Function,
          default: ()=>{}
        }
    },
    data() {
      return {
        departStruct: [{
          value: '审计',
          label: '审计',
          children: [
            {value: '经责',  label: '经责'},
            {value: '财务收支',  label: '财务收支'},
            {value: '竣工决算',  label: '竣工决算'},
            {value: '年报',  label: '年报'},
            {value: '司法会计',  label: '司法会计'},
            {value: '咨询服务',  label: '咨询服务'},
            {value: '其他',  label: '其他'},
          ]
        },{
          value: '评估',
          label: '评估',
          children: [
            {value: '整体资产评估',  label: '整体资产评估'},
            {value: '单项资产评估',  label: '单项资产评估', children: [
              {value:'房地产评估', label: '房地产评估'},
              {value: '机器设备和车辆', label: '机器设备和车辆'}
            ]},
            {value: '无形资产评估',  label: '无形资产评估'},
            {value: '评估鉴定',  label: '评估鉴定'},
            {value: '其他',  label: '其他'},
          ]
        },{
          value: '工程造价',
          label: '工程造价',
          children: [
            {value: '预算',  label: '预算'},
            {value: '结算',  label: '结算'},
            {value: '工程控制',  label: '工程控制'},
            {value: '咨询服务',  label: '咨询服务'},
            {value: '司法鉴定',  label: '司法鉴定'},
            {value: '其他',  label: '其他'},
          ]
        }],
        reviewConfig: [
          {prop: 'review_lv1_user_name', label: '一级复核', tip: "项目复核", 
          options:[
            {value: "super_user", label: "super_user"},
            {value: "wubiao", label: "吴彪"}
          ]},
          {prop: 'review_lv2_user_name', label: '二级复核', tip: "底稿整理审核",
          options:[
            {value: "super_user", label: "super_user"},
            {value: "wubiao", label: "吴彪"}
          ]},
          {prop: 'review_lv3_user_name', label: '三级复核', tip: "报告签发",
          options:[
            {value: "super_user", label: "super_user"},
            {value: "wubiao", label: "吴彪"}
          ]}
        ],
        rowOnEdit: [],
        tmpSaveEditRow: '',
        roles: ['实习人员', '助理人员'],
        
        orderForm: {},
        orderDialogVisible: false,
        transactors: [
          {label: '吴彪', value: 'wubiao'},
          {label: '肖强', value: 'xiaoqiang'},
          {label: 'super_user', value: 'super_user'}
        ],

        rules: {
          project_name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          create_time: [
            {required: true, message: '请选择日期', trigger: 'blur' }
          ],
          depart: [
            { required: true, message: '请选择部门', trigger: 'blur' }
          ],
          busz_type: [
            { required: true, message: '请选择业务类型', trigger: 'change' }
          ],
          busz_type_extra: [
            {required: true, message: '请补充具体业务', trigger: 'blur'}
          ],
          should_charge_amount: [
            {required: true, message: '请选择合同收费', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '请填写实施计划', trigger: 'blur'}
          ],
          start_date: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          processing_dur: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          review_dur: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          project_end_time: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
        }
      };
    },
    methods: {
      handleDepartChange() {
        if (!this.projectForm.departItem.length)
          return 
        this.projectForm.depart = this.projectForm.departItem[0]
        this.projectForm.busz_type = this.projectForm.departItem[1]
        console.log("this.projectForm.depart", this.projectForm.depart)
      },
      getDate(strDate) {
        return new Date(this.projectForm.date.replace(/-/g, "/")) 
      },
      initRowOnEdit() {
        return this.projectForm.memberConfigData.map(()=> {false})
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("this.projectForm", this.projectForm)
            const token = this.$store.getters.token 
            create_project(token, this.projectForm).then(response=>{
              if (response.status === 200) {
                this.$message({
                  message: "创建成功",
                  type: 'success'
                });
                this.confirmCallBack(0)
              }
            })
          } else {
            this.$message.error('创建失败，请检查后正确填写');
            this.confirmCallBack(1)
          }
        });
      },
      submitUpdateForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.orderDialogVisible = true
          } else {
            this.$message.error('修改申请失败，请检查后正确填写');
            this.confirmCallBack(1)
          }
        });        
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.projectForm.departItem = []
        this.projectForm.busz_type_extra = ''
      },
      handleEdit(index, row) {
        this.tmpSaveEditRow = {...row}
        this.rowOnEdit = this.initRowOnEdit()
        this.rowOnEdit[index] = true 
      },
      handleDelete(index, row) {
         this.projectForm.memberConfigData.splice(index, 1)
      },
      handleSave(index, row) {
        this.rowOnEdit=this.initRowOnEdit();
      },
      handleCancel(index, row) {
        this.$set(this.projectForm.memberConfigData, index, {...this.tmpSaveEditRow})
        this.rowOnEdit=this.initRowOnEdit();
      },
      handleNew(newRole) {
        let newMember = {
            role: newRole,
            name: '未命名',
            salary: '0.0',
          }
        this.projectForm.memberConfigData.push(newMember)
        this.handleEdit(this.projectForm.memberConfigData.length-1, newMember)
      },
      proposeOrder() {
        console.log("propose:", this.projectForm)
        propose_order(
          this.$store.getters.token, 
          {
            project_id: this.projectForm.project_id,
            transactor: this.orderForm.transactor,
            operation_key: '修改项目信息', 
            propose_reason: this.orderForm.propose_reason,
            data: this.projectForm
          }
        ).then(response=>{
          if (response.status === 200) {
            this.$message({
              message: "修改申请成功",
              type: 'success'
            });
            this.orderDialogVisible = false 
            this.orderForm = {}
            this.confirmCallBack(0)
          }
        })
      }
    }
  }
</script>

