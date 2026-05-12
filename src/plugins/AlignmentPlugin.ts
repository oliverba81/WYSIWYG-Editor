import { BasePlugin } from './BasePlugin';

export class AlignmentPlugin extends BasePlugin {
  readonly name = 'Alignment';

  init(): void {
    this.registerCommand('alignLeft', () => document.execCommand('justifyLeft'));
    this.registerCommand('alignCenter', () => document.execCommand('justifyCenter'));
    this.registerCommand('alignRight', () => document.execCommand('justifyRight'));
    this.registerCommand('alignJustify', () => document.execCommand('justifyFull'));
  }

  destroy(): void {}
}
