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
module.exports.findRoom = findRoom;
module.exports.findRoomIndex = findRoomIndex;
