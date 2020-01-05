<template>
        <!-- 详情页对话框 -->
      <el-dialog title="项目详情" :visible="detailDialogVisible" @close=closeCallBack width="1000px">
        <el-divider content-position="left">基本信息</el-divider>
        <el-table :data="detailBasicData" :show-header="false" border :cell-style="this.detailBasicDataCellStyle">
          <el-table-column prop="key">
          </el-table-column>
          <el-table-column prop="value">
            <template slot-scope="scope">
              <el-tag v-if="detailBasicTagItem.includes(scope.row.key)" type="primary">{{scope.row.value}}</el-tag>
              <span v-if="!detailBasicTagItem.includes(scope.row.key)">{{scope.row.value}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-divider content-position="left">项目成员配置</el-divider>
          <el-table :data="detailMemberData" border>
            <el-table-column v-for="col in detailMemberDataCol" :prop="col.prop" :label="col.label">
            </el-table-column>
          </el-table>
        <el-divider content-position="left">日志信息</el-divider>
          <el-table :data="detailLogData" border empty-text="暂无日志数据">
            <el-table-column :sortable="col.prop=='date'" v-for="col in detailLogDataCol" :prop="col.prop" :label="col.label">
            </el-table-column>
          </el-table>
      </el-dialog>  
</template>

<script>
export default {
    props: {
        detailDialogVisible: {
            type: Boolean,
            default: ()=>false
        },
        detailData: {
            type: Object,
            default: ()=>{}
        },
        closeCallBack: {
          type: Function,
          default: ()=>{}
        }
    },
    computed: {
        detailBasicData() {
            return this.detailBasicDataCol.map(col=>(
                {key: col.label, value: this.detailData[col.prop]}
            ))
        },
        detailLogData() {
            return this.detailData.logs
        },
        detailMemberData() {
            return this.detailData.memberConfigData
        }
    },
    data() {
        return {
        //详情页对话框
            detailBasicDataCol: [
                {label:'项目名称',prop:'project_name'},
                // {label:'项目进度',prop:'status'},
                {label:'项目负责人',prop:'owner_user_name'},
                {label: '部门', prop: 'depart'},
                {label: '业务类型', prop: 'business'},
                {label: '是否存档', prop: 'save'},
                {label: '是否计发工资', prop: 'checkout'},
                {label:'是否收到款项',prop:'paid'},
            ],
            detailBasicTagItem: ['项目进度', '是否收到款项', '是否计发工资', '是否存档'],
            detailMemberDataCol: [
                    {label: '项目角色', prop: 'role'},
                    {label: '名字', prop: 'member_user_name'},
                    {label: '工时标准', prop: 'salary'},
                    {label: '分工', prop: 'job'},
            ],
            detailLogDataCol: [
                {label: '日期', prop: 'create_time'},
                {label: '填写人', prop: 'member_user_name'},
                {label: '日志内容', prop: 'content'},
            ],
        }
    },
    methods: {
      detailBasicDataCellStyle({ column }) {
        if (column.property == 'key') {
          return 'font-weight: bold;' 
        }
        return ''
      }
    }
}
</script>

<style>

</style>