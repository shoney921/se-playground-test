import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  padding: 20px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #2EA043;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  
  &:hover {
    background-color: #2C974B;
  }

  &:disabled {
    background-color: #94D3A2;
    cursor: not-allowed;
  }
`;

const WorkspaceContainer = styled.div`
  flex: 1;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
`;

const IframeContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 16px;
`;

interface Codespace {
    id: string;
    url: string;
    name: string;
}

const CodespacesPage: React.FC = () => {
    const [codespace, setCodespace] = useState<Codespace | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createCodespace = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = process.env.REACT_APP_GITHUB_TOKEN;

            if (!token) {
                throw new Error('GitHub 토큰이 설정되지 않았습니다.');
            }

            // Fix the API endpoint URL
            const userResponse = await fetch('https://api.github.com/repos/shoney921/template-client', {
                headers: {
                    'Authorization': `Bearer ${token}`,  // Changed to Bearer authentication
                    'Accept': 'application/vnd.github.v3+json',
                }
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json();
                throw new Error(`저장소 정보 가져오기 실패: ${errorData.message}`);
            }

            const repoData = await userResponse.json();

            // Create Codespace using the correct repository information
            const response = await fetch(`https://api.github.com/repos/shoney921/template-client/codespaces`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Changed to Bearer authentication
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ref: repoData.default_branch,
                    machine: 'basicLinux32gb',
                    display_name: 'My Test Codespace',
                    retention_period_minutes: 2880
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Codespace 생성 실패: ${errorData.message}`);
            }

            const data = await response.json();
            setCodespace({
                id: data.id,
                url: data.web_url || data.html_url,
                name: data.name
            });
        } catch (err: any) {
            setError(err.message);
            console.error('Codespace 생성 오류:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Button
                onClick={createCodespace}
                disabled={isLoading}
            >
                {isLoading ? 'Codespace 생성 중...' : 'GitHub Codespace 생성'}
            </Button>

            <WorkspaceContainer>
                {error ? (
                    <MessageContainer>
                        오류: {error}
                    </MessageContainer>
                ) : codespace ? (
                    <IframeContainer>
                        <iframe
                            src={codespace.url}
                            title="GitHub Codespace"
                            allow="fullscreen"
                        />
                    </IframeContainer>
                ) : (
                    <MessageContainer>
                        {isLoading ?
                            'Codespace를 생성하고 있습니다...' :
                            'Codespace를 생성하려면 위 버튼을 클릭하세요.'
                        }
                    </MessageContainer>
                )}
            </WorkspaceContainer>
        </Container>
    );
};

export default CodespacesPage; 