import '../styles/BasicLayout.css';
import BasicMenu from '../components/menus/BasicMenu';

const BasicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className='basic-layout'>
            <header className="header">
                <BasicMenu />
            </header>
            <div className="content-wrapper">
                <div className="main-content">
                    {children}
                </div>
                <div className="sidebar">
                    <h1 className="sidebar-title">진행률</h1>
                </div>
            </div>
        </div>
    );
}

export default BasicLayout;