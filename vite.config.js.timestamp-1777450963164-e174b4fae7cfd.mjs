// vite.config.js
import { defineConfig } from "file:///D:/MyProgect/Portfolio/node_modules/vite/dist/node/index.js";
import react from "file:///D:/MyProgect/Portfolio/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    /* Split heavyweight third-party libs into a stable `vendor` chunk so the
       browser can keep them in cache across portfolio code updates. The app
       chunk shrinks proportionally and re-downloads only when our source
       actually changes. */
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          "styled-vendor": ["styled-components"]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxNeVByb2dlY3RcXFxcUG9ydGZvbGlvXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxNeVByb2dlY3RcXFxcUG9ydGZvbGlvXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9NeVByb2dlY3QvUG9ydGZvbGlvL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gICAgc2VydmVyOiB7XG4gICAgICAgIHBvcnQ6IDUxNzMsXG4gICAgICAgIGhvc3Q6IHRydWUsXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICAvKiBTcGxpdCBoZWF2eXdlaWdodCB0aGlyZC1wYXJ0eSBsaWJzIGludG8gYSBzdGFibGUgYHZlbmRvcmAgY2h1bmsgc28gdGhlXG4gICAgICAgICAgIGJyb3dzZXIgY2FuIGtlZXAgdGhlbSBpbiBjYWNoZSBhY3Jvc3MgcG9ydGZvbGlvIGNvZGUgdXBkYXRlcy4gVGhlIGFwcFxuICAgICAgICAgICBjaHVuayBzaHJpbmtzIHByb3BvcnRpb25hbGx5IGFuZCByZS1kb3dubG9hZHMgb25seSB3aGVuIG91ciBzb3VyY2VcbiAgICAgICAgICAgYWN0dWFsbHkgY2hhbmdlcy4gKi9cbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgb3V0cHV0OiB7XG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbSddLFxuICAgICAgICAgICAgICAgICAgICAnc3R5bGVkLXZlbmRvcic6IFsnc3R5bGVkLWNvbXBvbmVudHMnXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTBQLFNBQVMsb0JBQW9CO0FBQ3ZSLE9BQU8sV0FBVztBQUNsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLElBS0gsZUFBZTtBQUFBLE1BQ1gsUUFBUTtBQUFBLFFBQ0osY0FBYztBQUFBLFVBQ1YsZ0JBQWdCLENBQUMsU0FBUyxXQUFXO0FBQUEsVUFDckMsaUJBQWlCLENBQUMsbUJBQW1CO0FBQUEsUUFDekM7QUFBQSxNQUNKO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
