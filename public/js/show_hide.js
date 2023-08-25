const video = document.getElementById("video");
const audio = document.getElementById("audio");

const show = document.getElementById("show");
const hide = document.getElementById("hide");

show.addEventListener("click", () => {
  // show video and audio elements
  video.style.display = "block";
  audio.style.display = "block";
});

hide.addEventListener("click", () => {
  // hide video and audio elements
  video.style.display = "none";
  audio.style.display = "none";
});
