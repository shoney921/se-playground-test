import { Link } from "react-router-dom";
import BasicLayout from "../layouts/BasicLayout"
import '../styles/MainPage.css';

const MainPage: React.FC = () => {
    return (
        <BasicLayout>
            <div className="main-container">
                <div className="welcome-title">
                    Welcome to My Website
                </div>
                <div className="link-container">
                    <Link to="/about">About 페이지로 이동</Link>
                </div>
            </div>
        </BasicLayout>
    );
};

export default MainPage;
