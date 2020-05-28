<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 详情页对话框 -->
  <project-detail-dialog 
    :detailData="detailData" 
    :detailDialogVisible="detailDialogVisible"
    :closeCallBack="()=>{this.detailDialogVisible = false}">
  </project-detail-dialog>


    <!-- 查询选项 -->

    <el-header height="100%">      
        <el-row :gutter="20"  > 
          <el-col :span="6">
            <el-input style="width: 200px" v-model="filterItem.single.project_name" placeholder="输入项目名称自动检索"/> 
          </el-col>
          <el-col :span="6">
            <el-input style="width: 200px" v-model="filterItem.single.owner_chi_name" placeholder="输入组长名称自动检索"/> 
          </el-col>
          <el-col :span="6">
            <el-select v-model="filterItem.multiple.status" multiple placeholder="项目状态" clearable >
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-cascader 
              :clearable="true"
              :props="{ multiple: true, checkStrictly: true }"
              :options="departStruct" 
              v-model="departItem" 
              @change="calcDepartInfo" 
              placeholder="部门-业务类型"/>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="4" v-for="(item,index) in yesOrNoItem" :key="index">
            <el-select
             v-model="filterItem.multiple[item.prop]" multiple :placeholder="item.label" clearable >
              <el-option
                v-for="item in ['是','否']"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row/>
        <el-divider content-position="left">统计选项</el-divider>
        <el-row>
          <el-col :span="3">
            <el-switch
              v-model="statsOn"
              size="medium"
              active-text="自动统计"
              inactive-text="">
            </el-switch>
          </el-col>
          <el-col v-if="statsOn" :span="10">
            <el-checkbox-group v-model="statsType">
              <el-checkbox label="平均值"></el-checkbox>
              <el-checkbox label="中位数"></el-checkbox>
              <el-checkbox label="合计"></el-checkbox>
              <el-checkbox label="最小值"></el-checkbox>
              <el-checkbox label="最大值"></el-checkbox>
            </el-checkbox-group>
          </el-col>
          <el-col v-if="statsOn" :span="10">
             <el-select 
             style="width:300px"
             v-model="statsIndicator" 
             multiple 
             placeholder="请选择统计指标" 
             clearable 
             :disabled="statsType.length == 0">
              <el-option
                v-for="item in statsIndicatorList"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>           
          </el-col>
        </el-row>
      </el-header>
    
    <!-- 表格 -->
    <el-main style="position:relative;margin-top:50px">
      <div class="queryResult">
        <el-table :data="filterResultData" @sort-change="sortChange" border >
          <el-table-column label="项目名称">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="点击显示详情" placement="right-end">
                <el-button type="text" @click="showDetailDialog(scope.$index)">{{scope.row.project_name}}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="项目状态">
            <template slot-scope="scope">
              <project-status-tag :scope="scope"></project-status-tag>
            </template>
          </el-table-column>
          <el-table-column 
          v-for="(col,index) in tableCols" 
          :key="index"
          :label="col.label" 
          :prop="col.prop" 
          sortable="custom">
          </el-table-column>
        </el-table>
      </div>
      <div class="statsResult" v-if="statsType.length >0  && statsIndicator.length > 0" style="position:relative;margin-top:50px">
        <el-divider content-position="left">统计结果</el-divider>
          <el-table :data="statsResultData">
            <el-table-column 
            v-for="(col,index) in filterResultDataCols" 
            :key="index"
            :prop="col.prop" 
            :label="col.label" >
            </el-table-column>
          </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import ProjectDetailDialog from '../../components/Dialog/ProjectDetailDialog.vue'
import ProjectStatusTag from '../../components/Tag/ProjectStatusTag.vue'
import { get_auth_project_info } from '@/api/form'
export default {
  components: {
    ProjectDetailDialog,
    ProjectStatusTag
  },
  mounted() {
    get_auth_project_info(this.$store.getters.token).then(response=>{
      this.rawtableData = response.data
    })
  },
  computed: {
    filterResultDataCols() {
      return this.statsResultDataCols.filter(col=>{
        if (col.label == '指标')
          return true
        return this.statsType.includes(col.label)
      })
    },
    filterResultData() {
      let filterResult = this.rawtableData.filter(data=>this.filterData(data))
      if (!filterResult.length) {
        return filterResult
      }
      if (this.sortOrder == 'ascending') {
        if (typeof filterResult[0][this.sortColumn] == 'number') {
          filterResult.sort((a, b)=>{return a[this.sortColumn] - b[this.sortColumn]})
        } else {
          filterResult.sort((a, b)=>{return a[this.sortColumn].localeCompare(b[this.sortColumn],'zh-CN')})
        }
        
      } else if (this.sortOrder == 'descending') {
        
        if (typeof filterResult[0][this.sortColumn] == 'number') {
          filterResult.sort((a, b)=>{return b[this.sortColumn] - a[this.sortColumn]})
        } else {
          filterResult.sort((a, b)=>{return b[this.sortColumn].localeCompare(a[this.sortColumn],'zh-CN')})
        }
      } else if (this.sortOrder == null) {
      } 
      return filterResult
    },

    statsResultData() {
      let ret = []
      this.indicatorOptions.forEach(option=>{
        if (this.statsIndicator.indexOf(option.label) != -1 && this.statsType.length > 0) {
          ret.push(this.statsValue(option.prop, option.label))      
        }
      })

      return ret 
    }
  },
  data () {
    return {
      // 我的项目展示的列名配置
      rawtableData: [],
      tableCols:[
        {label: '立项日期', prop: 'create_time'},
        {label: '实施开始日期', prop: 'processing_start_time'},
        {label: '预计完成日期', prop: 'project_end_time'},
        {label: '项目耗时（天）', prop: 'day_passed'},
        {label: '项目每日工时', prop: 'work_time_per_day'},
        {label: '项目成本', prop: 'should_checkout_amount'},
        {label:'项目组长',prop:'owner_chi_name'},
        {label: '部门', prop: 'depart'},
        {label: '业务类型', prop: 'business'},
        {label: '底稿存档', prop: 'save'},
        {label: '工资计发', prop: 'checkout'},
        {label:'收款确认',prop:'charge'},
        {label:'报告制作',prop:'publish'},
        {label:'一级复核',prop:'lv1_review'},
        {label:'二级复核',prop:'lv2_review'},
        {label:'三级复核',prop:'lv3_review'},
        {label:'收款金额', prop: 'charge_amount'},
        {label:'工资计发金额', prop: 'checkout_amount'},
      ],

      // 部门业务选项
      departStruct: [{
          value: '审计',
          label: '审计',
          children: [
            {value: '经责',  label: '经责'},
            {value: '财务收支',  label: '财务收支'},
            {value: '竣工决算',  label: '竣工决算'},
            {value: '年报',  label: '年报'},
            {value: '司法会计',  label: '司法会计'},
            {value: '咨询服务',  label: '咨询服务'},
            {value: '其他',  label: '其他'},
          ]
        },{
          value: '评估',
          label: '评估',
          children: [
            {value: '整体资产评估',  label: '整体资产评估'},
            {value: '单项资产评估',  label: '单项资产评估', children: [
              {value:'房地产评估', label: '房地产评估'},
              {value: '机器设备和车辆', label: '机器设备和车辆'}
            ]},
            {value: '无形资产评估',  label: '无形资产评估'},
            {value: '评估鉴定',  label: '评估鉴定'},
            {value: '其他',  label: '其他'},
          ]
        },{
          value: '工程造价',
          label: '工程造价',
          children: [
            {value: '预算',  label: '预算'},
            {value: '结算',  label: '结算'},
            {value: '工程控制',  label: '工程控制'},
            {value: '咨询服务',  label: '咨询服务'},
            {value: '司法鉴定',  label: '司法鉴定'},
            {value: '其他',  label: '其他'},
          ]
        }],
      // 项目筛选项
      filterItem: {
        single: {
          project_name: '',
          owner_chi_name: '',
          // checkout: '',
          // paid: '',
          // save: '', 
        },
        multiple: {
          status: [],
          depart: [],
          business: [],
          charge: [],
          // lv1_review: [],
          // lv2_review: [],
          lv3_review: [],
          save: [],
          publish: [],
          checkout: []
        }
      },
      yesOrNoItem: [
        {label: '收款', prop: 'charge'},
        {label: '底稿存档', prop: 'save'},
        {label: '报告制作', prop: 'publish'},
        {label: '计发工资', prop: 'checkout'},
        {label: '三级审核', prop: 'lv3_review'}
      ],
      checkList: [],
      departItem: [],
      statusOptions: ['进行中', '已完结', '已中止', '未开始'],
      // 统计项
      statsOn: true,
      statsType: ['平均值', '最大值', '最小值', '合计', '中位数'],
      statsIndicator: [],
      statsIndicatorList: ['项目每日工时', '项目收入', '项目耗时', '项目成本'],
      indicatorOptions: [
        {label: '项目每日工时', prop: 'work_time_per_day'},
        {label: '项目应收', prop: 'should_charge_amount'},
        {label: '项目实收', prop: 'charge_amount'},
        {label: '项目耗时', prop: 'day_passed'},
        {label: '项目成本', prop: 'should_checkout_amount'},
      ],
      // statsResultData: [],
      statsResultDataCols: [
        {prop: 'indicatorName', label: '指标'},
        {prop: 'min', label: '最小值'},
        {prop: 'max', label: '最大值'},
        {prop: 'avg', label: '平均值'},
        {prop: 'median', label: '中位数'},
        {prop: 'sum', label: '合计'},
      ],
      //详情页对话框
      detailDialogVisible: false,
      detailData: {},
      sortOrder: null,
      sortColumn: ''
    }
  },
  methods: {
    sortChange({column, prop, order}) {
      this.sortOrder = order
      this.sortColumn = prop
    },
    filterData(data) {
      let singleFilterProps = this.filterItem.single 
      let multipleFilterProps = this.filterItem.multiple
      let filterRes = []
      Object.keys(singleFilterProps).forEach(key=>{
        if (!singleFilterProps[key] || data[key].includes(singleFilterProps[key])) {
          filterRes.push(true)
        } else {
          filterRes.push(false)
        }
      })
      Object.keys(multipleFilterProps).forEach(key=>{
        if (multipleFilterProps[key].length == 0 || multipleFilterProps[key].includes(data[key])) {
          filterRes.push(true)
        } else {
          filterRes.push(false)
        }
      })
      return !filterRes.includes(false)

    },
    calcDepartInfo() {
      this.filterItem.multiple.depart = []
      this.filterItem.multiple.business = []
      this.departItem.forEach(item=>{
        if (item.length == 1) {
          this.filterItem.multiple.depart.push(item[0])
        } else if (item.length == 2) {
          this.filterItem.multiple.depart.push(item[0])
          this.filterItem.multiple.business.push(item[1])
        } else if (item.length == 3) {
          this.filterItem.multiple.business.push(item[1]+'-'+item[2])
        }
      })
    },
    showDetailDialog(index) {
      this.detailDialogVisible = false;
      this.detailData = this.filterResultData[index]
      this.detailDialogVisible = true;
    },
    statsValue(prop, label) {
      let statRes = {
        // indicatorName: '项目收入',
        indicatorName: label,
        min: Number.POSITIVE_INFINITY, 
        minName: '', 
        max: Number.NEGATIVE_INFINITY, 
        maxName: '',
        avg: 0,
        median: 0,
        sum: 0
      }
      let sortedValue = this.filterResultData.map(data=>{return data[prop] ? data[prop]:0}).sort((a, b)=>{return  a > b})
      const resLength = sortedValue.length
      statRes.min = sortedValue[0]
      statRes.max = sortedValue[resLength - 1]
      let medIndex = Math.floor(resLength / 2)
      if (resLength % 2 != 0) {
        statRes.median = sortedValue[medIndex]
      } else {
        statRes.median = (sortedValue[medIndex] + sortedValue[medIndex-1]) / 2
      }
      sortedValue.forEach(value=>{statRes.sum += value})
      statRes.avg = statRes.sum / resLength 
      return statRes 
    },
  },

}
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>