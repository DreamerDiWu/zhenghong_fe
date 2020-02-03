<template>
  <el-dialog title="填写申请" :visible="orderFormVisible" @close="handleClose" :append-to-body="append">
    <el-form :model="orderForm" :rules="rules" ref="orderForm">
      <el-form-item label="审批人" prop="transactor">
        <el-select v-model="orderForm.transactor" placeholder="请选择审批人">
          <el-option
            v-for="(transactor, index) in transactors"
            :key="index"
            :label="transactor.label"
            :value="transactor.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请理由" prop="propose_reason">
        <el-input v-model="orderForm.propose_reason"  type="textarea" placeholder="请输入理由"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button type="danger" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>  
</template>
<script>
  import { propose_order } from '@/api/order'
  export default {
    props: {
        // orderForm: {
        //     type: Object,
        //     default: ()=>{}
        // },
        orderFormVisible: {
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
        orderForm: {},
        rules: {
          transactor: [
            { required: true, message: '请选择审批人', trigger: 'change' }
          ],
          propose_reason: [
            { required: true, message: '请输入申请理由', trigger: 'blur' }
          ],
        }
      };
    },
    methods: {
        handleClose() {
            this.orderForm = {}
            this.closeCallBack()
        },
        handleSubmit() {
            if (this.validForm()) {
                this.submitCallBack(this.orderForm)
                this.orderForm = {}
            } else {
                this.$message.error("请填写相应字段")
            }
        },
        validForm() {
            let validResult = false
            this.$refs["orderForm"].validate((valid)=>{
                validResult = valid 
            })
            return validResult
        }
    }
  }
</script>

