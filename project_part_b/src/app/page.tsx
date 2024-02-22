"use client"

import axios from "axios"
import { BlocksTable } from "@/components/my/BlocksTable";
import { TransactionsTable } from "@/components/my/TransactionsTable";
import { useEffect, useState } from 'react'
import { GET_COUNT } from "@/shared/queries"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CardDetailsType } from "@/shared/types";

export default function Home() {
    const [loading, setLoading] = useState<boolean>(true);
    const [cardDetails, setCardDetails] = useState<CardDetailsType>();

    const twoHourOffset = new Date(new Date().getTime() - (2 * 60 * 60 * 1000));

    // Get the ISO string representation
    const offsetTime = twoHourOffset.toISOString();

    const data = JSON.stringify({
        "query": GET_COUNT,
        "variables": JSON.stringify({ afterTime: offsetTime })
    })

    const config = {
        method: "POST",
        maxBodyLength: Infinity,
        url: 'https://graphql.bitquery.io',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': process.env.NEXT_PUBLIC_API_KEY,
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_AUTH_BEARER_TOKEN}`
        },
        data
    }

    useEffect(() => {
        setLoading(true);
        axios.request(config).then((response) => {
            const data = response?.data?.data?.ethereum;


            const _tmp = {
                blocks: data?.blocks[0]?.count,
                gas: data?.blocks[0]?.gasUsed,
                txns: data?.transactions[0].amount,
            }

            // setCardDetails();


            setCardDetails((prev) => {
                return { ...prev, ..._tmp }
            });

            setLoading(false);
        })
    }, [])
    if (loading) {
        return <section className={`w-full rounded p-5 `}>
            <Skeleton className="w-[100px] h-[20px] rounded-full" />
        </section>
    }


    return (
        <main className="flex min-h-screen flex-col justify-start p-24 bg-black">
            <div className="flex gap-10">
                <Card className="">
                    <CardHeader>
                        <CardTitle>Total blocks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-5xl">{cardDetails?.blocks}</p>
                    </CardContent>
                    <CardFooter>
                        Total blocks from the start
                    </CardFooter>
                </Card>

                <Card className="">
                    <CardHeader>
                        <CardTitle>Total gas used ever</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-5xl">{cardDetails?.gas}</p>
                    </CardContent>
                    <CardFooter>
                        Total gas used from the first block
                    </CardFooter>
                </Card>
                <Card className="">
                    <CardHeader>
                        <CardTitle>Total transactions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="font-semibold text-5xl">{parseInt(cardDetails?.txns) ?? 0}</p>
                    </CardContent>
                    <CardFooter>
                        This is the total transactions in the past <span className="underline underline-offset-4 ml-1">two hours</span>
                    </CardFooter>
                </Card>
            </div>
            <h1 className="text-white font-extrabold text-4xl mt-10">Real-time transactions data</h1>
            <TransactionsTable className="bg-white mt-4" />
            <h1 className="text-white font-extrabold text-4xl mt-10">Real-time Ethereum blocks data</h1>
            <BlocksTable className="bg-white mt-4" />
        </main>
    );
}
