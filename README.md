<div align="center">
  <img src="assets/logo.svg" alt="AI Tweet Scheduler" width="680"/>

  # AI Tweet Scheduler

  **AI 驱动的 Twitter 定时发推系统**

  [![Python](https://img.shields.io/badge/Python-3.8+-3776ab?style=flat-square&logo=python&logoColor=white)](https://python.org)
  [![Flask](https://img.shields.io/badge/Flask-Backend-000000?style=flat-square&logo=flask)](https://flask.palletsprojects.com)
  [![Twitter](https://img.shields.io/badge/Twitter-API_v2-1da1f2?style=flat-square&logo=twitter)](https://developer.twitter.com)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
</div>

---

## 项目概述

AI Tweet Scheduler 是一个基于 Flask + APScheduler + Tweepy 的 Twitter 定时发推系统。系统内置学术论文段落作为推文素材库，通过 SiliconFlow AI（Qwen2.5-7B 模型）对文本进行学术润色后发布到 Twitter。支持定时发布（指定时间点）和周期性发布（固定间隔）两种模式，提供完整的 REST API 接口用于任务管理。

## 技术栈

- **Flask**: Web 后端框架
- **APScheduler**: 定时任务调度器（BackgroundScheduler，Asia/Shanghai 时区）
- **Tweepy**: Twitter API v2 Python 客户端
- **SiliconFlow API**: AI 文本润色（Qwen/Qwen2.5-7B-Instruct 模型）
- **Flask-CORS**: 跨域资源共享支持
- **python-dateutil**: 日期时间解析

## 功能特性

- **AI 文本润色** -- 调用 SiliconFlow AI（Qwen2.5-7B）对推文内容进行学术润色，补充和优化不通顺的句子
- **定时发布** -- 指定精确时间点发布推文（ISO 格式时间字符串）
- **周期性发布** -- 按固定间隔（秒）循环发布推文
- **即时发布** -- 立即发送推文到 Twitter
- **随机素材** -- 从内置学术论文段落库中随机选取一段，经 AI 润色后返回
- **任务管理** -- 查看所有定时任务列表、取消指定任务
- **前后端分离** -- Flask 提供 REST API，支持任意前端对接

## 安装说明

1. 克隆仓库到本地：
   ```bash
   git clone https://github.com/Past-Tang/ai-tweet-scheduler.git
   cd ai-tweet-scheduler
   ```

2. 安装依赖：
   ```bash
   pip install flask apscheduler tweepy flask-cors requests python-dateutil
   ```

3. 配置 Twitter API 密钥：
   编辑 `Twitter/config.txt`：
   ```
   TWITTER_API_KEY=your_twitter_api_key_here
   TWITTER_API_SECRET_KEY=your_twitter_api_secret_key_here
   TWITTER_ACCESS_TOKEN=your_twitter_access_token_here
   TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret_here
   ```

## 使用方法

1. 启动后端服务：
   ```bash
   cd Twitter
   python app.py
   ```

2. 服务启动后访问 `http://localhost:5000`

3. 通过 API 接口操作：

### 即时发送推文
```bash
curl -X POST http://localhost:5000/send \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello Twitter!"}'
```

### 定时发送推文
```bash
curl -X POST http://localhost:5000/start \
  -H "Content-Type: application/json" \
  -d '{"content": "定时推文", "schedule_type": "time", "time": "2025-01-01T12:00:00"}'
```

### 周期性发送推文
```bash
curl -X POST http://localhost:5000/start \
  -H "Content-Type: application/json" \
  -d '{"content": "周期推文", "schedule_type": "interval", "interval": 3600}'
```

### 获取随机 AI 润色文本
```bash
curl http://localhost:5000/random_text
```

### 查看所有定时任务
```bash
curl http://localhost:5000/tasks
```

### 取消定时任务
```bash
curl -X POST http://localhost:5000/stop \
  -H "Content-Type: application/json" \
  -d '{"job_id": "your_job_id"}'
```

## API 接口

| 接口 | 方法 | 参数 | 说明 |
|:---|:---|:---|:---|
| `/` | GET | - | 健康检查 |
| `/send` | POST | `{content}` | 即时发送推文 |
| `/start` | POST | `{content, schedule_type, time/interval}` | 创建定时/周期任务 |
| `/stop` | POST | `{job_id}` | 取消定时任务 |
| `/tasks` | GET | - | 获取所有任务列表 |
| `/random_text` | GET | - | 获取随机 AI 润色文本 |

### 定时类型

| schedule_type | 参数 | 说明 |
|:---|:---|:---|
| `time` | `time` (ISO 格式) | 指定时间点执行一次 |
| `interval` | `interval` (秒) | 按固定间隔循环执行 |

## 配置说明

### Twitter API (`config.txt`)

```
TWITTER_API_KEY=你的API Key
TWITTER_API_SECRET_KEY=你的API Secret Key
TWITTER_ACCESS_TOKEN=你的Access Token
TWITTER_ACCESS_TOKEN_SECRET=你的Access Token Secret
```

### AI 润色服务

系统使用 SiliconFlow API 调用 Qwen2.5-7B-Instruct 模型进行文本润色。润色 Prompt 为英文学术润色模式，会补充和优化不通顺的句子。

## 项目结构

```
ai-tweet-scheduler/
├── Twitter/
│   ├── app.py             # Flask 主应用（299行）
│   │   ├── /send          # 即时发送推文
│   │   ├── /start         # 创建定时/周期任务
│   │   ├── /stop          # 取消定时任务
│   │   ├── /tasks         # 查看任务列表
│   │   ├── /random_text   # 随机 AI 润色文本
│   │   ├── translate_text()  # SiliconFlow AI 润色函数
│   │   └── send_tweet()   # Tweepy 发推函数
│   └── config.txt         # Twitter API 密钥配置
├── assets/
│   └── logo.svg           # 项目 Logo
├── LICENSE                # MIT 许可证
└── README.md
```

## 依赖项

| 包 | 用途 |
|:---|:---|
| flask | Web 后端框架 |
| apscheduler | 定时任务调度 |
| tweepy | Twitter API v2 客户端 |
| flask-cors | 跨域支持 |
| requests | HTTP 请求（AI API） |
| python-dateutil | 日期时间解析 |

## 常见问题

### Twitter API 认证失败？
确保 `config.txt` 中的四个密钥正确，且 Twitter Developer Portal 中已启用 OAuth 1.0a 和读写权限。

### AI 润色返回空结果？
检查 SiliconFlow API 密钥是否有效，以及网络是否可以访问 `api.siliconflow.cn`。

### 定时任务不执行？
APScheduler 使用 `Asia/Shanghai` 时区，确保传入的时间字符串与该时区一致。

## 安全注意事项

- Twitter API 密钥存储在本地 `config.txt` 中，请勿提交到公开仓库
- SiliconFlow API 密钥硬编码在代码中，生产环境应迁移到环境变量
- 建议使用 Twitter 开发者账号的测试环境进行调试

## 许可证

[MIT License](LICENSE)

## 免责声明

本项目仅供学习研究使用。请遵守 Twitter 平台使用规则和 API 服务条款，不得用于垃圾信息发布或自动化违规操作。