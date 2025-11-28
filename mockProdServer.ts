// mockProdServer.ts
import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer';

// 导入所有mock模块
const modules = import.meta.globEager('./mock/**/*.ts');

const mockModules: any[] = [];
for (const path in modules) {
  mockModules.push(...modules[path].default);
}

// 创建生产环境mock服务器
export function setupProdMockServer() {
  createProdMockServer(mockModules);
}
