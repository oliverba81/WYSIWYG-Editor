import { BasePlugin } from './BasePlugin';
import { Modal } from '../ui/Modal';
import { t } from '../core/i18n';

const MAX_SIZE = 10 * 1024 * 1024;

export class ImagePlugin extends BasePlugin {
  readonly name = 'Image';

  init(): void {
    this.registerCommand('insertImage', () => this._openModal());
    this.registerCommand('insertImageFile', (args) => this._insertFile(args as File));
  }

  private _openModal(): void {
    this.editor.selection.saveRange();

    const form = document.createElement('div');
    form.className = 'wysiwyg-form';

    const urlInput = this._input('text', t('imageUrl'));
    const altInput = this._input('text', t('altText'));
    const titleInput = this._input('text', t('imageTitle'));
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.className = 'wysiwyg-file-input';

    fileInput.addEventListener('change', () => {
      const file = fileInput.files?.[0];
      if (file) {
        if (file.size > MAX_SIZE) {
          this.editor.options.onError?.({ type: 'imageUpload', message: t('imageTooBig') });
          return;
        }
        const reader = new FileReader();
        reader.onload = () => { urlInput.value = reader.result as string; };
        reader.readAsDataURL(file);
      }
    });

    form.appendChild(this._row(t('imageUrl'), urlInput));
    form.appendChild(this._row(t('altText'), altInput));
    form.appendChild(this._row(t('imageTitle'), titleInput));
    form.appendChild(this._row(t('uploadFile'), fileInput));

    const modal = new Modal({
      title: t('insertImage'),
      content: form,
      onConfirm: () => {
        const src = urlInput.value.trim();
        if (!src) return;
        this.editor.selection.restoreRange();
        this.editor.focus();
        this._insertFigure(src, altInput.value.trim(), titleInput.value.trim());
        this.editor['_history'].snapshot();
      },
      onCancel: () => { this.editor.selection.restoreRange(); },
    });
    modal.open();
    setTimeout(() => urlInput.focus(), 50);
  }

  _insertFile(file: File): void {
    if (file.size > MAX_SIZE) {
      this.editor.options.onError?.({ type: 'imageUpload', message: t('imageTooBig') });
      return;
    }
    if (this.editor.options.onImageUpload) {
      this.editor.options.onImageUpload(file).then(url => {
        this._insertFigure(url, file.name);
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this._insertFigure(reader.result as string, file.name);
    };
    reader.readAsDataURL(file);
  }

  private _insertFigure(src: string, alt = '', title = ''): void {
    const figure = document.createElement('figure');
    figure.className = 'wysiwyg-figure';
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    if (title) img.title = title;
    const caption = document.createElement('figcaption');
    caption.contentEditable = 'true';
    caption.setAttribute('data-placeholder', t('addCaption'));
    figure.appendChild(img);
    figure.appendChild(caption);

    this._addImageControls(img);

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(figure);
      const p = document.createElement('p');
      p.innerHTML = '<br>';
      figure.after(p);
      const newRange = document.createRange();
      newRange.setStart(p, 0);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } else {
      this.editor.editorEl.appendChild(figure);
    }
  }

  private _addImageControls(img: HTMLImageElement): void {
    img.classList.add('wysiwyg-img');
    img.addEventListener('click', () => {
      document.querySelectorAll('.wysiwyg-img-selected').forEach(e => e.classList.remove('wysiwyg-img-selected'));
      img.classList.add('wysiwyg-img-selected');
      this._showImageToolbar(img);
    });
    document.addEventListener('click', (e) => {
      if (e.target !== img) {
        img.classList.remove('wysiwyg-img-selected');
        document.querySelector('.wysiwyg-img-toolbar')?.remove();
      }
    });
  }

  private _showImageToolbar(img: HTMLImageElement): void {
    document.querySelector('.wysiwyg-img-toolbar')?.remove();
    const toolbar = document.createElement('div');
    toolbar.className = 'wysiwyg-img-toolbar';

    const alignments: Array<{ key: string; label: string }> = [
      { key: 'left', label: '←' },
      { key: 'center', label: '↔' },
      { key: 'right', label: '→' },
      { key: 'full', label: '⬛' },
    ];
    alignments.forEach(({ key, label }) => {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.title = key;
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        img.className = `wysiwyg-img wysiwyg-img-${key}`;
        toolbar.remove();
      });
      toolbar.appendChild(btn);
    });

    const rect = img.getBoundingClientRect();
    toolbar.style.position = 'fixed';
    toolbar.style.top = `${rect.top + window.scrollY - 36}px`;
    toolbar.style.left = `${rect.left + window.scrollX}px`;
    document.body.appendChild(toolbar);
  }

  private _input(type: string, placeholder: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = type;
    input.placeholder = placeholder;
    input.className = 'wysiwyg-input';
    return input;
  }

  private _row(label: string, input: HTMLElement): HTMLElement {
    const row = document.createElement('div');
    row.className = 'wysiwyg-form-row';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    row.appendChild(lbl);
    row.appendChild(input);
    return row;
  }

  destroy(): void {}
}
