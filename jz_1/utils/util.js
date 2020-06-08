function removeDuplicateForObjArr(arr) {
  let obj = {}
  const newArr = arr.filter(ele => {
    if ( obj[ele.id] ) return false;
    obj[ele.id] = 'a';
    return true;
  });
  return newArr;
}

module.exports = {
  removeDuplicateForObjArr: removeDuplicateForObjArr
}