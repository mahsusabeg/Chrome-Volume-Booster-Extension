const DEFAULT_VOLUME_PERCENTAGE = 100;

initializeDom();
getTabVolumePercentageValue();


function initializeDom() {
    document.getElementById("volumeSlider").addEventListener("input", setSliderOutputValue);
    document.getElementById("confirmButton").addEventListener("click", handleConfirmButton);
    document.getElementById("resetButton").addEventListener("click", handleResetButton);
}

function setSliderOutputValue() {
    document.getElementById("output").textContent = "Volume: " + document.getElementById("volumeSlider").value + "%";
    document.getElementById("confirmMessage").textContent = "";
}

function handleConfirmButton() {
    document.getElementById("confirmMessage").textContent = "Ayarlar güncellendi!";

    saveNewVolume();

    applyNewVolume();
}


function handleResetButton() {
    resetVolume();
}

function applyNewVolume() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "adjust_volume",
            });
    });
}

function saveNewVolume() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "save_volume",
                value: document.getElementById("volumeSlider").value
            });
    });
}

function resetVolume() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        document.getElementById("volumeSlider").value = DEFAULT_VOLUME_PERCENTAGE;
        document.getElementById("output").textContent = "Volume: " + DEFAULT_VOLUME_PERCENTAGE + "%";

        chrome.tabs.sendMessage(
            tabs[0].id,
            {
                message: "reset_volume",
            });
    });
}

function getTabVolumePercentageValue() {
    chrome.tabs.query({active: true, currentWindow: true},
        function (tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                {
                    message: "get_volume",
                },
                function (response) {
                    document.getElementById("volumeSlider").value = response;
                    document.getElementById("output").textContent = "Volume: " + response + "%";
                }
            );
        },
    );
}
