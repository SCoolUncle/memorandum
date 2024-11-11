// Example 1: 示例 1：
// Input: nums = [1,3,5,6], target = 5
// Output: 2

// Example 2: 示例 2：
// Input: nums = [1,3,5,6], target = 2
// Output: 1

// Example 3: 示例 3：
// Input: nums = [1,3,5,6], target = 7
// Output: 4


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

      if (target > med) {
          left = medIndex + 1;
      } else {
          right = medIndex;
      }
  }
};