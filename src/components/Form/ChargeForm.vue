<template>
    <el-dialog title="确认收款填报" :visible="chargeFormVisible" @close="handleClose">
      <el-form :model="chargeData" :rules="rules" :ref="formName">
        <el-form-item label="委托单位名称" prop="client_name">
          <el-input v-model="chargeData.client_name"/>
        </el-form-item>
        <el-form-item label="报告编号" prop="publish_id">
          <el-input v-model="chargeData.publish_id"/>
        </el-form-item>
        <el-form-item label="收款金额（元）" prop="charge_amount">
          <el-input-number :precision="2" :controls="false" style="width:150px" v-model="chargeData.charge_amount"  placeholder="请输入收款金额"/>
        </el-form-item>
        <el-form-item label="收款日期" prop="charge_time">
          <el-date-picker v-model="chargeData.charge_time" value-format="yyyyMMdd" placeholder="请选择日期"/>
        </el-form-item>
        <el-form-item label="审批人" prop="transactor">
          <el-select v-model="chargeData.transactor" placeholder="请选择审批人">
            <el-option
              v-for="item in transactors"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button type="danger" @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>     
</template>
<script>
  export default {
    props: {
        chargeFormVisible: {
            type: Boolean,
            default: ()=>false
        },
        transactors: {
            type: Array,
            default: ()=>[]
        },
        append: {
            type: Boolean,
            default: ()=>false
        },
        submitCallBack: {
          type: Function,
          default: ()=>{}
        },
        closeCallBack: {
          type: Function,
          default: ()=>{}
        }
    },
    data() {
      return {
        formName: 'chargeForm',
        chargeData: this.initData(),
        rules: {
          publish_id: [
            { required: true, message: '请正确填写报告编号', trigger: 'blur'}
          ],
          client_name: [
            { required: true, message: '请填写委托单位名称', trigger: 'blur'}
          ],
          charge_amount: [
            { required: true, message: '请正确填写收款金额', trigger: 'blur', type: 'number'}
          ],
          charge_time: [
            { required: true, message: '请选择收款日期', trigger: 'change' }
          ],
          transactor: [
            { required: true, message: '请选择审批人', trigger: 'change' }
          ],
        }
      };
    },
    methods: {
        initData() {
            return {
                client_name: '',
                publish_id: '',
                charge_amount: '',
                charge_time: '',
                transactor: ''
            }
        },
        handleClose() {
            this.chargeData = this.initData()
            this.closeCallBack()
        },
        handleSubmit() {
            if (this.validForm()) {
                this.submitCallBack(this.chargeData)
                this.chargeData = this.initData()
            } else {
                this.$message.error("请填写相应字段")
            }
        },
        validForm() {
            let validResult = false
            this.$refs[this.formName].validate((valid)=>{
                validResult = valid 
            })
            return validResult
        }
    }
  }
</script>

