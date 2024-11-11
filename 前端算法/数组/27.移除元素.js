
/**
 * 给定一个整数数组 nums 和一个整数 val，就地删除 nums 中出现的所有 val。元素的顺序可能会更改。然后返回 nums 中不等于 val 的元素数。
 */

/**
 * @param {number[]} nums
 * @param {number} val
 * @return {number}
 */
var removeElement = function(nums, val) {
  if(!nums.length) return 0
  let endIndex = nums.length - 1
  while(endIndex >= 0){
      if(nums[endIndex] === val) {
          nums.splice(endIndex,1)
      }
      endIndex--
  }
  return nums.length
};