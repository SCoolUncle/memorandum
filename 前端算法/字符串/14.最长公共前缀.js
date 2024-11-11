/**
 * 编写一个函数，来查找字符串中最长的公共前缀
 * 输入： strs = ["flower", "flow", "flight" ] 输出： "fl"
 * 输入： strs = ["dog", "racecar", "car"] 输出： ""
 */

const strs = ["flower", "flow", "flight" ] 

function longestCommonPrefix(strs) {
  let str = ''
  // 遍历第一个字符串
  for(let i = 0; i < strs[0].length; i++){
    
    for(let j = 1; j < strs.length; j++){
      if(strs[j][i] !== strs[0][i]){
        return str
      }
    }
    str += strs[0][i]
  }
}

var longestCommonPrefix = function(strs) {
  // 取第一个元素
  let prefix = strs[0];
  // 遍历整个数组
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
        prefix = prefix.substring(0, prefix.length - 1);
    }
  }
  return prefix
};