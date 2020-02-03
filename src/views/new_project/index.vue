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
        review_lv2_user_name: '',
        review_lv3_user_name: '',
        memberConfigData: [
          {
          role: '项目组长',
          member_user_name: this.$store.getters.name,
          salary: '1.0',
          job: '',
          }
        ],
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

