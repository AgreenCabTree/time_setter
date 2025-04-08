// Check if the script is running in Node.js or a browser
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

if (isNode) {
    // Running in Node.js
    const axios = require('axios');
    const { exec } = require('child_process');

    async function syncTime() {
        try {
            // Fetch the current time from the custom server
            const response = await axios.get('http://localhost:3000/time');
            const timeString = response.data.time;

            // Extract date and time components
            const datePart = timeString.slice(0, 10); // YYYY-MM-DD
            const timePart = timeString.slice(11, 19); // HH:mm:ss

            // Determine the OS and construct the appropriate command
            let command;
            if (process.platform === 'win32') {
                // Windows: Use `date` and `time` commands
                command = `date ${datePart.replace(/-/g, '/')} && time ${timePart}`;
            } else if (process.platform === 'darwin') {
                // macOS: Use `date` command
                command = `sudo date "${datePart} ${timePart}"`;
            } else {
                // Linux: Use `date` command
                command = `sudo date --set="${datePart} ${timePart}"`;
            }

            // Execute the command to update the system time
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error updating system time: ${stderr || error.message}`);
                } else {
                    console.log('System time updated successfully.');
                }
            });
        } catch (error) {
            console.error(`Failed to fetch time from server: ${error.message}`);
        }
    }

    syncTime();
} else {
    // Running in a browser
    async function syncTime() {
        try {
            // Fetch the current time from the custom server
            const response = await fetch('http://localhost:3000/time');
            const data = await response.json();
            const timeString = data.time;

            // Display the fetched time to the user
            alert(`The current server time is: ${timeString}. Please manually update your system clock.`);
        } catch (error) {
            console.error(`Failed to fetch time from server: ${error.message}`);
        }
    }

    syncTime();
}