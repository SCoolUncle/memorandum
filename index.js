/**
 * 要求输入： [1, 2, 3, 6, 8, 9, 12]
 * 输出： ["1-3", 6, "8-9", 12]
 */

const arr = [-1, 0, 3, 5, 9, 12]

function getTarget(nums, target){
  let left = 0
  let right = nums.length - 1

  while( left <= right ) {
    let medIndex = Math.floor((left + right) / 2)
    let med = nums[medIndex]

    if(target < med) {
      right = medIndex - 1
    } else if (target > med) {
      left = medIndex + 1
    } else {
      return medIndex
    }
  }

  return -1
}


/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  let left = 0
  let right = nums.length - 1

  // 判断边缘
  if(target < nums[0]) return 0
  if(target > nums[nums.length - 1]) return nums.length

  while(left <= right) {
      let medIndex = Math.floor((left + right) / 2)
      let med = nums[medIndex]

      if(left == right) {
        return target > med ? medIndex + 1: medIndex
      }

      if(target > med) {
          left = medIndex + 1
      } else if (target < med) {
          right = medIndex - 1
      } else {
          return medIndex
      }
  }
};

console.log(searchInsert([3,5,7,9,10], 8))