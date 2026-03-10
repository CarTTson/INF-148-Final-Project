# INF 148 Final Projct

## Overview
This project provides a web based interface to control and monitor a door lock system using a servo motor and a door sensor, connected via Blynk Cloud.

## Requirements
- A live server or browser extension (such as Live Server for VS Code) to serve the HTML file. Opening the HTML file directly may not work due to browser security restrictions on local files and API requests.
- Your own Blynk API key (token). The provided code uses the author's API key as an example. You must replace it with your own for the system to work.
- Proper hardware setup:
  - Door sensor connected to your microcontroller and Blynk project.
  - Servo motor connected to control the lock mechanism.

## Setup Instructions
1. **Clone or download this repository.**
2. **Replace the API key:**
   - Open `js/lock_switch.js`.
   - Replace all instances of the example API key (`mluK2eRheIpDx6pNKbfHw3V0v8ZOxC8M`) with your own Blynk token.
3. **Connect your hardware:**
   - Ensure your door sensor and servo motor are properly wired and configured in your Blynk project.
   - The door sensor should update the door status (open/closed) in Blynk.
   - The servo motor should respond to lock/unlock commands from Blynk.
4. **Set up Blynk events for email notifications:**
   - In your Blynk console, create two events: `door_locked` and `door_unlocked`.
   - Configure these events to send email notifications when triggered.
   - The web interface will trigger these events automatically when the door is locked or unlocked.
   - Without these events set up, you will not receive email notifications for lock/unlock actions.
5. **Run the project:**
   - Use a live server (such as the Live Server extension in VS Code) to open `lock_switch.html` in your browser.
   - Do not open the HTML file directly from the filesystem, as API requests may fail.


## Usage
- The web interface shows the current door status and allows you to lock or unlock the door.
- The auto-lock feature can be toggled on or off. When enabled, the door will automatically lock 5 seconds after being closed and unlocked.
- All lock/unlock actions are logged via Blynk Cloud events.

## Notes
- You must use your own Blynk API key for the system to work.
- Make sure your hardware (door sensor and servo motor) is connected and configured correctly in your Blynk project.
- If you encounter issues, check your API key, hardware connections, and that you are running a live server.
