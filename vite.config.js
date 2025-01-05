import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// // https://vitejs.dev/config/
// export default defineConfig({
//     plugins: [vue()],
// });

export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0', // 외부 네트워크에서 접근 가능하게 설정    
    port: 5173,      // Vite의 기본 포트
    open: true,
    }  
});