
## INFO 7500 - Final project part B

Steps to set assignment on local:
1. Clone the project and move it into the project directory
```bash
  git clone git@github.com:atharvaneu/info-7500-assignments.git

  cd project_part_b
```

2. Install `node_modules`
```bash
  npm install
```

3. Create `.env.local` by referring to `.env.example`
```bash
  touch .env.local
```
Populate the API_KEY and AUTH_TOKEN obtained from BitQuery here

4. Start development server
```bash
  npm run dev
```
_____

About the assignment:

1. The assignment features a dashboard page that displays useful Ethereum analytical data such as total blocks, total gas used ever, total transactions along with real-time transactions and blocks data.

2. Transactions table: contains information such as transaction hash, sender hash, receiver hash, gas used, amount sent, status of transaction, and the block number.
3. Ethereum blocks table: contains information like block hash, block number, reward, number of transactions carried within the lifespan of that block, size, and the gas used by the transactions in that block.

4. Both the tables are implemented with pagination so that users aren't limited to a fixed number of data but can move around.
5. The assignment uses [Next.js](https://nextjs.org/) and uses [shadcn/ui](https://ui.shadcn.com/) for ui components.
6. Because the transaction details in BitQuery API are huge (feasibly impossible to fetch all in a single call), I send an `afterTime` variable that fetches transactions after this time. Currently, I have set this time to <ins>two hours</ins> earlier than the current time.
7. For pagination, I send send an offset variable to the queries that is changed when user clicks `Previous` or `Next`.
