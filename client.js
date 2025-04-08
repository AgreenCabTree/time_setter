// Check if the script is running in Node.js or a browser
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

// Running in Node.js
const axios = require('axios');
const { exec } = require('child_process');

async function syncTime() {
    try {
        const url = `http://${process.argv[2]}:${process.argv[3]}/time`;

        console.log(`Time Server Url: ${url}`)
        // Fetch the current time from the custom server
        const response = await axios.get(url);
        const timeString = response.data.time;
        const currentMachineTime = Date.now();

        let deltaTime = timeString - currentMachineTime;
        if (deltaTime < 0)
            deltaTime = -deltaTime;

        if (deltaTime > 5000) { // more than 5s difference
            console.log(`Need to update time, diff: ${deltaTime}`);
            const currentTime = new Date(timeString);

            function formatDate(date) {
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month and pad with leading zero
                const day = String(date.getDate()).padStart(2, '0');        // Pad day with leading zero
                const year = date.getFullYear();                            // Get full year
            
                return `${month}-${day}-${year}`;                           // Return formatted string
            }
    
            function formatTime(date) {
                const hours = String(date.getHours()).padStart(2, '0');     // Pad hours with leading zero
                const minutes = String(date.getMinutes()).padStart(2, '0'); // Pad minutes with leading zero
                const seconds = String(date.getSeconds()).padStart(2, '0'); // Pad seconds with leading zero
            
                return `${hours}:${minutes}:${seconds}`;                    // Return formatted string
            }
    
            const datePart = formatDate(currentTime);
            const timePart = formatTime(currentTime);
    
            // Determine the OS and construct the appropriate command
            let command;
            if (process.platform === 'win32') {
                // Windows: Use `date` and `time` commands
                command = `date ${datePart} && time ${timePart}`;
            } else if (process.platform === 'darwin') {
                // macOS: Use `date` command
                command = `sudo date "${datePart} ${timePart}"`;
            } else {
                // Linux: Use `date` command
                command = `sudo date --set="${datePart} ${timePart}"`;
            }
            
            console.log(`command: ${command}`);
    
            // Execute the command to update the system time
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error updating system time: ${stderr || error.message}`);
                } else {
                    console.log('System time updated successfully.');
                }
            });
        } else {
            console.log(`No need to update time, diff: ${deltaTime}`);
        }
    } catch (error) {
        console.error(`Failed to fetch time from server: ${error.message}`);
    }

    
    setTimeout(() => {
        syncTime();
    }, 1000);
}

syncTime();
