<template>
    <el-dialog title="报告制作填报" :visible="publishFormVisible" @close="handleClose">
      <el-form :model="publishData" :rules="rules" :ref="formName">
        <el-form-item label="报告编号" prop="publish_id">
          <el-input style="width:150px" v-model="publishData.publish_id"  placeholder="请输入报告编号"/>
        </el-form-item>
        <el-form-item label="制作日期" prop="publish_time">
          <el-date-picker v-model="publishData.publish_time" value-format="yyyyMMdd" placeholder="请选择日期"/>
        </el-form-item>
        <el-form-item label="报告份数" prop="publish_copy">
          <el-input-number 
            v-model="publishData.publish_copy" 
            :min="1"
            label="报告份数">
          </el-input-number>        
        </el-form-item>
        <el-form-item label="审批人" prop="transactor">
          <el-select v-model="publishData.transactor" placeholder="请选择审批人">
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
        publishFormVisible: {
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
        formName: 'publishForm',
        publishData: this.initData(),
        rules: {
          publish_id: [
            { required: true, message: '请输入报告编号', trigger: 'blur' }
          ],
          publish_time: [
            { required: true, message: '请选择报告制作日期', trigger: 'change' }
          ],
          publish_copy: [
            { required: true, message: '请填写报告份数', trigger: 'blur', type: 'number' }
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
                publish_id: '',
                publish_time: '',
                publish_copy: 0,
                transactor: ''
            }
        },
        handleClose() {
            this.publishData = this.initData()
            this.closeCallBack()
        },
        handleSubmit() {
            if (this.validForm()) {
                this.submitCallBack(this.publishData)
                this.publishData = this.initData()
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

