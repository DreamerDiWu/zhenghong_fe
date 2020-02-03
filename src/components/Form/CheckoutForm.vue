<template>
    <el-dialog title="报告制作填报" :visible="checkoutFormVisible" @close="handleClose">
      <el-form :model="checkoutData" :rules="rules" :ref="formName">
        <el-form-item label="计发工资金额" prop="checkout_amount">
          <el-input-number :controls="false" :precision="2" style="width:150px" v-model="checkoutData.checkout_amount"  placeholder="请输入档案编号"/>
        </el-form-item>
        <el-form-item label="计发工资日期" prop="checkout_time">
          <el-date-picker v-model="checkoutData.checkout_time" value-format="yyyyMMdd" placeholder="请选择日期"/>
        </el-form-item>
        <el-form-item label="计发明细" prop="checkout_detail">
          <el-input type="textarea" v-model="checkoutData.checkout_detail"  placeholder="请填写明细"/>
        </el-form-item>
        <el-form-item label="审批人" prop="transactor">
          <el-select v-model="checkoutData.transactor" placeholder="请选择审批人">
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
        checkoutFormVisible: {
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
        formName: 'checkoutForm',
        checkoutData: this.initData(),
        rules: {
          checkout_amount: [
            { required: true, message: '请输入计发工资金额', trigger: 'blur' }
          ],
          checkout_time: [
            { required: true, message: '请选择日期', trigger: 'change' }
          ],
          checkout_detail: [
            { required: true, message: '请填写计发明细', trigger: 'blur' }
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
                checkout_amount: 0.00,
                checkout_time: '',
                checkout_detail: '',
                transactor: ''
            }
        },
        handleClose() {
            this.checkoutData = this.initData()
            this.closeCallBack()
        },
        handleSubmit() {
            if (this.validForm()) {
                this.submitCallBack(this.checkoutData)
                this.checkoutData = this.initData()
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

