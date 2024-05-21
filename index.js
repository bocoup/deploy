// npx diy-deploy lockdown inventory.yml

const { spawn } = require("node:child_process");
const path = require("node:path");
const process = require("node:process");

const run = () => {
  const command = process.argv[2];
  const inventoryFile = process.argv[3];

  const getPlaybookPath = (command) => {
    switch (command) {
      case "lockdown":
        return path.join(__dirname, "lockdown.yml");
      case "provision":
        return path.join(__dirname, "provision.yml");
      case "deploy":
        return path.join(__dirname, "deploy.yml");
      default:
        return null;
    }
  };

  const playbookPath = getPlaybookPath(command);

  if (playbookPath === null) {
    console.error(`
Invalid diy-deploy command provided (${command}). Allowed options are:
  - lockdown
  - provision
  - deploy
  `);
    process.exitCode = 1;
    return;
  }
  if (inventoryFile === undefined) {
    console.error(
      `Invalid path to an ansible inventory path provided (${inventoryFile}).`
    );
    process.exitCode = 1;
    return;
  }
  try {
    spawn(
      "ansible-playbook",
      ["-i", path.join(process.cwd(), inventoryFile), playbookPath],
      { stdio: "inherit" }
    );
  } catch (e) {
    console.error(e);
    process.exitCode(1);
  }
};

run();
