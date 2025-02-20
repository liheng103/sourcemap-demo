<template>
  <div v-if="isError">
    <el-button type="primary" size="small" @click="clearError()">清除错误</el-button>

    <pre>
      {{ jsErrorList.stack }}
    </pre>
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item
        v-for="(item, idx) in jsErrorList.stack_frames"
        :key="idx"
        :title="item.source"
        :name="idx"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <div>{{ item.fileName }}</div>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="small" @click="openDia(item, idx)">映射源码</el-button>
          </el-col>
          <el-row :gutter="20">
            <template v-if="item.origin">
              <Preview :origin="item.origin" />
            </template>
            <template v-else>
              <div>{{ item.fileName }}</div>
            </template>
          </el-row>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-dialog v-model="diaVisible" title="soureMap源码映射" width="500">
      <el-tabs v-model="tabActiveName" class="demo-tabs">
        <el-tab-pane label="本地上传" name="local">
          <el-upload drag :before-upload="sourceMapUpload">
            <i class="el-icon-upload"></i>
            <div>将文件拖到此处，或者<em>点击上传</em></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="request">
          <el-button type="primary" @click="localMock()">本地模拟</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import sourceMap from 'source-map-js'

import Preview from '@/views/preView.vue'
const jsErrorList = ref<any>(null)
const isError = ref(false)
const activeNames = ref(['1'])
const diaVisible = ref(false)
const tabActiveName = ref('local')
let stackFrameObj = {
  line: 0,
  column: 0,
  index: 0,
}
const handleChange = (val: string[]) => {
  console.log(val)
}
onMounted(() => {
  try {
    if (localStorage.getItem('jsErrorList')) {
      isError.value = true
      jsErrorList.value = JSON.parse(localStorage.getItem('jsErrorList'))
    }
  } catch (error) {
    console.log('onMounted error: ', error)
  }
})
const clearError = () => {
  localStorage.removeItem('jsErrorList')
  isError.value = false
  jsErrorList.value = null
}
const openDia = (item, idx) => {
  diaVisible.value = true
  stackFrameObj = {
    line: item.lineNumber,
    column: item.columnNumber,
    index: idx,
  }
}

const sourceMapUpload = async (file: any) => {
  if (!file.name.endsWith('.map')) {
    ElMessage.error('请上传正确的sourceMap文件')
    return
  }
  const reader = new FileReader()
  reader.readAsText(file, 'utf-8')
  reader.onload = async function (evt) {
    const code = await getSource(evt.target?.result, stackFrameObj.line, stackFrameObj.column)
    jsErrorList.value.stack_frames[stackFrameObj.index].origin = code
    diaVisible.value = false
  }
  return false
}

const getSource = async (mpaFile: any, line: number, column: number) => {
  try {
    console.log('sourceMapppppppppp: ', sourceMap)
    const consumer = await new sourceMap.SourceMapConsumer(JSON.parse(mpaFile))
    const originalPosition = consumer.originalPositionFor({
      line,
      column,
    })
    const code = consumer.sourceContentFor(originalPosition.source)
    return {
      source: code,
      line: originalPosition.line,
      column: originalPosition.column,
    }
  } catch (error) {
    console.log('getSource error: ', error)
    ElMessage.error('sourceMap解析失败')
  }
}
// const getSourceMap = async (url: string) => {
//   return await axios.get(url)
// }

// const localMock = async () => {
//   try {
//     const sourceData = await getSourceMap(stackFrame.fileName + '.map')
//     const fileContent = sourceData.data
//     const consumer = await new sourceMap.SourceMapConsumer(fileContent)
//     const originalPosition = consumer.originalPositionFor({
//       line,
//       column,
//     })
//     const code = consumer.sourceContentFor(originalPosition.source)
//     jsErrorList.value.stack_frames[stackFrameObj.index].origin = {
//       source: code,
//       line: originalPosition.line,
//       column: originalPosition.column,
//     }
//   } catch (error) {
//     ElMessage.error('sourceMap解析失败')
//   }
// }
</script>
