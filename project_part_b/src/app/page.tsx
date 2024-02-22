import { BlocksTable } from "@/components/my/BlocksTable";
import { TransactionsTable} from "@/components/my/TransactionsTable";
import Image from "next/image";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col  justify-start p-24 bg-black">
            <h1 className="text-white font-extrabold text-4xl">Real-time transactions data</h1>
            <TransactionsTable className="bg-white mt-4"/>
            <h1 className="text-white font-extrabold text-4xl mt-10">Real-time Ethereum blocks data</h1>
            <BlocksTable className="bg-white mt-4"/>
        </main>
    );
}
