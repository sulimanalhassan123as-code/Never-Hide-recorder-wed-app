import { auth, storage } from './firebase.js';
import {
    sendSignInLinkToEmail,
    isSignInWithEmailLink,
    signInWithEmailLink
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

const emailInput = document.getElementById('email');
const loginBtn = document.getElementById('login-btn');

if (loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = emailInput.value;
        const actionCodeSettings = {
            url: window.location.href.replace('index.html','recorder.html'),
            handleCodeInApp: true
        };
        sendSignInLinkToEmail(auth, email, actionCodeSettings)
            .then(() => {
                window.localStorage.setItem('emailForSignIn', email);
                alert('Email link sent! Check your inbox.');
            })
            .catch(console.error);
    });
}

// Check if link clicked
if (isSignInWithEmailLink(auth, window.location.href)) {
    let email = window.localStorage.getItem('emailForSignIn');
    if (!email) email = window.prompt('Please provide your email for confirmation');
    signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
            alert('Successfully signed in!');
            localStorage.removeItem('emailForSignIn');
            window.location.href = 'recorder.html';
        })
        .catch(console.error);
}

// Recorder Logic
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const uploadBtn = document.getElementById('upload-btn');
const audioPlayback = document.getElementById('audio-playback');
const recordingsList = document.getElementById('recordings-list');

let mediaRecorder;
let audioChunks = [];

if (startBtn) {
    startBtn.addEventListener('click', async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        audioChunks = [];

        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });

        startBtn.disabled = true;
        stopBtn.disabled = false;
    });

    stopBtn.addEventListener('click', () => {
        mediaRecorder.stop();

        mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks);
            audioPlayback.src = URL.createObjectURL(audioBlob);
            uploadBtn.disabled = false;

            uploadBtn.onclick = async () => {
                const userId = auth.currentUser.uid;
                const storageRef = ref(storage, `recordings/${userId}_${Date.now()}.webm`);
                await uploadBytes(storageRef, audioBlob);
                alert('Uploaded successfully!');
                listRecordings();
            };
        });

        startBtn.disabled = false;
        stopBtn.disabled = true;
    });
}

// List recordings
async function listRecordings() {
    recordingsList.innerHTML = '';
    const userId = auth.currentUser.uid;
    const listRef = ref(storage, 'recordings/');
    const res = await listAll(listRef);
    res.items.forEach(async (itemRef) => {
        if(itemRef.name.startsWith(userId)){
            const url = await getDownloadURL(itemRef);
            const li = document.createElement('li');
            li.innerHTML = `<a href="${url}" target="_blank">${itemRef.name}</a>`;
            recordingsList.appendChild(li);
        }
    });
}

if(auth.currentUser) listRecordings();
