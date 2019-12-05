<template>
  <el-container style="width:100%; margin-top:50px">
    <el-header>
      <search-form 
        size='mini'
        labelWidth = '80px' 
        :searchData = "searchData"
        :searchForm = "searchForm"
        :searchHandle="searchHandle"></search-form>
    </el-header>
    <el-main>
      <ces-table 
        size='mini'
        :isIndex='true'
        :isPagination='true'
        :isHandle='true'
        :tableData='tableData' 
        :tableCols='tableCols' 
        :tableHandles='tableHandles'
        :pagination='pagination'
        >
        </ces-table>
    </el-main>
  </el-container>
</template>

<script>
import SearchForm from '../../components/Form/SearchForm.vue'
import cesTable from '../../components/Table/Table.vue'
export default {
  data () {

    let sexs=[{label:'男',value:'M'},{label:'女',value:'F'}]
    let sexProps={label:'label',value:'value'}
    let intersts=[{label:'羽毛球',value:'badminton'},{label:'篮球',value:'basketball'},{label:'火球', value:'fireball'}]
    let interstProps={label:'label',value:'value'}
    return {
// 查询表单
      searchData:{
        name:null,
        age:null,
        sex:null,
        interst:[]
      },
      searchForm:[
        {type:'input',label:'姓名',prop:'name',width:'80px',placeholder:'请输入姓名...'},
        {type:'input',label:'年龄',prop:'age',width:'80px',placeholder:'请输入年龄...'},
        {type:'select',label:'性别',prop:'sex',width:'100px',options:sexs,props:sexProps,change:row=>'',placeholder:'请选择性别...'},
        {type:'checkbox',label:'爱好',width:'100px',prop:'interst',checkboxs:intersts,props:interstProps}
      ],
      searchHandle:[
        {label:'查询',type:'primary',handle:()=>''},
        {label:'重置',type:'primary',handle:()=>''}
      ],

// 表格
      tableData:[
        {name:'张三',age:'12',sex:'男',interst:'女'},
        {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
        {name:'张三',age:'12',sex:'男',interst:'女'},
        {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
        {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
        {name:'筱华',age:'27',sex:'女',interst:'羽毛球'},
        {name:'筱华',age:'27',sex:'女',interst:'羽毛球'}
        
      ],
      tableCols:[
        {label:'姓名',prop:'name'},
        {label:'年龄',prop:'age'},
        {label:'性别',prop:'sex'},
        {label:'爱好',prop:'interst'},
        {label:'操作',type:'button',btnList:[
          {type:'primary',label:'编辑',handle:row=>''},
          {type:'danger',label:'删除',handle:row=>''}
        ]},
        {label: '管理', type: 'dropdown', menu:[
          {label: '修改', handle:row=>{this.$message('修改')}},
          {label: '删除', handle:row=>{this.$message('删除')}},
        ]}
      ],
      tableHandles:[
        {label:'新增',type:'primary',handle:row=>''}
      ],
      pagination:{
        pageSize:10,
        pageNum:1,
        total:7
      }
    }
  },
  components:{
    cesTable,
    SearchForm
  }
}
</script>

<style>

</style>