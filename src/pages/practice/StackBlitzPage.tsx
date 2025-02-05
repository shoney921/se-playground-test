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

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const StackBlitzPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [embedded, setEmbedded] = useState(false);
    const [vm, setVm] = useState<any>(null);

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
                    'index.js': `
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

            const vmInstance = await sdk.embedProject('stackblitz-container', project, {
                height: '100%',
                hideNavigation: false,
                hideExplorer: false
            });

            setVm(vmInstance);
            setEmbedded(true);
        } catch (err: any) {
            setError(err.message);
            console.error('StackBlitz 프로젝트 생성 오류:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const saveProject = async () => {
        if (!vm) return;
        
        try {
            const files = await vm.getFsSnapshot();
            const projectData = JSON.stringify(files, null, 2);
            
            // 파일 다운로드 생성
            const blob = new Blob([projectData], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'stackblitz-project.json';
            a.style.display = 'none'; // 링크를 숨김
            document.body.appendChild(a);
            a.click();
            
            // 정리 작업을 setTimeout으로 지연
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                if (a.parentNode) {  // 부모 노드가 있는 경우에만 제거
                    a.parentNode.removeChild(a);
                }
            }, 100);
        } catch (err: any) {
            setError('프로젝트 저장 중 오류가 발생했습니다: ' + err.message);
        }
    };

    const openTerminal = async () => {
        if (!vm) return;
        
        try {
            // package.json이 없는 경우에만 생성
            const files = await vm.getFsSnapshot();
            if (!files['package.json']) {
                await vm.applyFsDiff({
                    create: {
                        'package.json': JSON.stringify({
                            name: "stackblitz-project",
                            version: "1.0.0",
                            private: true,
                            dependencies: {}
                        }, null, 2)
                    }
                });
            }
            
            // 터미널 열기
            await vm.terminal.show();
            await vm.terminal.focus();
            
        } catch (err: any) {
            console.error('터미널 오류:', err);
            setError('터미널 실행 중 오류가 발생했습니다: ' + err.message);
        }
    };

    return (
        <Container>

            <ButtonGroup>
                <Button
                    onClick={createProject}
                    disabled={isLoading || embedded}
                >
                    {isLoading ? 'StackBlitz 프로젝트 생성 중...' : 'StackBlitz 프로젝트 생성'}
                </Button>
                <Button
                    onClick={saveProject}
                    disabled={!embedded || !vm}
                >
                    프로젝트 저장하기
                </Button>
                <Button
                    onClick={openTerminal}
                    disabled={!embedded || !vm}
                >
                    터미널 열기
                </Button>
            </ButtonGroup>

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

            <h1> 특징 요약 </h1>
            <ul>
                <li> - 코드 편집 및 실행 화면 바로 보임</li>
                <li> - VM 제공, 터미널 지원 한 것으로 보임</li>
                <li> - 프로젝트 저장 및 공유 기능 있음, 위에 구현한 방식 말고 있음...</li>
            </ul>
        </Container>
    );
};

export default StackBlitzPage; 