<template>
    <el-tooltip effect="dark" content="点击显示审核相关详情" placement="right-end">
        <el-popover
            placement="left"
            width="400"
            trigger="click">
            <el-timeline style="height:200px; width:400px; overflow:auto">
            <el-timeline-item
                v-for="(order, index) in scope.row.orders"
                :key="index"
                :timestamp="order.modify_time">
                {{order.operation_key}} : {{order.status}}-{{order.transact_result}}-{{order.transact_reason}}
            </el-timeline-item>
            </el-timeline>
            <el-tag type="success" v-if="scope.row.status=='进行中'||scope.row.status=='已完结'" slot="reference">{{scope.row.status}}</el-tag>
            <el-tag type="danger" v-if="scope.row.status=='已中止'" slot="reference">{{scope.row.status}}</el-tag>
            <el-tag type="warning" v-if="scope.row.status=='未开始'||scope.row.status=='未提交'||scope.row.status=='已暂停'" slot="reference">{{scope.row.status}}</el-tag>
        </el-popover>
    </el-tooltip>
</template>

<script>
  export default {
    props: {
        scope: {
            type: Object,
            default: ()=>{}
        },
    },
  }
</script>