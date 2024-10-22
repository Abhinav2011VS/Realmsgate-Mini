const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

let settings = {};

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 300,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'favicon.png')
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('verify-minecraft', async () => {
    const mcPath = getMinecraftPath();
    console.log('Verifying Minecraft installation...');
    if (!fs.existsSync(mcPath)) {
        console.log('Minecraft directory not found. Creating...');
        createMinecraftDirectory(mcPath);
        return 'Minecraft directory not found. Creating...';
    }
    console.log('Minecraft installation verified!');
    return 'Minecraft installation verified!';
});

ipcMain.handle('save-settings', async (event, userSettings) => {
    settings = userSettings;
    const settingsPath = path.join(getMinecraftPath(), 'realmsgate_settings.json');
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
});

ipcMain.handle('load-settings', async () => {
    const settingsPath = path.join(getMinecraftPath(), 'realmsgate_settings.json');
    if (fs.existsSync(settingsPath)) {
        return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }
    return null;
});

ipcMain.handle('launch-minecraft', async (event, settings) => {
    console.log('Launching Minecraft with settings:', settings);
    
    // Prepare command to launch Minecraft
    const mcDir = getMinecraftPath();
    const gameVersion = settings.version || '1.21.1';
    const playerName = settings.username;
    const windowWidth = 800;
    const windowHeight = 640;

    const javaPath = await downloadJavaIfNeeded(); // Ensure Java is installed

    // Launch Minecraft
    const spawn = require('child_process').spawn;
    const command = `${javaPath} -Xmx2G -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -Djava.library.path=${path.join(mcDir, 'bin', gameVersion)} -cp ${generateLibrariesList(mcDir, gameVersion)} net.minecraft.client.main.Main --username ${playerName} --version ${gameVersion} --gameDir ${mcDir} --width ${windowWidth} --height ${windowHeight}`;
    spawn(command, { shell: true });
});

function getMinecraftPath() {
    switch (os.platform()) {
        case 'win32':
            return path.join(process.env.APPDATA, '.minecraft');
        case 'darwin':
            return path.join(os.homedir(), 'Library', 'Application Support', 'minecraft');
        case 'linux':
            return path.join(os.homedir(), '.minecraft');
        default:
            throw new Error('Unsupported OS');
    }
}

function createMinecraftDirectory(mcPath) {
    fs.mkdirSync(mcPath, { recursive: true });
    fs.mkdirSync(path.join(mcPath, 'assets'), { recursive: true });
    fs.mkdirSync(path.join(mcPath, 'saves'), { recursive: true });
    fs.mkdirSync(path.join(mcPath, 'resourcepacks'), { recursive: true });
    fs.mkdirSync(path.join(mcPath, 'mods'), { recursive: true });
    fs.mkdirSync(path.join(mcPath, 'versions'), { recursive: true });
}

async function downloadJavaIfNeeded() {
    // Add logic to check if Java is installed; if not, download Java 21
    // Return the path to the Java executable
}

function generateLibrariesList(mcDir, version) {
    // Logic to generate the libraries list for Minecraft
    return ''; // Return a string containing all libraries paths
}
