const myVideo = document.createElement("video");
const videoGrid = document.getElementById("video-grid");
const myPeer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "443",
});
const socket = io("/");
const peers = {};
let myVideoStream;
console.log("setup");
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);
    myPeer.on("call", call => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream);
      });
    });
    socket.on("user-join-room", userID => {
      connectToNewUser(userID, stream);
    });
  });

myPeer.on("open", id => {
  socket.emit("join-room", roomId, id);
});

function connectToNewUser(userID, stream) {
  const call = myPeer.call(userID, stream);
  const video = document.createElement("video");
  call.on("stream", userVideoStream => {
    addVideoStream(video, userVideoStream);
  });
  call.on("close", () => {
    video.remove();
  });
  peers[userID] = call;
}

socket.on("user-disconnected", userID => {
  if (peers[userID]) peers[userID].close();
});

function addVideoStream(video, stream) {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
}

let text = $("input");

$("html").keydown(function (e) {
  if (e.which == 13 && text.val().length !== 0) {
    console.log("send");
    socket.emit("message", text.val());
    text.val("");
  }
});
socket.on("createMessage", (message, name) => {
  console.log("recive");
  $("ul").append(`<li class="message"><b>${name}</b><br/>${message}</li>`);
  scrollToBottom();
});

const scrollToBottom = () => {
  var d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const playStop = () => {
  console.log("object");
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};

const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
};
$(".leave_meeting").click(function () {
  socket.emit("user-leave-room", roomId);
  window.location.href = "/";
});
const showInfo = () => {
  alert("Your room id: " + roomId);
};
