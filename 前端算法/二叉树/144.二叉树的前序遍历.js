/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

// 1, null , 2 , 3
// 中左右的顺序

// 递归法
function preorderTraversal(root) {

  return root ? [
    root.val,
    ...preorderTraversal(root.left),
    ...preorderTraversal(root.right)
  ] : []
}

// 迭代遍历
function preorderTraversal(root) {
  if(!root) return []

  let res = [];
  let stack = [root]
  while (stack.length) {
    let cur = stack.pop()
    res.push(cur.val)
    cur.left && stack.push(cur.left)
    cur.right && stack.push(cur.right)
  }
}