// const { app, BrowserWindow, ipcMain } = require('electron');
// const serve = require('electron-serve');
// const path = require('path');

// const appServe = app.isPackaged ? serve({
//     directory: path.join(__dirname, '../out')
// }) : null;

// const createWindow = () => {
//     const mainWindow = new BrowserWindow({
//         width: 350,
//         height: 200,
//         webPreferences: {
//             nodeIntegration: false,
//             contextIsolation: true,
//             preload: path.join(__dirname, 'preload.js') // preload 스크립트 추가
//         },
//         frame: false, // 프레임 없는 창
//         alwaysOnTop: true, // 항상 맨 위에
//         resizable: false, // 크기 조절 불가
//         skipTaskbar: true, // 작업표시줄에 표시 안함
//         title: "CTI Task Master"
//     });

//     if (app.isPackaged) {
//         appServe(mainWindow).then(() => {
//             mainWindow.loadURL('app://-');
//         });
//     } else {
//         mainWindow.loadURL('http://localhost:3000');
//         mainWindow.webContents.openDevTools();
//     }

//     // 닫기 버튼 이벤트 처리
//     ipcMain.handle('close-app', () => {
//         mainWindow.close();
//     });
// };

// app.whenReady().then(createWindow);

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow();
//     }
// });

// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');

// // electron-serve를 직접 사용하지 말고 간단하게 처리
// const createWindow = () => {
//     const mainWindow = new BrowserWindow({
//         width: 350,
//         height: 200,
//         webPreferences: {
//             nodeIntegration: false,
//             contextIsolation: true,
//             preload: path.join(__dirname, 'preload.js')
//         },
//         frame: false,
//         alwaysOnTop: true,
//         resizable: false,
//         skipTaskbar: true,
//         title: "CTI Task Master"
//     });

//     // 패키지된 앱에서는 out 폴더의 index.html 로드
//     if (app.isPackaged) {
//         mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
//     } else {
//         mainWindow.loadURL('http://localhost:3000');
//         mainWindow.webContents.openDevTools();
//     }

//     // 닫기 버튼 이벤트 처리
//     ipcMain.handle('close-app', () => {
//         mainWindow.close();
//     });
// };

// app.whenReady().then(() => {
//     createWindow();
// });

// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     }
// });

// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow();
//     }
// });

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { protocol } = require('electron');

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 350,
        height: 200,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webSecurity: false // 개발용으로 임시 추가
        },
        frame: false,
        alwaysOnTop: true,
        resizable: false,
        skipTaskbar: true,
        title: "CTI Task Master"
    });

    // 패키지된 앱에서는 out 폴더의 index.html 로드
    if (app.isPackaged) {
        const indexPath = path.join(__dirname, '../out/index.html');
        console.log('Loading from:', indexPath);
        mainWindow.loadFile(indexPath);
    } else {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }

    // 닫기 버튼 이벤트 처리
    ipcMain.handle('close-app', () => {
        mainWindow.close();
    });
};

app.whenReady().then(() => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});