// Allow Next.js to select its WebAssembly compiler on macOS hosts that reject
// the downloaded native SWC binary because of its code signature.
if (process.platform === 'darwin' && !process.versions.webcontainer) {
  process.versions.webcontainer = 'codex-preview';
}
