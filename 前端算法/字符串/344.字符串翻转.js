// https://leetcode.com/problems/reverse-string/description/

// Example 1: 示例 1：
// Input: s = ["h","e","l","l","o"]
// Output: ["o","l","l","e","h"]


/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(s) {
  let medIndex = s.length >> 1
  for(let i = 0; i < medIndex; i++  ){
      let mapValue = s[s.length - 1 - i]
      s[s.length -1 -i] = s[i]
      s[i] = mapValue
  }
};

/**
 * 双指针，双指针需要额外定义指针，不占优势
 */
/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
var reverseString = function(array) {
  let left = 0;
  let right = array.length - 1;
  while (left < right) {
      // 交换元素
      let temp = array[left];
      array[left] = array[right];
      array[right] = temp;
      left++;
      right--;
  }
};
