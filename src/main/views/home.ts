import { provide } from 'inversify-binding-decorators';
import { createWindow } from '@/utils';

@provide(HomeWindow)
export class HomeWindow {
  private window: Main.BrowserWindow;

  constructor() {
    this.window = createWindow({
      name: 'home',
      remote: true,
      width: 500,
      height: 600,
      resizable: false,
    });
  }

  show() {
    this.window.show();
  }
}
