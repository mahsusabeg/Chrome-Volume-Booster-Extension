const VOLUME_KEY = "volume_key";
const DEFAULT_VOLUME_PERCENTAGE = 100;
let currentVolumePercentage;
let gainNode;


initializeCurrentVolumePercentage();
initializeRequestListeners();

console.log("Now volume: " + currentVolumePercentage);


function initializeCurrentVolumePercentage() {
    currentVolumePercentage = sessionStorage.getItem(VOLUME_KEY);

    console.log("Saved volume: " + currentVolumePercentage);

    if (currentVolumePercentage == null) {
        currentVolumePercentage = DEFAULT_VOLUME_PERCENTAGE;
        sessionStorage.setItem(VOLUME_KEY, String(currentVolumePercentage));
    }
    currentVolumePercentage = Number(currentVolumePercentage);

    console.log("Updated volume: " + currentVolumePercentage);
}
 
function initializeRequestListeners() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            console.log(request.message);
            if (request.message === "adjust_volume") {
                adjustVolume();
            }
            if (request.message === "save_volume"){
                currentVolumePercentage = Number(request.value);
                sessionStorage.setItem(VOLUME_KEY, currentVolumePercentage);
            }
            if (request.message === "get_volume"){
                sendResponse(currentVolumePercentage);
            }
            if (request.message === "reset_volume"){
                resetVolume();
                adjustVolume();
            }
            if (request.message === "restore_volume"){
                setTimeout(function(){
                    gainNode = gainNode || firstTimeSetUp();

                    if (gainNode) {
                        let volumeMultiplier = Number(sessionStorage.getItem(VOLUME_KEY)) / 100;
                        if (0 <= volumeMultiplier && volumeMultiplier <= 5) {
                            gainNode.gain.value = volumeMultiplier;
                        }
                    }
                }, 150)

            }
            if (request.message === "debug") {
                console.log(request.value);
            }
        }
    );
}
 
function adjustVolume(){
    gainNode = gainNode || firstTimeSetUp();

    if (gainNode) {
        console.log("Volume changed: " + currentVolumePercentage);
        let volumeMultiplier = currentVolumePercentage / 100;
        if (0 <= volumeMultiplier && volumeMultiplier <= 5) {
            gainNode.gain.value = volumeMultiplier;
        }
    }
}
 
function resetVolume(){
    sessionStorage.setItem(VOLUME_KEY, String(DEFAULT_VOLUME_PERCENTAGE));
    currentVolumePercentage = DEFAULT_VOLUME_PERCENTAGE;
}
 
function firstTimeSetUp() { 
    const mediaStream = document.querySelector("video");

    if (!mediaStream) {
        return null;
    }
 
    const gainNode = createGainNodeFromAudioContext(mediaStream);

    return gainNode;
}
 
function createGainNodeFromAudioContext(mediaStream) {
    const audioContext = new AudioContext();
    const mediaElementAudioSourceNode = audioContext.createMediaElementSource(mediaStream);
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 1;
    mediaElementAudioSourceNode.connect(gainNode);
    gainNode.connect(audioContext.destination);

    return gainNode;
}



