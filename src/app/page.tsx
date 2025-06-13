'use client';
import { useState, useEffect } from 'react';

declare global {
  interface Window {
    electronAPI: {
      closeApp: () => Promise<void>;
    };
  }
}

export default function CTITaskMaster() {
  const [status, setStatus] = useState<'대기중' | '통화중' | '후처리'>('대기중');
  const [time, setTime] = useState('');
  const [taskCount, setTaskCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date().toLocaleTimeString());

    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextStatus = () => {
    setStatus(prev => {
      if (prev === '대기중') return '통화중';
      if (prev === '통화중') return '후처리';
      return '대기중';
    });

    if (status === '후처리') {
      setTaskCount(prev => prev + 1);
    }
  };

  const handleClose = async () => {
    if (window.electronAPI) {
      await window.electronAPI.closeApp();
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case '대기중': return 'bg-blue-600';
      case '통화중': return 'bg-red-600';
      case '후처리': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  if (!mounted) {
    return (
      <div className="h-screen w-full bg-gray-900 text-white flex flex-col relative">
        {/* 드래그 가능한 헤더 */}
        <div
          className="drag-region h-6 w-full absolute top-0 left-0"
          style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
        ></div>
        {/* 닫기 버튼 */}
        <button
          className="absolute top-1 right-1 w-4 h-4 text-gray-400 hover:text-white hover:bg-red-600 rounded text-xs flex items-center justify-center"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          onClick={handleClose}
        >
          ×
        </button>
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <div className="text-center">
            <h1 className="text-sm font-bold mb-2">CTI Task Master</h1>
            <div className="text-xs mb-2 text-gray-300">로딩중...</div>
            <div className="px-4 py-2 rounded-lg text-sm bg-gray-600">
              대기중
            </div>
            <div className="text-xs mt-2 text-gray-400">
              처리 완료: 0건
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col relative">
      {/* 드래그 가능한 헤더 */}
      <div
        className="drag-region h-6 w-full absolute top-0 left-0"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      ></div>

      {/* 닫기 버튼 */}
      <button
        className="absolute top-1 right-1 w-4 h-4 text-gray-400 hover:text-white hover:bg-red-600 rounded text-xs flex items-center justify-center z-10"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        onClick={handleClose}
      >
        ×
      </button>

      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="text-center">
          <h1 className="text-sm font-bold mb-2">CTI Task Master</h1>
          <div className="text-xs mb-2 text-gray-300">{time}</div>
          <div
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors ${getStatusColor()}`}
            onClick={nextStatus}
            style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
          >
            {status}
          </div>
          <div className="text-xs mt-2 text-gray-400">
            처리 완료: {taskCount}건
          </div>
        </div>
      </div>
    </div>
  );
}