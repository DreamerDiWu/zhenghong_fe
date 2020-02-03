<template>
  <el-dialog title="报告制作填报" :visible="saveFormVisible" @close="handleClose">
    <el-form :model="saveData" :rules="rules" :ref="formName">
      <el-form-item label="档案编号" prop="save_id">
        <el-input style="width:150px" v-model="saveData.save_id"  placeholder="请输入档案编号"/>
      </el-form-item>
      <el-form-item label="存档日期" prop="save_time">
        <el-date-picker v-model="saveData.save_time" value-format="yyyyMMdd" placeholder="请选择日期"/>
      </el-form-item>
      <el-form-item label="审批人" prop="transactor">
        <el-select v-model="saveData.transactor" placeholder="请选择审批人">
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
        saveFormVisible: {
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
        formName: 'saveForm',
        saveData: this.initData(),
        rules: {
          save_id: [
            { required: true, message: '请输入档案编号', trigger: 'blur' }
          ],
          save_time: [
            { required: true, message: '请选择日期', trigger: 'change' }
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
                save_id: '',
                save_time: '',
                transactor: ''
            }
        },
        handleClose() {
            this.saveData = this.initData()
            this.closeCallBack()
        },
        handleSubmit() {
            if (this.validForm()) {
                this.submitCallBack(this.saveData)
                this.saveData = this.initData()
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

