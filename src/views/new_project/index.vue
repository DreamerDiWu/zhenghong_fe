<template>
  <project-form :projectForm="projectForm" :confirmCallBack="retcode=>{this.$router.push({path: '/project/my_project'})}"></project-form>
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
        name: '',
        date: '',
        depart: '',
        busz_type: '',
        busz_type_extra: '',    
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
    };
  },
  methods: {
  }
  }
</script>

