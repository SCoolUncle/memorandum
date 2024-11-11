
// Input: nums = [-1,0,3,5,9,12], target = 9
// Output: 4
// Explanation: 9 exists in nums and its index is 4

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  let left = 0
  let right = nums.length - 1

  while(left <= right) {
      let medIndex = Math.floor((left + right) / 2)
      let med = nums[medIndex]

      if( target > med) {
          left = medIndex + 1
      } else if (target < med) {
          right = medIndex - 1
      } else {
          return medIndex
      }
  }

  return -1
};