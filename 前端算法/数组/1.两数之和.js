/**
 * Input: nums = [2,7,11,15], target = 9
 * Output: [0,1]
 * Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
 */

/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
  const map = new Map()
   for(let i = 0; i < nums.length; i++){
      let end = target - nums[i]
      if(map.has(end)) {
          return [i, map.get(end)]
      }
      map.set(nums[i], i)
  }
};