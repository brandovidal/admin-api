# Node Typescript Prisma Mongo Skeleton

This project contains a minimal starter for Node.js project with Typescript, ESLint, TS-Standard and Nodemon already configured

## 🚀 Project Structure

Inside of your project, you'll see the following folders and files:

```css
/
├── __test__/
├── build/
├── prisma/
│   └── schema.prisma
├── src/
│   └── delete-data.ts
│   └── index.ts
│   └── insert-data.ts
│   └── retrieve-data.ts
│   └── update-data.ts
├── .eslintignore
├── .eslintrc.json
├── .gitignore
├── package.json
├── README.md
├── tsconfig.json
```

## 💻 Prerequisites

- Node.js 12+
- Yarn or pnpm

👾 Necesary environment variables:

Copy the `.env.example` file to `.env` and fill in the required environment variables.
Replicate the `.env.example` file to `.env.test` and fill in the required environment variables.
Replicate the `.env.example` file to `.env.dev` and fill in the required environment variables.
Use pnpm to install the dependencies https://pnpm.io/es/installation.

## 📖 How to use

- ⚡ Install dependencies

```bash
pnpm install
```

- 📂 Run prisma

```bash
npx prisma generate
```

- ⚒️ Run development App

```bash
pnpm run dev
```

- 🚀 Start App

```bash
pnpm run start
```

- 🔦 Run Lint

```bash
pnpm run lint
```

- 👾 Run test

```bash
pnpm run test
```
