<template>
    <el-popover
        placement="right"
        width="400"
        trigger="hover">
        <el-timeline style="height:200px; width:400px; overflow:auto">
        <el-timeline-item
            v-for="(order, index) in scope.row.orders"
            :key="index"
            :timestamp="order.status=='审批中'? order.create_time: order.modify_time">
            {{order.operation_key}} : {{order.status}}
        </el-timeline-item>
        </el-timeline>
        <el-tag type="success" v-if="scope.row.status=='进行中'||scope.row.status=='已完结'" slot="reference">{{scope.row.status}}</el-tag>
        <el-tag type="danger" v-if="scope.row.status=='已中止'" slot="reference">{{scope.row.status}}</el-tag>
        <el-tag type="warning" v-if="scope.row.status=='未开始'" slot="reference">{{scope.row.status}}</el-tag>
    </el-popover>
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