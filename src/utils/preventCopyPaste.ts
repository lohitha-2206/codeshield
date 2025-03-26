export const preventCopyPaste = (e: ClipboardEvent) => {
  e.preventDefault();
  return false;
};