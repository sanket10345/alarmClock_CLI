const readline = require('readline');
const EventEmitter = require('events');

class AlarmClock extends EventEmitter {
    constructor() {
        super();
        this.alarms = [];
        this.snoozeTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        this.ringingAlarms = [];
        setInterval(() => this.checkAlarms(), 1000);
    }

    getCurrentTime() {
        return new Date();
    }

    addAlarm(time, days) {
        const alarm = { time, days, active: true, snoozeCount: 3, ringing: false };
        this.alarms.push(alarm);
        console.log(`Alarm set for ${time} on ${days.join(', ')}`);
    }

    deleteAlarm(index) {
        if (index < 0 || index >= this.alarms.length) {
            console.log('Invalid alarm index.');
            return;
        }
        this.alarms.splice(index, 1);
        console.log(`Alarm ${index} deleted.`);
    }

    snoozeAlarm(index) {
        if (index < 0 || index >= this.alarms.length) {
            console.log('Invalid alarm index.');
            return;
        }
        const currentAlarm = this.alarms[index];
        if (currentAlarm.snoozeCount > 0) {
            const snoozeTime = new Date(this.getCurrentTime().getTime() + this.snoozeTime);
            currentAlarm.time = snoozeTime;
            currentAlarm.active = true;
            currentAlarm.snoozeCount -= 1;
            currentAlarm.ringing = false;
            console.log(`Alarm ${index} snoozed to ${snoozeTime}. Snoozes left: ${currentAlarm.snoozeCount}`);
            this.ringingAlarms = this.ringingAlarms.filter(alarm => alarm !== currentAlarm);
        } else {
            console.log(`Alarm ${index} cannot be snoozed anymore. No snoozes left.`);
        }
    }

    checkAlarms() {
        const now = this.getCurrentTime();
        for (let alarm of this.alarms) {
            if (alarm.active && alarm.days.includes(now.getDay()) &&
                alarm.time.getHours() === now.getHours() &&
                alarm.time.getMinutes() === now.getMinutes() &&
                alarm.time.getSeconds() === now.getSeconds()) {
                console.log(`Alarm ${this.alarms.indexOf(alarm)} ringing!`);
                alarm.active = false;
                alarm.ringing = true;
                this.ringingAlarms.push(alarm);
                this.emit('alarm', alarm);
            }
        }
    }

    displayAlarms() {
        if (this.alarms.length === 0) {
            console.log('No alarms set.');
        } else {
            this.alarms.forEach((alarm, index) => {
                console.log(`${index}: Alarm set for ${alarm.time} on ${alarm.days.join(', ')} - ${alarm.active ? 'Active' : 'Inactive'} - Snoozes left: ${alarm.snoozeCount}`);
            });
        }
    }

    stopRinging(index) {
        if (index < 0 || index >= this.alarms.length) {
            console.log('Invalid alarm index.');
            return;
        }
        const currentAlarm = this.alarms[index];
        if (currentAlarm.ringing) {
            currentAlarm.ringing = false;
            console.log(`Alarm ${index} stopped.`);
            this.ringingAlarms = this.ringingAlarms.filter(alarm => alarm !== currentAlarm);
        } else {
            console.log(`Alarm ${index} is not ringing.`);
        }
    }

    isAnyAlarmRinging() {
        return this.ringingAlarms.length > 0;
    }

    getRingingAlarmIndices() {
        return this.alarms.map((alarm, index) => alarm.ringing ? index : -1).filter(index => index !== -1);
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const alarmClock = new AlarmClock();

const displayMenu = () => {
    if (alarmClock.isAnyAlarmRinging()) {
        console.log('Alarms ringing!');
        const ringingIndices = alarmClock.getRingingAlarmIndices();
        ringingIndices.forEach(index => {
            console.log(`Alarm ${index} is ringing!`);
        });
        console.log(`
        1. Snooze Alarm
        2. Stop Ringing Alarm
        `);
    } else {
        console.log(`
        1. Display Current Time
        2. Set Alarm
        3. Delete Alarm
        4. Display Alarms
        5. Exit
        `);
    }
    rl.question('Choose an option: ', handleInput);
};

const handleInput = (input) => {
    const isRinging = alarmClock.isAnyAlarmRinging();
    const ringingIndices = alarmClock.getRingingAlarmIndices();

    if (isRinging) {
        if (ringingIndices.length === 1) {
            const index = ringingIndices[0];
            switch (input.trim()) {
                case '1':
                    alarmClock.snoozeAlarm(index);
                    displayMenu();
                    return;
                case '2':
                    alarmClock.stopRinging(index);
                    displayMenu();
                    return;
                default:
                    console.log('Invalid option. Please try again.');
                    displayMenu();
                    return;
            }
        } else {
            rl.question(`Enter alarm index to snooze or stop (${ringingIndices.join(', ')}): `, (index) => {
                const numIndex = Number(index);
                switch (input.trim()) {
                    case '1':
                        alarmClock.snoozeAlarm(numIndex);
                        break;
                    case '2':
                        alarmClock.stopRinging(numIndex);
                        break;
                    default:
                        console.log('Invalid option. Please try again.');
                }
                displayMenu();
            });
            return;
        }
    } else {
        switch (input.trim()) {
            case '1':
                console.log(`Current Time: ${alarmClock.getCurrentTime()}`);
                break;
            case '2':
                rl.question('Enter alarm time (HH:MM:SS): ', (time) => {
                    rl.question('Enter days (comma-separated, 0 for Sunday, 6 for Saturday): ', (days) => {
                        const [hours, minutes, seconds] = time.split(':').map(Number);
                        const alarmTime = new Date();
                        alarmTime.setHours(hours, minutes, seconds, 0);
                        const daysArray = days.split(',').map(Number);
                        alarmClock.addAlarm(alarmTime, daysArray);
                        displayMenu();
                    });
                });
                return;
            case '3':
                rl.question('Enter alarm index to delete: ', (index) => {
                    alarmClock.deleteAlarm(Number(index));
                    displayMenu();
                });
                return;
            case '4':
                alarmClock.displayAlarms();
                break;
            case '5':
                rl.close();
                return;
            default:
                console.log('Invalid option. Please try again.');
        }
    }
    displayMenu();
};

alarmClock.on('alarm', (alarm) => {
    const index = alarmClock.alarms.indexOf(alarm);
    const interval = setInterval(() => {
        if (!alarm.ringing) {
            clearInterval(interval);
        } else {
            for (let i = 0; i < 5; i++) {
                console.log(`Alarm ${index} ringing! Time to wake up!`);
            }
            setTimeout(() => {
                if (!alarmClock.isAnyAlarmRinging()) return;
                displayMenu();
            }, 3000);
        }
    }, 8000); // 8 seconds cycle for alarm ringing
});

displayMenu();
