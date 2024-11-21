/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[]}
 */

// 中序遍历：左中右的循序 
// 递归
var inorderTraversal = function(root) {
    return root ? [
        ...inorderTraversal(root.left),
        root.val,
        ...inorderTraversal(root.right)
    ] : []
};

// 迭代
var inorderTraversal = function(root) {
  if (!root) return []

  const res = []
  const stack = []
  const cur = root

  while (stack.length || cur) {
    if(cur) {
      stack.push(cur);
      cur = cur.left;
    } else {
      cur = stack.pop();
      res.push(cur.val); 
      cur = cur.right;
    }
  }
  return res
}