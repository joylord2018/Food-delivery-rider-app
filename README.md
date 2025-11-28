# Food-delivery-rider-app

## 项目简介

Food-delivery-rider-app 是一个基于 Vue 3 + TypeScript + Vite 开发的外卖骑手应用，旨在为外卖骑手提供便捷的订单管理、任务跟踪、收益查看等功能。

## 技术栈

- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI组件库**: Vant
- **路由管理**: Vue Router
- **模拟数据**: Mock.js

## 主要功能

### 1. 订单管理
- 待接任务列表
- 已接任务列表
- 已完成任务列表
- 订单历史记录

### 2. 任务跟踪
- 实时任务状态更新
- 任务详情查看
- 任务完成确认

### 3. 收益管理
- 实时收益查看
- 收益记录列表
- 收益统计分析

### 4. 工作统计
- 订单数量统计
- 工作时长统计
- 收益统计

### 5. 天气安全
- 实时天气信息
- 安全提示
- 天气预警

### 6. 个人中心
- 在线状态切换
- 请假申请
- 设置管理

### 7. 通知中心
- 系统通知
- 订单通知
- 消息管理

## 项目结构

```
src/
├── assets/           # 静态资源
├── components/       # 公共组件
├── mock/             # 模拟数据
├── router/           # 路由配置
├── stores/           # Pinia状态管理
├── views/            # 页面组件
│   ├── Home.vue      # 首页
│   ├── Earnings.vue  # 收益页面
│   ├── OrderHistory.vue  # 订单历史
│   ├── Statistics.vue    # 工作统计
│   ├── WeatherSafety.vue # 天气安全
│   ├── LeaveRequest.vue  # 请假申请
│   ├── CustomerService.vue # 客服
│   ├── NotificationCenter.vue # 通知中心
│   └── Settings.vue  # 设置页面
├── App.vue           # 根组件
└── main.ts           # 入口文件
```

## 安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 开发说明

### 模拟数据

项目使用 Mock.js 生成模拟数据，包括：
- 任务列表数据（待接、已接、已完成）
- 收益记录数据
- 天气信息数据

模拟数据配置位于 `src/mock/index.ts`，可以根据需要修改或扩展。

### 路由配置

所有页面路由配置位于 `src/router/index.ts`，包括：
- 底部导航路由
- 页面跳转路由
- 嵌套路由

### 状态管理

使用 Pinia 进行状态管理，主要包括：
- 任务状态管理
- 用户状态管理
- 天气数据管理

## 许可证

MIT License