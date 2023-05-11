import Head from 'next/head';
import Menu from '@/components/Menu/Menu';

export default function Home() {
    return (
        <>
            <Head>
                <title>Epsilon-Studio</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <Menu />
            </main>
        </>
    );
}
