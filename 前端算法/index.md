## 二分查找

### 条件

1. 有序数组
2. 数组中无重复元素

### 示例

给定一个 n 个元素有序的升序整型数组 nums 和一个目标值 target ，写一个函数搜索 nums 中的 target， 如果目标值存在返回下标， 否则返回 -1

示例：

```JavaScript
  // 输入： nums = [-1, 0, 3, 5, 9, 12], target = 9
  // 0, 1, 2, 3, 4, 5, 6
  // 输出： 4
  // 解释： 9 在数组中的位置是 4

  function getTarget(nums, target){
    let left = 0
    let right = nums.length - 1

    while( left <= right ) {
      let medIndex = Math.floor((left + right) / 2)
      let med = nums[medIndex]
      if(target < med) {
        right = med - 1
      } else if (target > med) {
        left = med + 1
      } else {
        return medIndex
      }
    }

    return -1
  }
```
