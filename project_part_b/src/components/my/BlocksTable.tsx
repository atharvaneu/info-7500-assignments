
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
import { GET_BLOCKS_DATA } from "@/shared/queries"
import { BlocksColumnType } from "@/shared/types"

const { log } = console

export interface BlocksTableProps {
    className?: string;
}

export function BlocksTable({ className }: BlocksTableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [tableData, setTableData] = useState<BlocksColumnType[]>();

    const twoHourOffset = new Date(new Date().getTime() - (10 * 60 * 60 * 1000));

    // Get the ISO string representation
    const offsetTime = twoHourOffset.toISOString();

    const data = JSON.stringify({
        "query": GET_BLOCKS_DATA,
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
            const blocks = response?.data?.data?.ethereum?.blocks;

            const _tmp = blocks.map((t: any) => {
                return {
                    blockHash: t?.hash,
                    blockNumber: t?.height,
                    reward: t?.reward,
                    txnCount: t?.transactionCount,
                    blockSize: t?.size,
                    gasUsed: t?.gasUsed

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
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[150px]">Block hash</TableHead>
                        <TableHead className="w-[200px]">Block number (height)</TableHead>
                        <TableHead className="w-[100px]">Reward</TableHead>
                        <TableHead className="w-[300px] text-right">Total transactions</TableHead>
                        <TableHead className="text-center">Size</TableHead>
                        <TableHead className="">Gas used</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData?.map((t) => (
                        <TableRow key={t.blockHash}>
                            <TableCell className="font-medium">
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <span className="text-purple-700 p-2 rounded cursor-pointer hover:bg-purple-700 hover:text-white">{t.blockHash.substring(0, 6)}</span>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-[600px]">
                                        {t.blockHash}
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>

                            <TableCell className="font-medium">
                                {t.blockNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                                {t.reward}
                            </TableCell>
                            <TableCell className="text-right">{t.txnCount}</TableCell>
                            <TableCell className="text-center">
                                <Badge className={``}>{t.blockSize}</Badge>
                            </TableCell>
                            <TableCell>{t.gasUsed}</TableCell>
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
