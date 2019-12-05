<template>
  <div class="upload">
    <div class="upload-fileBtn-item">
      <input type="file" accept=".bin"  @change="uploadFile" ref="file">
      <el-button type="primary" icon="el-icon-upload2" size="small">选取文件</el-button>
      <span class="el-upload__tip">只能上传.bin文件</span>
    </div>
    <span class="el-form-item__error">{{noFileUploadTip}}</span>
    <ul class="upload-fileList-item">
      <li v-for="(item, index) in fileList" :key="index">
        <span class="upload-fileList-item-left"><i class="el-icon-document icon"></i>{{item.name}}</span>
        <i class="el-icon-close upload-fileList-item-right" @click="clearFile(index)"></i>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'upload',
  data () {
    return {
      noFileUploadTip: '',
      fileList: []
    }
  },
  methods: {
    // 验证是否有文件上传
    changeFileUploadTip () {
      const length = this.fileList.length
      this.noFileUploadTip = length > 0 ? '' : '请选取文件'
    },
    uploadFile (evt) {
      this.fileList = []
      const files = evt.target.files
      for (let i = 0; i < files.length; i += 1) {
        this.fileList.push(evt.target.files[i])
      }
      this.changeFileUploadTip()
      this.$refs.file.value = ''
    },
    clearFile (index) {
      this.fileList.splice(index, 1)
      this.changeFileUploadTip()
    },
    validate (callback) {
      const isHasFile = this.fileList.length > 0
      this.changeFileUploadTip()
      if (callback) callback(isHasFile)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.upload
  .upload-fileBtn-item
    position relative
    input[type=file]
      opacity 0
      width 97px
      height 32px
      position absolute
      top 4px
      left 0
      z-index 1
      cursor pointer
  .upload-fileList-item
    font-size 13px
    li
      position relative
      transition all .35s
      border-radius 2px
      line-height 30px
      padding 0 10px
      &:hover
        background-color rgba(242, 242, 242, 0.75)
        .upload-fileList-item-left
          color #409eff
      .upload-fileList-item-left
        .icon
          margin-right 10px
      .upload-fileList-item-right
        display block
        position absolute
        right 5px
        top 9px
        cursor pointer
        opacity .75
        color #606266
</style>
