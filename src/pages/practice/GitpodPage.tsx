import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  padding: 20px;
  width: 100%;
`;

const GitpodButton = styled.button`
  padding: 10px 20px;
  background-color: #1AA6E4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  
  &:hover {
    background-color: #1590c4;
  }
`;

const WorkspaceContainer = styled.div`
  flex: 1;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #666;
`;

const IframeContainer = styled.div`
  flex: 1;
  position: relative;
  height: 100%;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 4px;
  }
`;

interface GitpodWorkspace {
    id: string;
    url: string;
}

const GitpodPage: React.FC = () => {
    const [workspace, setWorkspace] = useState<GitpodWorkspace | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Gitpod 워크스페이스 생성
    const createWorkspace = async () => {
        setIsLoading(true);
        try {
            // 실제 구현시에는 백엔드 API를 통해 Gitpod 워크스페이스를 생성해야 합니다
            const repositoryUrl = 'https://github.com/yourusername/yourrepo';
            const gitpodUrl = `https://gitpod.io/#${repositoryUrl}`;

            // 데모 목적으로 임시 워크스페이스 정보 생성
            const mockWorkspace = {
                id: 'workspace-' + Date.now(),
                url: gitpodUrl
            };

            setWorkspace(mockWorkspace);
        } catch (error) {
            console.error('워크스페이스 생성 실패:', error);
            alert('워크스페이스를 생성하는 중 오류가 발생했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <GitpodButton
                onClick={createWorkspace}
                disabled={isLoading}
            >
                {isLoading ? '워크스페이스 생성 중...' : 'Gitpod 워크스페이스 생성'}
            </GitpodButton>

            {workspace ? (
                <IframeContainer>
                    <iframe
                        src={workspace.url}
                        title="Gitpod Workspace"
                        allow="fullscreen"
                    />
                </IframeContainer>
            ) : (
                <WorkspaceContainer>
                    {isLoading ?
                        '워크스페이스를 생성하고 있습니다...' :
                        '워크스페이스를 생성하려면 위 버튼을 클릭하세요.'
                    }
                </WorkspaceContainer>
            )}
        </Container>
    );
};

export default GitpodPage; 