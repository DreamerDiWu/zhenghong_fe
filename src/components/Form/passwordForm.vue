<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
  <el-form-item label="新密码" prop="new_password">
      <el-input style="width:300px" type="password" v-model="ruleForm.new_password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item label="确认密码" prop="repeat_password">
      <el-input style="width:300px" type="password" v-model="ruleForm.repeat_password" autocomplete="off"></el-input>
  </el-form-item>
  <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
  </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    submitCallback: {
      type: Function,
      default: ()=>{}
    },
  },
  data() {
    var valid_raw = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('请输入新密码'))
      }
      if (value.length < 6) {
        callback(new Error('密码长度不能少于6位'))
      }
      callback()
    };
		var valid_repeat = (rule, value, callback) => {
			if (value == '') {
					callback(new Error('请重复新密码'))
			} else {
					if (this.ruleForm.new_password != value) {
							callback(new Error('两次输入密码不一致'))
					}
			}
			callback()
    };
    return {
      ruleForm: {
				new_password: '',
				repeat_password: ''
			},
			rules: {
				new_password: [
						{required: true, trigger: 'blur', validator: valid_raw}
				],
				repeat_password: [
						{required:true, trigger: 'blur', validator: valid_repeat}
				]
			},
    }
  },
  methods: {
    submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.submitCallback(this.ruleForm)
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		resetForm(formName) {
			this.$refs[formName].resetFields();
    },
  }
}
</script>