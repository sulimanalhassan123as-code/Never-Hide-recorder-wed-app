import { storage, ref, uploadBytes, getDownloadURL, listAll } from "./firebase.js";

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const indicator = document.getElementById("recording-indicator");
const recordingsList = document.getElementById("recordingsList");

let mediaRecorder;
let chunks = [];

// Start recording screen
startBtn.addEventListener("click", async () => {
  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: true,
  });

  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => chunks.push(e.data);

  mediaRecorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const fileName = `recording_${Date.now()}.webm`;
    const fileRef = ref(storage, "recordings/" + fileName);

    await uploadBytes(fileRef, blob);
    const url = await getDownloadURL(fileRef);

    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${fileName}</a>`;
    recordingsList.appendChild(li);

    chunks = [];
  };

  mediaRecorder.start();
  startBtn.disabled = true;
  stopBtn.disabled = false;
  indicator.style.display = "block";
});

// Stop recording
stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  indicator.style.display = "none";
});

// Load existing recordings from Firebase
async function loadRecordings() {
  const folderRef = ref(storage, "recordings/");
  const items = await listAll(folderRef);

  recordingsList.innerHTML = "";
  for (const item of items.items) {
    const url = await getDownloadURL(item);
    const li = document.createElement("li");
    li.innerHTML = `<a href="${url}" target="_blank">${item.name}</a>`;
    recordingsList.appendChild(li);
  }
}

loadRecordings();
