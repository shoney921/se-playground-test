import '../styles/AboutPage.css';
import BasicLayout from '../layouts/BasicLayout';

const AboutPage: React.FC = () => {
  return (
    <BasicLayout>
      <div className="about-container">
        <div className="about-title">About Us</div>
        <div className="about-description">
          우리 회사/서비스에 대한 소개 페이지입니다.
        </div>
      </div>
    </BasicLayout>
  );
};

export default AboutPage;
