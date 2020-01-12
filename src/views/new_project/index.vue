<template>
  <project-form :projectForm="projectForm" :confirmCallBack="handleConfirm"></project-form>
</template>
<script>
import ProjectForm from '../../components/Form/ProjectForm.vue'
export default {
  components: {
    ProjectForm
  },
  data() {
    return {
      projectForm: {   
        memberConfigData: [{
          role: '项目负责人',
          member_user_name: 'super_user',
          salary: '1.0',
          job: '',
          }, {
          role: '项目经理',
          member_user_name: '王小虎',
          salary: '0.7',
          job: '',
          }, {
          role: '助理人员',
          member_user_name: '王小虎',
          salary: '0.5',
          job: '', 
        }],
        departItem: []
      },
    };
  },
  methods: {
    handleConfirm(code) {
      if (code == 0) {
        this.$router.push({'path': '/project/my_project'})
      }
    }
  }
}
</script>

