import { Outlet } from "react-router-dom";
import "../../styles/SubIndexPage.css";
import BasicLayout from "../../layouts/BasicLayout";

const IndexPage: React.FC = () => {
    return (
        <BasicLayout>
            <div className="index-page-title">
                <div> 실습페이지 </div>
            </div>
            <div className="index-page-content">
                <Outlet />
            </div>
        </BasicLayout>
    );
}

export default IndexPage;