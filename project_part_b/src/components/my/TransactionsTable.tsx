"use client"

import axios from "axios"
import { useEffect, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { GET_TRANSACTIONS_DATA, GET_BLOCKS_DATA} from "@/shared/queries"
import { TableColumnType } from "@/shared/types"

const { log } = console

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
]

export interface DataTableProps {
    className?: string;
}

export function TransactionsTable({ className }: DataTableProps) {
    const [tableData, setTableData] = useState<TableColumnType[]>();

    const fourHoursAgo = new Date(new Date().getTime() - (0.33 * 60 * 60 * 1000));

    // Get the ISO string representation
    const offsetTime = fourHoursAgo.toISOString();

    const data = JSON.stringify({
        "query": GET_TRANSACTIONS_DATA,
        "variables": JSON.stringify({ afterTime: offsetTime })
    })


    const config = {
        method: "POST",
        maxBodyLength: Infinity,
        url: 'https://graphql.bitquery.io',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'BQYOLSSJn8JNtIIXjtX6jJ423q3Wpp7V',
            'Authorization': 'Bearer ory_at_Zx_2iC0p60cgZsQ0p5-zWBcPeYxL0SdUSrED_kLI5Fs.FDNU_5vbsYx85ae_Qjqk9kYaHDJ7uaqxBs2VZcOf2x8'
        },
        data
    }

    useEffect(() => {

        axios.request(config).then((response) => {
            const transactions = response?.data?.data?.ethereum?.transactions;

            const _tmp = transactions.map((t: any) => {
                return {
                    txnHash: t?.hash,
                    senderHash: t?.sender?.address,
                    receiverHash: t?.to?.address,
                    amount: t?.amount,
                    gas: t?.gas,
                    blockNumber: t?.block?.height,
                    success: t?.success
                }
            })

            setTableData(() => _tmp)
        })
    }, [])


    return (
        <section className={`w-full rounded p-5 ${className}`}>
            <Table>
                <TableCaption>All transactions above are live and real-time</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Txn ID</TableHead>
                        <TableHead className="w-[100px]">Sender</TableHead>
                        <TableHead className="w-[100px]">Receiver</TableHead>
                        <TableHead className="w-[300px] text-right">Amount (Ether)</TableHead>
                        <TableHead className="text-center">Success</TableHead>
                        <TableHead className="">Block number</TableHead>
                        <TableHead className="">Gas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData?.map((t) => (
                        <TableRow key={t.txnHash}>
                            <TableCell className="font-medium">
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-purple-700 p-2 rounded cursor-pointer hover:bg-purple-700 hover:text-white">{t.txnHash.substring(0, 6)}</span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-[600px]">
                                        {t.txnHash}
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>

                            <TableCell className="font-medium">
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-blue-700 p-2 rounded cursor-pointer hover:bg-blue-700 hover:text-white">{t.senderHash.substring(0, 6)}</span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-[600px]">
                                        {t.senderHash}
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                            <TableCell className="font-medium">
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-blue-700 p-2 rounded cursor-pointer hover:bg-blue-700 hover:text-white">{t.receiverHash.substring(0, 6)}</span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-[600px]">
                                        {t.receiverHash}
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                            <TableCell className="text-right">{t.amount}</TableCell>
                            <TableCell className="text-center">
                                <Badge className={`${t.success ? 'bg-green-700' : 'bg-red-700'}`}>{t.success ? 'Completed' : 'Pending'}</Badge>
                            </TableCell>
                            <TableCell>{t.blockNumber}</TableCell>
                            <TableCell>{t.gas}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table >

        </section>
    )
}
