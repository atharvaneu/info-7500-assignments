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
query GET_BLOCKS_DATA ($afterTime: ISO8601DateTime, $offset: Int) {
  ethereum {
    blocks(date: {after: $afterTime}, options: {limit: 10, offset: $offset}) {
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
