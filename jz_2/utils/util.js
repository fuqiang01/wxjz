// 根据数组每一项对象的id值来数组去重
export function removeDuplicateForObjArr(arr) {
  let obj = {}
  const newArr = arr.filter(ele => {
    if (obj[ele.id]) return false;
    obj[ele.id] = 'a';
    return true;
  });
  return newArr;
}

// 如果一个数字小于10就在前边加个0，1 => 01
export function addZero(num) {
  if (num < 10) {
    num = "0" + num;
  }
  return num;
}

// 根据分数返回标签
export function getTagByScore(score) {
  let tag = '';
  if (score < 90) {
    tag = "马路杀手";
  } else if (score < 98) {
    tag = "新人上路"
  } else {
    tag = "驾考王者"
  }
  return tag;
}