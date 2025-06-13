# CTI Task Manager

Next.js + Electron으로 만든 간단한 CTI 업무용 상태창 애플리케이션

## 📋 프로젝트 개요

- **프로젝트명**: CTI Task Master
- **기술 스택**: Next.js, Electron, TypeScript, Tailwind CSS
- **기능**: 상태 관리(대기중/통화중/후처리), 실시간 시계, 처리 건수 카운트
- **특징**: 항상 맨 위에 표시, 드래그로 이동 가능, 프레임리스 창

## 🚀 프로젝트 설정

### 1. 프로젝트 생성

```bash
# 새 디렉토리 생성 및 이동
mkdir cti-task-master
cd cti-task-master

# Next.js 프로젝트 생성 (대화형)
npx create-next-app@latest .
```

**설치 시 선택사항:**
- TypeScript: ✅ Yes
- ESLint: ✅ Yes  
- Tailwind CSS: ✅ Yes
- src/ directory: ✅ Yes
- App Router: ✅ Yes
- Custom import alias: ❌ No

### 2. Electron 패키지 설치

```bash
# Electron 관련 패키지 설치
npm install --save-dev electron electron-builder wait-on concurrently
npm install electron-serve
```

### 3. 프로젝트 구조

```
cti-task-master/
├── src/
│   └── app/
│       └── page.tsx
├── electron/
│   ├── main.js
│   └── preload.js
├── next.config.js
├── package.json
└── README.md
```

## ⚙️ 설정 파일

### package.json 수정

```json
{
  "name": "cti-task-manager",
  "version": "0.1.0",
  "private": true,
  "main": "electron/main.js",
  "homepage": "./",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "electron": "wait-on tcp:3000 && electron .",
    "electron-dev": "concurrently \"npm run dev\" \"npm run electron\"",
    "electron-pack": "npm run build && electron-builder"
  },
  "build": {
    "appId": "com.cti.taskmaster",
    "productName": "CTI Task Master",
    "directories": {
      "output": "dist"
    },
    "files": [
      "out/**/*",
      "electron/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
```

### electron/main.js

```javascript
const { app, BrowserWindow, ipcMain } = require('electron');
const serve = require('electron-serve');
const path = require('path');

const appServe = app.isPackaged ? serve({
    directory: path.join(__dirname, '../out')
}) : null;

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 350,
        height: 200,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
        frame: false, // 프레임 없는 창
        alwaysOnTop: true, // 항상 맨 위에
        resizable: false, // 크기 조절 불가
        skipTaskbar: true, // 작업표시줄에 표시 안함
        title: "CTI Task Master"
    });

    if (app.isPackaged) {
        appServe(mainWindow).then(() => {
            mainWindow.loadURL('app://-');
        });
    } else {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }

    // 닫기 버튼 이벤트 처리
    ipcMain.handle('close-app', () => {
        mainWindow.close();
    });
};

app.whenReady().then(createWindow);

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
```

### electron/preload.js

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    closeApp: () => ipcRenderer.invoke('close-app')
});
```

## 🎨 주요 기능

### 상태 관리
- **대기중** (파란색): 초기 상태
- **통화중** (빨간색): 통화 진행 중
- **후처리** (노란색): 통화 후 업무 처리
- 상태 클릭으로 순환 변경 가능

### UI 특징
- 실시간 시계 표시
- 처리 완료 건수 카운트
- 드래그로 창 이동 가능
- 오른쪽 상단 닫기 버튼
- 항상 화면 최상단에 표시

## 🔧 개발 및 빌드

### 개발 모드 실행

```bash
npm run electron-dev
```

### 프로덕션 빌드

```bash
npm run electron-pack
```

빌드 완료 후 `dist` 폴더에 설치 파일 생성

## 🐛 문제 해결

### Hydration 오류
- 서버/클라이언트 렌더링 불일치로 인한 오류
- `mounted` 상태로 해결

### TypeScript 오류
- `WebkitAppRegion` 속성: `as React.CSSProperties` 사용

### 빌드 오류 해결방법

**Python/Visual Studio 관련 오류:**
```bash
npm install --global --production windows-build-tools
```

**권한 문제:**
- 관리자 권한으로 명령 프롬프트 실행

**경로 문제:**
```bash
npm rebuild
```

## 📁 파일 구조

```
cti-task-master/
├── dist/                     # 빌드 결과물
├── electron/
│   ├── main.js              # Electron 메인 프로세스
│   └── preload.js           # 프리로드 스크립트
├── out/                     # Next.js 빌드 결과
├── src/
│   └── app/
│       └── page.tsx         # 메인 UI 컴포넌트
├── next.config.js           # Next.js 설정
├── package.json             # 프로젝트 설정
└── README.md               # 이 파일
```

## 🚀 실행 방법

1. 의존성 설치: `npm install`
2. 개발 모드: `npm run electron-dev`
3. 빌드: `npm run electron-pack`
4. 생성된 exe 파일 실행

## 📝 라이센스

파일럿 프로젝트