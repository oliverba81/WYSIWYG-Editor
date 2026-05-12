# wysiwyg-editor

TypeScript WYSIWYG editor with a vanilla `Editor` class and an optional React wrapper for Next.js and other React 18 apps.

## React / Next.js

### Client-only usage

- Mark the parent file or route segment with **`'use client'`** when you use `<WysiwygEditor />`.
- The wrapper loads the core with **`import()`** on mount so the main bundle stays small.

### Styles

Import the stylesheet once (typically in a client layout or the same module as the editor):

```ts
import 'wysiwyg-editor/style.css';
```

The dynamic import of the main entry may pull in CSS as well; an explicit `style.css` import keeps behavior obvious.

### Monorepo / local package (`transpilePackages`)

If you depend on this package from a workspace (e.g. `packages/wysiwyg-editor`), add the package **`name` from its `package.json`** (e.g. `wysiwyg-editor`) to `transpilePackages` in `next.config.mjs` or `next.config.js` when Next would otherwise skip transpilation. This applies to both **App Router** and **Pages Router**.

### `WysiwygEditor` props (SignatureEditor-style)

| Prop | Role |
|------|------|
| `value` / `onChange` | **Controlled** when `value` is defined: external HTML stays in sync. Omit `value` and use `defaultValue` for an **uncontrolled** editor (no forced resets on parent re-renders). If both are set, `value` wins once it is defined. |
| `placeholder`, `minHeight` | Passed through to `EditorOptions` at **mount** only. |
| `disabled` | Maps to `editor.setReadonly(true)` together with `readonly` (**OR** semantics). |
| `focusOnMount` | Passed as core `autofocus`. |
| `focusTrigger` | Boolean; focus runs on the transition to `true` (e.g. tab became active), including the first time the editor becomes ready if `focusTrigger` is already `true`. |
| `onReady` | Fired in a **microtask** after the instance is attached — do **not** also pass `onReady` into the core via spread (the wrapper does not forward it) to avoid double “ready” logic. |
| `onChangeDebounceMs` | Optional; default **300**. Use **0** for immediate `onChange` (validation/counters). |

### Imperative ref (`WysiwygEditorHandle`)

`ref` exposes: `getEditor()`, `focus()`, `blur()`, `setReadonly(boolean)`, `getHTML()`, `destroy()`. After `destroy()`, the internal ref is cleared so React strict-mode cleanup stays idempotent.

### Locale

The wrapper defaults to **`locale: 'de'`** unless you override it.

### Empty HTML and host helpers

`Editor.getHTML()` in an empty document often matches patterns such as `''`, `<br>`, `<p></p>`, or `<p><br></p>` depending on the browser. The core’s `isEmptyEditor` (see `DOMUtils`) treats those as empty using `innerText.trim()` — note that content consisting only of **`&nbsp;`** or zero-width characters may **not** count as empty. Align your host helper (e.g. `isEmptyEditorHtml`) with these cases.

### Controlled typing and cursor

If the parent updates `value` on every keystroke with a noticeable delay, the selection can jump. Prefer **`onChangeDebounceMs: 0`** with fast state updates, or accept debounced parent `value` updates.

### IME / composition

While composing CJK (IME), `onChange` is suppressed per keystroke and flushed after composition ends and on blur (pending debounced changes are cancelled and the latest HTML is sent).

### Sanitize and images

With default **`sanitize: true`**, paste uses the internal sanitizer. **`onImageUpload`** is optional: without it, pasted/dropped images may become **data URLs** (see `ImagePlugin`); document size limits for your mail product.

### Manual checks

1. External `value` updates the editor without an update loop when HTML matches.
2. `disabled` toggles readonly/toolbar behavior.
3. `focusTrigger` `false` → `true` focuses the editor; repeated `true` does not mis-focus.
4. `onChangeDebounceMs: 0` vs default debounce; blur leaves no “lost” last characters.
5. Strict Mode: no duplicate editors or crashes after unmount.
6. Unmount during `import()` does not create an editor; host `onReady` does not run.
7. Init failure does not leave `editorReady` stuck true.
8. Uncontrolled mode: only `defaultValue`, no continuous overwrites from React.
9. Unmount with pending debounce: no `onChange` after `destroy`.

## Core (`Editor`)

See `src/core/Editor.ts` for the full API (`setHTML`, `getHTML`, `setReadonly`, `focus`, `destroy`, …).

## License

See repository metadata.
