/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */

// 给你一个链表的头节点 head 和一个整数 val ，请你删除链表中所有满足 Node.val == val 的节点，并返回 新的头节点 。

/**
 * @param {ListNode} head
 * @param {number} val
 * @return {ListNode}
 */
var removeElements = function(head, val) {
  const ret = new ListNode(0, head)
  const cur = ret
  while(cur.next){
    if(cur.next.val === val){
      cur.next = cur.next.next
    }else {
      cur = cur.next
    }
  }
  return ret.next
};