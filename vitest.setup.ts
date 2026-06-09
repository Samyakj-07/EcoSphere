import '@testing-library/jest-dom';
// Mock import.meta.env
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_FIREBASE_PROJECT_ID: 'test-project-id',
        VITE_GEMINI_API_KEY: 'test-key'
      }
    }
  }
});
