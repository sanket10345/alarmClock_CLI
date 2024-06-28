# Alarm Clock Command-Line Application

This is a simple command-line alarm clock application written in JavaScript (ES6) using object-oriented programming principles. The application allows users to set multiple alarms, snooze alarms, stop ringing alarms, delete alarms, display current time, and view all set alarms.

## Features

1. **Display Current Time:** Shows the current system time.
2. **Set Alarm:** Allows users to set alarms for specific times on specific days of the week.
3. **Delete Alarm:** Enables users to delete a previously set alarm.
4. **Display Alarms:** Shows a list of all set alarms with their details.
5. **Snooze Alarm:** Postpones a ringing alarm for a predefined snooze time.
6. **Stop Ringing Alarm:** Stops a currently ringing alarm.

## Usage

1. **Setting up the Environment:**
   - Ensure you have Node.js installed on your system.
   - Clone this repository to your local machine.

2. **Running the Application:**
   - Navigate to the directory containing `alarmClock.js` in your terminal.
   - Run the application using Node.js:
     ```
     node alarmClock.js
     ```

3. **Using the Application:**
   - Follow the on-screen instructions to interact with the application:
     - Choose options from the displayed menu using numeric keys.
     - Input alarm times, days, and other details as prompted.
     - Manage alarms by choosing appropriate menu options.

4. **Handling Alarms:**
   - When an alarm rings, the application will display which alarm is ringing.
   - You can snooze or stop ringing alarms based on the options provided.

5. **Exiting the Application:**
   - To exit the application, choose the "Exit" option from the menu.

## Implementation Details

- The application uses `readline` for handling user input and displaying menus.
- Alarms are stored as objects in an array with properties for time, days, snooze count, and status (active/inactive).
- A timer-based loop checks the current time against set alarms and triggers ringing when a match is found.
- Events and event handling are managed using Node.js `EventEmitter` to handle alarm ringing events.
