<template>
  <project-form :projectForm="projectFormData">
  </project-form>
</template>
<script>
import ProjectForm from '../../components/Form/ProjectForm.vue'
  export default {
  components: {
    ProjectForm
  },
    data() {  
      return {
        projectFormData: {
          name: '',
          date: '',
          depart: '',
          busz_type: '',
          busz_type_extra: '',
          roles: ['实习人员', '助理人员', '复核人员', '报告签发人员'],
          
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
          tableCol: [
            {label: '项目角色', prop: 'role'},
            {label: '名字', prop: 'name'},
            {label: '工时标准', prop: 'salary'},
            {label: '分工', prop: 'job'},
          ],
          start_date: '',
          processing_dur: '',
          review_dur: '',
          finish_date: ''
        },
    }
  },
}
</script>

