const socket = io("/");
$(document).ready(function () {
  $("#op2").hide();
  $("#op3").hide();
});
$("#create-room").click(function () {
  $("#op1").hide();
  $("#op3").show();
});
$("#create-btn").click(function () {
  let name = $("#create-name").val();
  socket.emit("user-create-room", name);
});
$("#join-room").click(function () {
  $("#op1").hide();
  $("#op2").show();
});
$("#join-btn").click(function () {
  let name = $("#name").val();
  let roomID = $("#room-id").val();
  socket.emit("new-user-join-room", roomID, name);
});
socket.on("send-id", id => {
  window.location.href = "/" + id;
});
$(".close").click(function () {
  $("#op1").show();
  $("#op2").hide();
  $("#op3").hide();
});
