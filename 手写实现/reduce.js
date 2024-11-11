/**
 * 实现一个reduce
 */
// 面试题, 转换成对象
let arr = [
  ['name','lichengjin'],
  ['age',12],
]

// 结果
function format(arr){
  return arr.reduce((accumulator,current) => {
    accumulator[current[0]] = current[1]
    return accumulator
  }, {})
}

// 用法
// accumulator 上次回调返回的值
// currentValue  当前处理的值
// reduce(callBack(accumulator, currentValue), initValue)

Array.prototype.reduce = function(cb,init) {
  // 是否有初始值, 不能直接使用init
  let hasInit  = arguments.length > 1
  let result = hasInit ? init: this[0]
  let startIndex = hasInit? 0 : 1

  for(let i = startIndex; i < this.length; i++){
    result = cb(result, this[i])
  }

  return result
}

// 实现一个 reduce
Array.prototype.myReduce = function (cb, init) {
  // 判断调用的对象是否是数组
  if(Object.prototype.toString.call(this) !== '[object Array]'){
    throw new Error('this is not an array')
  }

  // 判断是否是个函数
  if(Object.prototype.toString.call(cb) !== '[object Function]'){
    throw new Error(' is not a function')
  }

  let hasInt = arguments.length > 1

  if(this.length === 0 && arguments.length < 1){
    throw new Error('如果是个空数组，需要提供初始值')
  }

  if(this.length === 0 && arguments.length > 1) {
    return init
  }

  let result = arguments.length > 1 ? init : this[0]


  for(let i = hasInt ? 0 : 1; i < this.length; i++){
    result = cb(result, this[i])
  }
  return result
}