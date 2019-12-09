<template>
  <el-container style="width:100%; margin-top:50px">
    <!-- 详情页对话框 -->
  <project-detail-dialog 
    :detailData="detailData" 
    :detailDialogVisible="detailDialogVisible"
    :closeCallBack="()=>{this.detailDialogVisible = false}">
  </project-detail-dialog>


    <!-- 查询选项 -->

    <el-header height="180px">      
        <el-row :gutter="20"> 
          <el-col :span="4">
            <el-input style="width: 200px" v-model="filterItem.single.name" placeholder="输入项目名称自动检索"/> 
          </el-col>
          <el-col :span="4">
            <el-select v-model="filterItem.multiple.status" multiple placeholder="项目进展" clearable >
              <el-option
                v-for="item in statusOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-cascader 
              :clearable="true"
              :props="{ multiple: true, checkStrictly: true }"
              :options="departStruct" 
              v-model="departItem" 
              @change="calcDepartInfo" 
              placeholder="部门-业务类型"/>
          </el-col>
          <el-col :span="4">
            <el-select v-model="filterItem.multiple.paid" multiple placeholder="是否收款" clearable >
              <el-option
                v-for="item in paidOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
         <el-col :span="4">
            <el-select v-model="filterItem.multiple.checkout" multiple placeholder="是否计发工资" clearable >
              <el-option
                v-for="item in checkoutOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
         <el-col :span="4">
            <el-select v-model="filterItem.multiple.save" multiple placeholder="是否存档" clearable >
              <el-option
                v-for="item in saveOptions"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row/>
            <el-divider content-position="left"></el-divider>
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
          <el-col v-if="statsOn" :span="6">
             <el-select 
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
    <el-main>
      <div class="queryResult">
        <el-table :data="filterResultData" border >
          <el-table-column label="项目名称">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="点击显示详情" placement="right-end">
                <el-button type="text" @click="showDetailDialog(scope.$index)">{{scope.row.name}}</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column v-for="col in tableCols" :label="col.label" :prop="col.prop" :sortable="true">
          </el-table-column>
        </el-table>
      </div>
      <div class="statsResult" v-if="statsType.length >0  && statsIndicator.length > 0" style="position:relative;margin-top:50px">
        <el-divider content-position="left">统计结果</el-divider>
          <el-table :data="statsResultData">
            <el-table-column 
            v-for="col in filterResultDataCols" 
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
export default {
  components: {
    ProjectDetailDialog
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
      return this.rawtableData.filter(data=>this.filterData(data))
    },
    incomeStats() {
      let statRes = {
        indicatorName: '项目收入',
        min: Number.POSITIVE_INFINITY, 
        minName: '', 
        max: Number.NEGATIVE_INFINITY, 
        maxName: '',
        avg: 0,
        median: 0,
        sum: 0
      }
      let sortedIncome = this.filterResultData.map(data=>{return data.income}).sort((a, b)=>{return  a > b})
      const resLength = sortedIncome.length
      statRes.min = sortedIncome[0]
      statRes.max = sortedIncome[resLength - 1]
      let medIndex = Math.floor(resLength / 2)
      if (resLength % 2 != 0) {
        statRes.median = sortedIncome[medIndex]
      } else {
        statRes.median = (sortedIncome[medIndex] + sortedIncome[medIndex-1]) / 2
      }
      sortedIncome.forEach(income=>{statRes.sum += income})
      statRes.avg = statRes.sum / resLength 
      return statRes 
    },
    statsResultData() {
      let ret = []
      if (this.statsIndicator.length > 0 && this.statsType.length > 0) {
        ret.push(this.incomeStats)      
      }
      return ret 
    }
  },
  data () {
    return {

// 模拟数据
// 我的项目表格
      rawtableData:[
        {
          name:'项目1',
          depart: '审计' ,
          busz_type: '经责',
          busz_type_extra: '',
          status:'实施中',
          owner:'包大人', 
          myRole: '项目负责人', 
          paid:'已收款',
          income: 200000,
          checkout: '未计发工资',
          save: '未存档',
          date: '2019-09-01 19:00:00',
          start_date: '2019-10-01',
          processing_dur: ['2019-11-01', '2019-11-03'],
          review_dur:  ['2019-11-01', '2019-11-03'],
          finish_date: '2020-01-01',
          memberConfigData: [{
              role: '项目负责人',
              name: '包大人',
              salary: '1.0',
              job: '',
              }, {
              role: '项目经理',
              name: '王小虎',
              salary: '0.7',
              job: '',
              }, {
              role: '助理人员',
              name: '王大虎',
              salary: '0.5',
              job: '', 
            }],
            logs: [
            {
              date: '20191106',
              name: '王小虎',
              content: '今天送材料'
            }, 
            {
              date: '20191105',
              name: '包大人',
              content: '今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料,今天准备了材料'
            }]
        },
        {name:'项目2',status:'复核中',owner:'张龙', myRole: '实习生',paid:'已收款', income: 200000, depart: '审计' ,
          busz_type: '其他',
          busz_type_extra: '',           
          checkout: '已计发工资',
          save: '已存档',
          date: '2019-09-01 19:00:00',
          start_date: '2019-10-01',
          processing_dur: ['2019-11-01', '2019-11-03'],
          review_dur:  ['2019-11-01', '2019-11-03'],
          finish_date: '2020-01-01',},
        {name:'项目1',status:'已完成',owner:'赵虎', myRole: '项目经理',paid:'未收款',income: 0, depart: '评估' ,
          busz_type: '其他',
          busz_type_extra: '',
          checkout: '未计发工资',
          save: '未存档',
          date: '2019-09-01 19:00:00',
          start_date: '2019-10-01',
          processing_dur: ['2019-11-01', '2019-11-03'],
          review_dur:  ['2019-11-01', '2019-11-03'],
          finish_date: '2020-01-01',},
      ],
      // 我的项目展示的列名配置
      tableCols:[
        {label: '立项日期', prop: 'date'},
        {label: '实施日期', prop: 'start_date'},
        {label: '结束日期', prop: 'finish_date'},
        {label:'项目进度',prop:'status'},
        {label:'项目负责人',prop:'owner'},
        {label: '部门', prop: 'depart'},
        {label: '业务类型', prop: 'busz_type'},
        {label: '是否存档', prop: 'save'},
        {label: '是否计发工资', prop: 'checkout'},
        {label:'是否收到款项',prop:'paid'},
        {label:'项目收入', prop: 'income'}
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
          name: '',
          // checkout: '',
          // paid: '',
          // save: '', 
        },
        multiple: {
          status: [],
          depart: [],
          busz_type: [],
          busz_type_extra: [],
          paid: [],
          save: [],
          checkout: []
        }
      },
      checkList: [],
      departItem: [],
      statusOptions: ['实施中', '复核中', '已完成', '已终止', '底稿整理'],
      paidOptions: ['已收款', '未收款'],
      saveOptions: ['已存档', '未存档'],
      checkoutOptions: ['已计发工资', '未计发工资'],

      // 统计项
      statsOn: true,
      statsType: ['平均值', '最大值', '最小值', '合计', '中位数'],
      statsIndicator: [],
      statsIndicatorList: ['耗费人工工时', '项目收入', '项目耗时'],
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
    }
  },
  methods: {
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
      console.log(this.departItem)
      this.filterItem.multiple.depart = []
      this.filterItem.multiple.busz_type = []
      this.filterItem.multiple.busz_type_extra = []
      this.departItem.forEach(item=>{
        if (item.length == 1) {
          this.filterItem.multiple.depart.push(item[0])
        } else if (item.length == 2) {
          this.filterItem.multiple.depart.push(item[0])
          this.filterItem.multiple.busz_type.push(item[1])
        } else if (item.length == 3) {
          this.filterItem.multiple.busz_type_extra.push(item[2])
        }
      })
    },
    showDetailDialog(index) {
      this.detailDialogVisible = false;
      this.detailData = this.rawtableData[index]
      this.detailDialogVisible = true;
    },
  },

}
</script>

<style>

</style>