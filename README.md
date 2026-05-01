# Jira Watcher Bot

Telegram bot for Jira project monitoring — track issue changes and get instant notifications with team reports, built with NestJS and PostgreSQL.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=flat&logo=telegram&logoColor=white)
![Jira](https://img.shields.io/badge/Jira-0052CC?style=flat&logo=jira&logoColor=white)

## About

Jira Watcher Bot is a full-stack integration service that connects Jira projects with Telegram group chats via webhook events. Add the bot to your team group, link your Jira project and get real-time notifications on issue status changes, assignee updates and task renames — built with NestJS and PostgreSQL.

## Features

- **Telegram bot** — registers users on `/start` and greets them by name
- **Jira webhook** — receives and processes issue events in real time
- **Change tracking** — detects status transitions, assignee changes and summary edits
- **Group notifications** — sends formatted HTML messages to a Telegram group chat
- **User storage** — saves Telegram users to PostgreSQL on first interaction
- **Jira account linking** — optionally link Telegram user to a Jira account
- **Team report** — show how many issues are in progress per group member

## Pages / Flows

| Flow               | Description                                            |
| ------------------ | ------------------------------------------------------ |
| **/start command** | Bot registers user in DB and sends a personal greeting |
| **Jira event**     | Webhook received → parsed → notification sent to group |
| **Report command** | Bot replies with per-member in-progress issue count    |

## API Endpoints

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| `POST` | `/webhook/telegram` | Receive updates from Telegram  |
| `POST` | `/webhook/jira`     | Receive issue events from Jira |

## Tech Stack

| Technology | Purpose                   |
| ---------- | ------------------------- |
| NestJS     | Backend framework         |
| TypeScript | Type safety               |
| TypeORM    | Database ORM              |
| PostgreSQL | User and event storage    |
| Telegraf   | Telegram Bot API client   |
| Axios      | HTTP requests to Jira API |

## Getting Started

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start in development mode
npm run start:dev
```

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_GROUP_CHAT_ID=-100xxxxxxxxx
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=jira_bot
```

> Requires a public HTTPS domain for Telegram and Jira webhooks. If you don't have a server, use [ngrok](https://ngrok.com) for local development.

## Author

Designed and developed by **Ihor Yanchuk**

[Portfolio](https://github.com/Vergos1) · [GitHub](https://github.com/Vergos1)
