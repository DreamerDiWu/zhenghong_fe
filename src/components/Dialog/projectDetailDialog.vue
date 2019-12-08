<template>
        <!-- 详情页对话框 -->
      <el-dialog title="项目详情" :visible.sync="detailDialogVisible" width="1000px">
        <el-divider content-position="left">基本信息</el-divider>
        <el-table :data="detailBasicData" :show-header="false" border :cell-style="detailBasicDataCellStyle">
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
        }
    },
    computed: {
        detailBasicData() {
            return this.detailBasicDataCol.map(col=>(
                {key: col.label, value: detailData[col.prop]}
            ))
        },
        detailLogData() {
            return detailData.logs
        },
        detailMemberData() {
            return detailData.memberConfigData
        }
    },
    data() {
        return {
        //详情页对话框
            detailBasicData: [],
            detailBasicDataCol: [
                {label:'项目名称',prop:'name'},
                {label:'项目进度',prop:'status'},
                {label:'项目负责人',prop:'owner'},
                {label: '部门', prop: 'depart'},
                {label: '业务类型', prop: 'busz_type'},
                {label: '是否存档', prop: 'save'},
                {label: '是否计发工资', prop: 'checkout'},
                {label:'是否收到款项',prop:'paid'},
            ],
            detailBasicTagItem: ['项目进度', '是否收到款项', '是否计发工资', '是否存档'],
            detailMemberData: [],
            detailMemberDataCol: [
                    {label: '项目角色', prop: 'role'},
                    {label: '名字', prop: 'name'},
                    {label: '工时标准', prop: 'salary'},
                    {label: '分工', prop: 'job'},
            ],
            detailLogData: [],
            detailLogDataCol: [
                {label: '日期', prop: 'date'},
                {label: '填写人', prop: 'name'},
                {label: '日志内容', prop: 'content'},
            ],
        }
    },
    methods: {
    }
}
</script>

<style>

</style>