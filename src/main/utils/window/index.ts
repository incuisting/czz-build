import { BrowserWindow } from 'electron';
import { loadDevTools } from './devTools';
import { loadUrl } from './protocol';

export interface WindowOpts {
  /**
   * URL
   */
  name: Main.WindowName;
  title?: string;
  width?: number;
  height?: number;
  devTools?: boolean;
  resizable?: boolean;
  /**
   * 允许 renderer 进行使用 remote 模块
   */
  remote?: boolean;
  // window 下 工具栏配置
  frame?: boolean;
}

/**
 * 构建 BrowserWindows 对象的方法
 * @param opts { WindowOpts }
 */

export const createWindow = (opts: WindowOpts) => {
  const { name, title, width, height, devTools, remote, resizable, frame } =
    opts;
  const windows = new BrowserWindow({
    width,
    height,
    title,
    resizable,
    frame,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: remote,
      // 上下文隔离环境
      // https://www.electronjs.org/docs/tutorial/context-isolation
      contextIsolation: false,
      // devTools: isDev,
    },
  });

  loadUrl(windows, name);

  loadDevTools();

  // 显示 devtools 就打开
  if (devTools) {
    windows.webContents.openDevTools();
  }
  return windows;
};
