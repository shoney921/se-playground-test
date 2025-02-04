import React, { useState } from 'react';
import styled from 'styled-components';
import sdk from '@stackblitz/sdk';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  padding: 20px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #1389FD;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  
  &:hover {
    background-color: #0070E0;
  }

  &:disabled {
    background-color: #80C4FE;
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
`;

const MessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
  font-size: 16px;
`;

const StackBlitzPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [embedded, setEmbedded] = useState(false);

    const createProject = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const project = {
                files: {
                    'index.html': `
<!DOCTYPE html>
<html>
  <head>
    <title>My Project</title>
    <script src="script.js"></script>
    <link rel="stylesheet" href="styles.css">
  </head>
  <body>
    <h1>Welcome to StackBlitz!</h1>
    <p>Start editing to see some magic happen :)</p>
  </body>
</html>`,
                    'styles.css': `
body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
}`,
                    'script.js': `
console.log('Hello from StackBlitz!');`
                },
                title: 'My Project',
                description: 'A simple project created with StackBlitz',
                template: 'javascript' as const,
                dependencies: {}
            };

            setEmbedded(true);

            await new Promise(resolve => setTimeout(resolve, 100));

            const container = document.getElementById('stackblitz-container');
            if (!container) {
                throw new Error('StackBlitz 컨테이너를 찾을 수 없습니다.');
            }

            const vm = await sdk.embedProject('stackblitz-container', project, {
                height: '100%',
                hideNavigation: false,
                hideExplorer: false
            });

            setEmbedded(true);
        } catch (err: any) {
            setError(err.message);
            console.error('StackBlitz 프로젝트 생성 오류:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <Button
                onClick={createProject}
                disabled={isLoading || embedded}
            >
                {isLoading ? 'StackBlitz 프로젝트 생성 중...' : 'StackBlitz 프로젝트 생성'}
            </Button>

            <WorkspaceContainer>
                {error ? (
                    <MessageContainer>
                        오류: {error}
                    </MessageContainer>
                ) : (
                    embedded ? (
                        <IframeContainer id="stackblitz-container" />
                    ) : (
                        <MessageContainer>
                            {isLoading ?
                                'StackBlitz 프로젝트를 생성하고 있습니다...' :
                                'StackBlitz 프로젝트를 생성하려면 위 버튼을 클릭하세요.'
                            }
                        </MessageContainer>
                    )
                )}
            </WorkspaceContainer>
        </Container>
    );
};

export default StackBlitzPage; 