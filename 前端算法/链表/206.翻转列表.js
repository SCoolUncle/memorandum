
/**
 * https://leetcode.com/problems/reverse-linked-list/submissions/1458392240/
 * Input: head = [1,2,3,4,5]
 * Output: [5,4,3,2,1]
 */

/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
  if(!head || !head.next) return head;
  let cur = head
  let last = null
  let temp = null
 
  while(cur){
      temp = cur.next
      cur.next = last
      last = cur
      cur = temp
  }

  return last
};