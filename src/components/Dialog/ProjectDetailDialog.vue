<template>
        <!-- 详情页对话框 -->
      <el-dialog title="项目详情" :visible="detailDialogVisible" @close=closeCallBack width="1000px">
        <el-divider content-position="left">基本信息</el-divider>
        <el-table  
        :data="detailBasicData" 
        :show-header="false" 
        border 
        :cell-style="this.detailBasicDataCellStyle"
        row-key="key"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        >
          <el-table-column prop="key">
          </el-table-column>
          <el-table-column prop="value">
            <template slot-scope="scope">
              <el-tag v-if="detailBasicTagItem.includes(scope.row.key)" :type="scope.row.value=='是'?'success':'danger'">{{scope.row.value}}</el-tag>
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
            let res = this.detailBasicDataCol.map(col=>(
              {
                key: col.label, 
                value: this.detailData[col.prop], 
                children: this.detailBasicTagItem.includes(col.label)?col.children.map(child=>(
                  {key: child.label, value: this.detailData[child.prop]}
                )):[]
              }
            ))
            return res
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
                {label: '项目ID', prop: 'project_id'},
                {label:'项目名称',prop:'project_name'},
                // {label:'项目进度',prop:'status'},
                {label:'项目负责人',prop:'owner_chi_name'},
                {label: '部门', prop: 'depart'},
                {label: '业务类型', prop: 'business'},
                {label: '项目实施开始日期', prop: 'processing_start_time'},
                {label: '项目实施完成日期', prop: 'processing_end_time'},
                {label: '复核开始日期', prop: 'processing_start_time'},
                {label: '复核完成日期', prop: 'processing_start_time'},
                {label: '项目预计完成日期', prop: 'project_end_time'},
                // {label: '合同收款', prop: 'should_charge_amount'},
                {label: '实施计划', prop: 'description'},
                {label: '一级复核', prop: 'lv1_review', children: [
                  {label: '一级复核人', prop: 'review_lv1_chi_name'},
                  {label: '一级复核时间', prop: 'lv1_review_time'}
                ]},
                {label: '二级复核', prop: 'lv2_review', children: [
                  {label: '二级复核人', prop: 'review_lv2_chi_name'},
                  {label: '二级复核时间', prop: 'lv2_review_time'}
                ]},
                {label: '三级复核', prop: 'lv3_review', children: [
                  {label: '三级复核人', prop: 'review_lv3_chi_name'},
                  {label: '三级复核时间', prop: 'lv3_review_time'}
                ]},
                {label: '报告制作', prop: 'publish', children: [
                  {label: '报告制作审核', prop: 'publish_transactor_chi_name'},
                  {label: '报告编号', prop: 'publish_id'},
                  {label: '制作时间', prop: 'publish_time'},
                  {label: '报告份数', prop: 'publish_copy'},
                ]},
                {label: '底稿存档', prop: 'save', children: [
                  {label: '底稿存档审核', prop: 'save_transactor_chi_name'},
                  {label: '存档编号', prop: 'save_id'},
                  {label: '存档时间', prop: 'save_time'},
                ]},
                {label:'收款确认',prop:'charge', children: [
                  {label: '收款确认审核', prop: 'charge_transactor_chi_name'},
                  {label: '收款金额（元）', prop: 'charge_amount'},
                  {label: '收款时间', prop: 'charge_time'},
                ]},
                {label: '工资计发', prop: 'checkout', children: [
                  {label: '工资计发审核', prop: 'checkout_transactor_chi_name'},
                  {label: '计发金额（元）', prop: 'checkout_amount'},
                  {label: '计发时间', prop: 'checkout_time'},
                  {label: '计发明细', prop: 'checkout_detail'}
                ]},
            ],
            detailBasicTagItem: ['项目进度', '收款确认', '工资计发', '底稿存档','一级复核','二级复核','三级复核', '报告制作'],
            detailMemberDataCol: [
                    {label: '项目角色', prop: 'role'},
                    {label: '姓名', prop: 'member_user_name'},
                    {label: '工时标准', prop: 'salary'},
                    {label: '分工', prop: 'job'},
            ],
            detailLogDataCol: [
                {label: '日期', prop: 'create_time'},
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