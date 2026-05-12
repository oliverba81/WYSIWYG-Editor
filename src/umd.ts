import { injectStyles } from './styles/inject';
injectStyles();
export { Editor } from './core/Editor';
export { createEditor } from './core/EditorFactory';
export { BasePlugin } from './plugins/BasePlugin';
export type { EditorOptions } from './core/types';
