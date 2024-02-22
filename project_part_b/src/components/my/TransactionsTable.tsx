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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { GET_TRANSACTIONS_DATA, GET_BLOCKS_DATA } from "@/shared/queries"
import { TableColumnType } from "@/shared/types"

const { log } = console

export interface DataTableProps {
    className?: string;
}

export function TransactionsTable({ className }: DataTableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [tableData, setTableData] = useState<TableColumnType[]>();

    const twentyMinuteOffset = new Date(new Date().getTime() - (0.33 * 60 * 60 * 1000));

    // Get the ISO string representation
    const offsetTime = twentyMinuteOffset.toISOString();

    const data = JSON.stringify({
        "query": GET_TRANSACTIONS_DATA,
        "variables": JSON.stringify({ afterTime: offsetTime, offset: page * 10 })
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
        setLoading(true);
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
            setLoading(false);
        })
    }, [page])


    function handlePagination(option: string) {
        if (option === 'next') {
            setPage((prev) => prev + 1);
        }
        else if (option === 'prev' && page > 1) {
            setPage((prev) => prev - 1);
        }
    }


    if (loading) {
        return <section className={`w-full rounded p-5 ${className}`}>
                <Skeleton className="w-[100px] h-[20px] rounded-full" />
            </section>
    }

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

            <Pagination className="mt-6">
                <PaginationContent>
                    <PaginationItem className="cursor-pointer" onClick={() => handlePagination('prev')}>
                        <PaginationPrevious />
                    </PaginationItem>
                    <PaginationItem>Page {page}</PaginationItem>
                    <PaginationItem className="cursor-pointer" onClick={() => handlePagination('next')}>
                        <PaginationNext />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

        </section>
    )
}
