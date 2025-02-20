import axios from 'axios'
import sourceMap from 'source-map-js'

const getSourceMap = async (url: string) => {
  return await axios.get(url)
}
// 将抛出的错误和map文件关联
const findCodeBySourceMap = async (stackFrame: any) => {
  // 获取map文件
  const sourceData = await getSourceMap(stackFrame.fileName + '.map')
  console.log('sourceData:', sourceData)
  const fileContent = sourceData.data
  const consumer = await new sourceMap.SourceMapConsumer(fileContent)
  // 通过报错位置查找到对应的源文件名称以及报错行数
  const originalPosition = consumer.originalPositionFor({
    line: stackFrame.lineNumber,
    column: stackFrame.columnNumber,
  })
  console.log('originalPosition:', originalPosition)
  // 那么就可以通过 sourceContentFor 这个方法找到报错的源代码
  const code = consumer.sourceContentFor(originalPosition.source)
  console.log(code, '还原之后的code')
}
export { findCodeBySourceMap }
