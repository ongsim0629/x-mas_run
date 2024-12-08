import { defineConfig } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true, // 빌드 후 자동으로 브라우저에서 열기
      filename: 'stats.html', // 출력 파일명
      template: 'treemap', // treemap, sunburst, network
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        dead_code: true,
        unused: true,
        drop_console: true,
        if_return: true,
        pure_funcs: ['console.log'],
        collapse_vars: true,
        reduce_vars: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          rapier: ['@react-three/rapier'],
          fiber: ['@react-three/fiber'],
          drei: ['@react-three/drei'],
          // React 코어
          react: ['react', 'react-dom', 'react-error-boundary'],
          // 상태관리/데이터
          state: ['jotai', '@tanstack/react-query'],
          // 애니메이션/UI
          animation: ['gsap'],
          ui: ['react-toastify', 'leva'],
          // 네트워킹
          networking: ['socket.io-client'],
        },
        // 청크 파일명 패턴 설정
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    // 추가 빌드 옵션
    target: 'es2015', // 호환성 타겟
    sourcemap: false, // 프로덕션 빌드시 소스맵 비활성화
  },
});
