<template>
  <div class="pre-code">
    <div class="error-deatail">
      <!-- 该元素中的文本通常按照原文件中的编排，以等宽字体的形式展现出来，文本中的空白符（比如空格和换行符）都会显示出来 -->
      <pre class="error-code" v-html="preline()"></pre>
    </div>
  </div>
</template>
<script setup lang="ts">
const prop = defineProps({
  origin: {
    type: Object,
  },
})
const preline = () => {
  // 错误发生的行数
  const line = prop.origin.line
  const originCodeLine = prop.origin.source.split('\n')
  console.log('originCodeLine: ', originCodeLine)
  const len = originCodeLine.length - 1
  const start = line - 3 >= 0 ? line - 3 : 0
  const end = start + 5 >= len ? len : start + 5
  const newLines = []
  for (let i = start; i <= end; i++) {
    const content = i + 1 + '.    ' + encodeHTML(originCodeLine[i])
    newLines.push(`<div class='code-line ${i + 1 == line ? 'highlight' : ''}'>${content}</div>`)
  }
  console.log('newLines: ', newLines)
  console.log('newLines.join(): ', newLines.join(''))
  return newLines.join('')
}
const encodeHTML = (str) => {
  if (!str || str.length === 0) {
    return ''
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
</script>
<style>
.error-code {
  padding: 10px;
  overflow: hidden;
  font-family: consolas, monospace;
  word-wrap: normal;
}
.code-line {
  padding: 4px;
}
.highlight {
  color: #fff;
  background: #f12926;
}
</style>
