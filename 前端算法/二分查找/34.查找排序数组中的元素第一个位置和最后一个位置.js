// Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value.
// 给定一个按非降序排序的整数 nums 数组，找到给定目标值的开始和结束位置。

// If target is not found in the array, return [-1, -1].
// 如果在数组中找不到 target，则返回 [-1， -1]。

// You must write an algorithm with O(log n) runtime complexity.
// 您必须编写运行时复杂度为 O（log n） 的算法


var searchRange = function(nums, target) {
  const getLeftBorder = (nums, target) => {
      let left = 0, right = nums.length - 1;
      let leftBorder = -2;// 记录一下leftBorder没有被赋值的情况
      while(left <= right){
          let middle = left + ((right - left) >> 1);
          if(nums[middle] >= target){ // 寻找左边界，nums[middle] == target的时候更新right
              right = middle - 1;
              leftBorder = right;
          } else {
              left = middle + 1;
          }
      }
      return leftBorder;
  }

  const getRightBorder = (nums, target) => {
      let left = 0, right = nums.length - 1;
      let rightBorder = -2; // 记录一下rightBorder没有被赋值的情况
      while (left <= right) {
          let middle = left + ((right - left) >> 1);
          if (nums[middle] > target) {
              right = middle - 1;
          } else { // 寻找右边界，nums[middle] == target的时候更新left
              left = middle + 1;
              rightBorder = left;
          }
      }
      return rightBorder;
  }

  let leftBorder = getLeftBorder(nums, target);
  let rightBorder = getRightBorder(nums, target);
  // 情况一
  if(leftBorder === -2 || rightBorder === -2) return [-1,-1];
  // 情况三
  if (rightBorder - leftBorder > 1) return [leftBorder + 1, rightBorder - 1];
  // 情况二
  return [-1, -1];
};