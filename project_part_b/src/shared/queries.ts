export const GET_TRANSACTIONS_DATA = `
query GET_TRANSACTIONS_DATA ($afterTime: ISO8601DateTime, $offset: Int) {
  ethereum {
    transactions(time: {after: $afterTime}, options: {limit: 10, offset: $offset}) {
      gas
      sender {
        address
      }
      to {
        address
      }
      amount
      success
      block {
        height
      }
      hash
    }
  }
}
`;

export const GET_BLOCKS_DATA = `
query GET_BLOCKS_DATA ($offset: Int) {
  ethereum {
    blocks(options: {limit: 10, offset: $offset}) {
      hash
      height
      reward
      transactionCount
      size
      gasUsed
    }
  }
}
`;

export const GET_COUNT = `
query GET_COUNT ($afterTime: ISO8601DateTime) {
  ethereum {
    blocks {
      count
      gasUsed
    }
    transactions(time: {after: $afterTime}) {
      amount
      count
    }
  }
}
`;
