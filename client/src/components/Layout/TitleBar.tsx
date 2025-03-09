import { useCallback } from 'react';

// Declare the electron API types
declare global {
  interface Window {
    electron: {
      minimize: () => void;
      maximize: () => void;
      close: () => void;
    };
  }
}

export function TitleBar() {
  const handleMinimize = useCallback(() => {
    window.electron?.minimize();
  }, []);

  const handleMaximize = useCallback(() => {
    window.electron?.maximize();
  }, []);

  const handleClose = useCallback(() => {
    window.electron?.close();
  }, []);

  return (
    <div id="titlebar" className="fixed top-0 left-0 right-0 h-8 bg-[#f0f0f0] flex justify-end items-center -webkit-app-region-drag z-50">
      <div id="window-controls" className="flex -webkit-app-region-no-drag">
        <button onClick={handleMinimize} className="w-12 h-8 bg-transparent border-none text-gray-700 hover:bg-gray-200 flex items-center justify-center">
          <i className="material-icons text-xs">remove</i>
        </button>
        <button onClick={handleMaximize} className="w-12 h-8 bg-transparent border-none text-gray-700 hover:bg-gray-200 flex items-center justify-center">
          <i className="material-icons text-xs">crop_square</i>
        </button>
        <button onClick={handleClose} className="w-12 h-8 bg-transparent border-none text-gray-700 hover:bg-red-600 hover:text-white flex items-center justify-center">
          <i className="material-icons text-xs">close</i>
        </button>
      </div>
    </div>
  );
}