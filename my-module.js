const findRoom = function (roomList, id) {
  for (let i = 0; i < roomList.length; i++) {
    if (roomList[i].id === id) return true;
  }
  return false;
};
const findRoomIndex = function (roomList, id) {
  for (let i = 0; i < roomList.length; i++) {
    if (roomList[i].id === id) return i;
  }
  return -1;
};
const countUserInRoom = function (roomList, idx) {
  return roomList[idx].userArr.length;
};
const checkUserName = function (roomList, idx, usn) {
  let arr = roomList[idx].userArr;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === usn) return false;
  }
  return true;
};
module.exports.findRoom = findRoom;
module.exports.findRoomIndex = findRoomIndex;
module.exports.countUserInRoom = countUserInRoom;
module.exports.checkUserName = checkUserName;
