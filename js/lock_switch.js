const switchInput = document.getElementById('lockSwitch');
let updatingFromServer = false;
let autoLockEnabled = true;
let autoLockTimer = null;
const autoLockToggle = document.getElementById('autoLockToggle');

// update switch state from server
function pollV24() {
    fetch('https://blynk.cloud/external/api/get?token=mluK2eRheIpDx6pNKbfHw3V0v8ZOxC8M&v24')
        .then(response => response.text())
        .then(value => {
            updatingFromServer = true;
            if (value.trim() === "100") {
                switchInput.checked = true;
            } else {
                switchInput.checked = false;
            }
            updatingFromServer = false;
        })
        .catch(() => {/* ignore errors for polling */});
}

// auto lock logic
// auto lock only when door is closed and unlocked
let lastDoorState = null;
let prevDoorState = null;
function startAutoLockTimer() {
    if (!autoLockEnabled) return;
    clearAutoLockTimer();
    // only start timer if door is closed and unlocked
    if (lastDoorState === "Closed" && !switchInput.checked) {
        autoLockTimer = setTimeout(() => {
            // double check state before locking
            if (lastDoorState === "Closed" && !switchInput.checked) {
                updatingFromServer = true;
                switchInput.checked = true;
                updatingFromServer = false;
                triggerLock(true);
            }
        }, 5000);
    }
}

function clearAutoLockTimer() {
    if (autoLockTimer) {
        clearTimeout(autoLockTimer);
        autoLockTimer = null;
    }
}

autoLockToggle.addEventListener('change', function() {
    autoLockEnabled = autoLockToggle.checked;
    if (!autoLockEnabled) {
        clearAutoLockTimer();
    }
});

function triggerLock(isLock) {
    let url;
    if (isLock) {
        url = "https://blynk.cloud/external/api/update?token=mluK2eRheIpDx6pNKbfHw3V0v8ZOxC8M&v24=100";
    } else {
        url = "https://blynk.cloud/external/api/update?token=mluK2eRheIpDx6pNKbfHw3V0v8ZOxC8M&v24=30";
    }
    fetch(url)
        .then(response => {
            if (!response.ok) {
                alert('API request failed');
            }
        })
        .catch(() => alert('Network error'));
    // Log event through email
    fetch(isLock
        ? "https://blynk.cloud/external/api/logEvent?token=mluK2eRheIpDx6pNKbfHw3V0v8ZOxC8M&code=door_locked"
        : "https://blynk.cloud/external/api/logEvent?token=mluK2eRheIpDx6pNKbfHw3V0v8ZOxC8M&code=door_unlocked"
    ).catch(() => {});
}

// get door status
function pollDoorStatus() {
    fetch('https://blynk.cloud/external/api/get?token=mluK2eRheIpDx6pNKbfHw3V0v8ZOxC8M&V20')
        .then(response => response.text())
        .then(value => {
            const state = document.getElementById('door-state');
            const val = value.trim();
            prevDoorState = lastDoorState;
            lastDoorState = val;
            if (val === "Open") {
                state.textContent = "Open";
                state.style.color = "#e53935";
                clearAutoLockTimer();
            } else if (val === "Closed") {
                state.textContent = "Closed";
                state.style.color = "#43a047";
                // Start auto-lock timer only if door just transitioned to closed and is unlocked
                if (prevDoorState !== "Closed" && !switchInput.checked) {
                    startAutoLockTimer();
                } else if (switchInput.checked) {
                    clearAutoLockTimer();
                }
            } else if (val === "Error") {
                state.textContent = "Error";
                state.style.color = "#757575";
                clearAutoLockTimer();
            } else {
                state.textContent = "Unknown";
                state.style.color = "#757575";
                clearAutoLockTimer();
            }
        })
        .catch(() => {
            const state = document.getElementById('door-state');
            state.textContent = "Error";
            state.style.color = "#757575";
            clearAutoLockTimer();
        });
}
setInterval(pollV24, 1000); // repeat get lock (aka servo) every 1 second
setInterval(pollDoorStatus, 1000); // repeat get door status every 1 second
pollV24(); // Initial get
pollDoorStatus(); // Initial get

switchInput.addEventListener('change', function() {
    if (updatingFromServer) return; // prevent loop
    if (switchInput.checked) {
        // ON: Locked
        triggerLock(true);
        clearAutoLockTimer();
    } else {
        // OFF: Unlock
        triggerLock(false);
        
    }
});

