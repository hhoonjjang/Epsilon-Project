import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import Modal from '../modal/Modal';

type Props = {
    children: ReactNode;
    web3: any;
    account: string | undefined;
};

const Layout = ({ children, web3, account }: Props) => {
    return (
        <div style={{ overflow: 'hidden' }}>
            <Modal />
            <header>
                <Header account={account}></Header>
            </header>

            <main>{children}</main>

            <footer>
                <Footer></Footer>
            </footer>
        </div>
    );
};

export default Layout;
