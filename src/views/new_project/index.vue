<template>

<el-form style="margin-top:20px" :model="projectForm" :rules="rules" ref="projectForm" label-width="100px"  class="demo-projectForm">
  <!-- 基础信息 -->
  <el-form-item label="项目名称" prop="name">
    <el-input style="width: 500px" v-model="projectForm.name"></el-input>
  </el-form-item>
  <el-form-item style="width: 300px" label="日期" required prop="date">
    <el-tooltip effect="dark" content="日期格式：年-月-日: 时" placement="right-end">
        <el-date-picker type="datetime" placeholder="选择项目安排日期" v-model="projectForm.date" style="width: 100%;" format="yyyy-MM-dd HH:00:00" value-format="yyyy-MM-dd:HH:mm:ss"></el-date-picker>
    </el-tooltip>
  </el-form-item>
  <el-row :gutter="20">
    <el-col :span="4">
    <el-form-item label="部门" prop="depart" required>
        <el-select style="width: 120px" v-model="projectForm.depart" placeholder="请选择部门">
        <el-option value="审计" ></el-option>
        <el-option value="评估" ></el-option>
        <el-option value="工程造价" ></el-option>
        </el-select>
    </el-form-item>
    </el-col>
  <el-col :span="4">
    <el-form-item label="业务类型" prop="busz_type" :required="true">
    <el-select v-if="projectForm.depart==''" placeholder="请先选择部门" style="width: 200px">
    </el-select>
    <el-select filterable v-if="projectForm.depart=='审计'" style="width: 200px" v-model="projectForm.busz_type" placeholder="请选择业务类型">
      <el-option value="经责" ></el-option>
      <el-option value="财务收支" ></el-option>
      <el-option value="竣工决算" ></el-option>
      <el-option value="年报" ></el-option>
      <el-option value="司法会计" ></el-option>
      <el-option value="咨询服务" ></el-option>
      <el-option value="其他" ></el-option>
    </el-select>
    <el-select filterable v-if="projectForm.depart=='评估'" style="width: 200px" v-model="projectForm.busz_type" placeholder="请选择业务类型">
      <el-option value="整体资产评估" ></el-option>
      <el-option value="单项资产评估" ></el-option>
      <el-option value="无形资产评估" ></el-option>
      <el-option value="评估鉴定" ></el-option>
      <el-option value="其他" ></el-option>
    </el-select> 
    <el-select filterable v-if="projectForm.depart=='工程造价'" style="width: 200px" v-model="projectForm.busz_type" placeholder="请选择业务类型">
      <el-option value="预算" ></el-option>
      <el-option value="结算" ></el-option>
      <el-option value="工程控制" ></el-option>
      <el-option value="财政评审" ></el-option>
      <el-option value="咨询服务" ></el-option>
      <el-option value="司法鉴定" ></el-option>
      <el-option value="其他" ></el-option>
    </el-select> 
    </el-form-item>
    </el-col>
    <el-col v-if="projectForm.busz_type=='其他'" class="line" :span="6">
      <el-form-item prop="busz_type_extra">
        <el-input v-model="projectForm.busz_type_extra" placeholder="请输入具体类型" maxlength="10"/>
      </el-form-item>
    </el-col>
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
          <el-dropdown-item v-for="r, index in projectForm.roles" @click.native="handleNew(r)">{{r}}</el-dropdown-item>
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
        width="140">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        width="140">
        <template slot-scope="scope">
          <el-input size="mini" v-if="rowOnEdit[scope.$index]" v-model="scope.row.name">{{ scope.row.name }}</el-input>
          <span v-if="!rowOnEdit[scope.$index]">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="工时"
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
        width="180">
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
    <el-form-item prop="start_date" label="项目开始日期" label-position="left" label-width="120px" required>
      <el-date-picker
        v-model="projectForm.start_date"
        type="date"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="processing_dur" label="项目实施时段" label-position="left" label-width="120px" >
      <el-date-picker
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        v-model="projectForm.processing_dur"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="review_dur" label="项目复核时段" label-position="left" label-width="120px" >
      <el-date-picker
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        v-model="projectForm.review_dur"
        placeholder="选择日期">
      </el-date-picker>
    </el-form-item>
    <el-form-item prop="finish_date" label="项目完成日期" label-position="left" label-width="120px">
      <el-date-picker
        v-model="projectForm.finish_date"
        type="date"
        placeholder="与合同委托要求时间一致">
      </el-date-picker>
    </el-form-item>
  </el-main>
  <!-- 提交按钮 -->
  <el-footer style="margin-left:20px">
    <el-button type="primary" @click="submitForm('projectForm')">立即创建</el-button>
    <el-button @click="resetForm('projectForm')">重置</el-button>
  </el-footer>
</el-form>    
</template>
<script>
  export default {
    data() {
      return {
        projectForm: {
          name: '',
          date: '',
          depart: '',
          busz_type: '',
          busz_type_extra: '',
          roles: ['实习人员', '助理人员', '复核人员', '报告签发人员'],
          
          memberConfigData: [{
            role: '项目负责人',
            name: '王小虎',
            salary: '1.0',
            job: '',
            }, {
            role: '项目经理',
            name: '王小虎',
            salary: '0.7',
            job: '',
            }, {
            role: '助理人员',
            name: '王小虎',
            salary: '0.5',
            job: '', 
          }],
          start_date: '',
          processing_dur: '',
          review_dur:  '',
          finish_date: ''
        },
        rowOnEdit: [],
        tmpSaveEditRow: '',
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' }
          ],
          date: [
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
          start_date: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          processing_dur: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          review_dur: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
          finish_date: [
            {required: true, message: '请选择日期', trigger: 'change'}
          ],
        }
      };
    },
    methods: {
      getDate(strDate) {
        return new Date(this.projectForm.date.replace(/-/g, "/")) 
      },
      initRowOnEdit() {
        return this.projectForm.memberConfigData.map(()=> {false})
      },
      sleep(ms) {
        return new Promise(resolve => 
            setTimeout(resolve, ms)
        )
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$message({
              message: "创建成功",
              type: 'success'
            });
            this.$router.push({'path':'/project/my_project'})
          } else {
            this.$message.error('创建失败，请检查后正确填写');
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      handleEdit(index, row) {
        this.rowOnEdit = this.initRowOnEdit()
        this.rowOnEdit[index] = true 
        this.tmpSaveEditRow = {...row}
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
          this.projectForm.memberConfigData.push({
            role: newRole,
            name: '未命名',
            salary: '0.0',
          })
      },

    }
  }
</script>

