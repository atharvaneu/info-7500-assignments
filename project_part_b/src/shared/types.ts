export interface TableColumnType {
    txnHash: string;
    senderHash: string;
    receiverHash: string;
    amount: string;
    success: boolean;
    blockNumber: string;
    gas: string;
}

export interface BlocksColumnType {
    blockHash: string;
    blockNumber: string;
    reward: string;
    txnCount: string;
    blockSize: string;
    gasUsed: string;
}


export interface CardDetailsType {
    blocks: string;
    gas: string;
    txns: string;
}
