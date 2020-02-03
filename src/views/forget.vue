<template>
	<password-form :submitCallback="submitForm" style="position:relative;margin-top:100px"></password-form>
</template>

<script>
import { send_valid_link, valid_mail, reset_password } from '@/api/user'
import passwordForm from '../components/Form/passwordForm.vue'

export default {
	components: {
		passwordForm
	},
	mounted() {
		this.mail = this.$route.query.mail
		this.valid_code = this.$route.query.code
		valid_mail({mail: this.mail, valid_code: this.valid_code}).then(response=>{
			if (response.status != 200) {
				this.to404()
			} else {
				this.valid_token = response.data.token 
			}
		}).catch(error => {
			this.to404()
		})
	},
	data() {
		return {
			mail: '',
			valid_code: '',
			valid_token: ''
		}
	},
	methods: {
		to404() {
			this.$router.push({path: '/404'})
		},
		submitForm(ruleForm) {
			reset_password(this.valid_token, {'new_password': ruleForm.new_password}).then(response=>{
				if (response.status==200){
					this.$message.success('重置密码成功')
					this.$router.push({path: '/login'})
				} else {
					this.$message.error('重置密码失败')
				}
			})
		},
	}
}
</script>