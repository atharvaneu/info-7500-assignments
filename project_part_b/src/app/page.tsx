"use client"

import axios from "axios"
import { BlocksTable } from "@/components/my/BlocksTable";
import { TransactionsTable } from "@/components/my/TransactionsTable";
import Geo from "@/components/my/Geo";
import { useEffect, useState } from 'react'
import { GET_COUNT } from "@/shared/queries"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CardDetailsType } from "@/shared/types";

interface RotateDebugger {
    alpha: number;
    phi: number;
    gamma: number;
}

export default function Home() {
    const [loading, setLoading] = useState<boolean>(true);
    const [cardDetails, setCardDetails] = useState<CardDetailsType>();

    // internal debugging tool
    // const [alpha, setAlpha] = useState<number>(0);
    // const [phi, setPhi] = useState<number>(0);
    // const [gamma, setGamma] = useState<number>(0);
    // const [scale, setScale] = useState<number>(0);

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

    return (
        <main className="flex min-h-screen flex-col justify-start p-24 bg-black">
            <h1 className="text-white text-2xl font-extrabold">Ethereum live transactions and blocks data <span className="font-light">(<span className="underline underline-offset-4">hover</span> over hashes to copy them)</span></h1>


            {/*<div className="fixed top-0 right-0 w-96">
                <h1 className="text-white">Alpha {alpha}</h1>
                <input className="p-2 bg-white w-full" onChange={(e: any) => setAlpha(() => e.target.value)} value={alpha} type="range" name="alpha" min="0" max="1080" />
                <h1 className="text-white">Phi {phi}</h1>
                <input className="p-2 bg-white w-full" onChange={(e: any) => setPhi(() => e.target.value)} value={phi} type="range" name="phi" min="0" max="1080" />
                <h1 className="text-white">Gamma {gamma}</h1>
                <input className="p-2 bg-white w-full" onChange={(e: any) => setGamma(() => e.target.value)} value={gamma} type="range" name="gamma" min="0" max="1080" />
                <h1 className="text-white">Scale {scale}</h1>
                <input className="p-2 bg-white w-full" onChange={(e: any) => setScale(() => e.target.value)} value={scale} type="range" name="gamma" min="0" max="1080" />
            </div>
            */}
            <div className="flex gap-10 mt-10">
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
                        <p className="font-semibold text-5xl">{parseInt(cardDetails?.txns as string) ?? 0}</p>
                    </CardContent>
                    <CardFooter>
                        This is the total transactions in the past <span className="underline underline-offset-4 ml-1">two hours</span>
                    </CardFooter>
                </Card>
            </div>

            
            <h1 className="text-white font-extrabold text-4xl mt-10">Node distribution</h1>
            <Geo width={1400} height={1400} className="mt-4" />

            <h1 className="text-white font-extrabold text-4xl mt-10">Real-time transactions data</h1>
            <TransactionsTable className="bg-white mt-4" />
            <h1 className="text-white font-extrabold text-4xl mt-10">Real-time Ethereum blocks data</h1>
            <BlocksTable className="bg-white mt-4" />
        </main>
    );
}
