import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: false,
    // Emulator state (Firestore) is shared across files. Run tests
    // sequentially to avoid clearFirestore() races between suites.
    fileParallelism: false,
  },
});
