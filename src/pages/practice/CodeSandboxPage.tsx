import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  width: 100%;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #40a9ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  font-size: 16px;
  
  &:hover {
    background-color: #1890ff;
  }

  &:disabled {
    background-color: #91caff;
    cursor: not-allowed;
  }

  &.python {
    background-color: #3776AB;
    &:hover {
      background-color: #2D5F8E;
    }
  }
  
  &.node {
    background-color: #68A063;
    &:hover {
      background-color: #527F4D;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
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

const TemplateSelect = styled.select`
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  margin-right: 10px;
  font-size: 14px;
`;

const ConfigPanel = styled.div`
  margin-bottom: 10px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const CodeSandboxPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [embedded, setEmbedded] = useState(false);
    const [sandboxId, setSandboxId] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState('vanilla');
    const [hideNavigation, setHideNavigation] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

    const createProject = async (projectType: string) => {
        setIsLoading(true);
        setError(null);

        try {
            let templateId;
            switch (projectType) {
                case 'react':
                    templateId = 'new';
                    break;
                case 'vue':
                    templateId = 'vue';
                    break;
                case 'python':
                    // Python 템플릿 ID (참고: CodeSandbox는 제한된 Python 지원)
                    templateId = 'python';
                    break;
                case 'node':
                    templateId = 'node';
                    break;
                case 'vanilla':
                default:
                    templateId = selectedTemplate;
            }

            const sandboxUrl = `https://codesandbox.io/embed/${templateId}?${new URLSearchParams({
                fontsize: '14',
                hidenavigation: hideNavigation ? '1' : '0',
                theme,
                view: 'split',
                module: '/src/index.js',
                terminal: '1', // 터미널 활성화
                codemirror: '1' // 코드 미리보기 활성화
            }).toString()}`;
            
            setSandboxId(templateId);
            setEmbedded(true);
        } catch (err: any) {
            setError(err.message);
            console.error('CodeSandbox 프로젝트 생성 오류:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // GitHub 저장 기능 추가
    const saveToGitHub = async () => {
        setIsLoading(true);
        try {
            // GitHub 토큰이 없는 경우 에러 처리
            if (!process.env.REACT_APP_GITHUB_TOKEN) {
                throw new Error('GitHub 토큰이 설정되지 않았습니다.');
            }

            // CodeSandbox API 엔드포인트
            const apiUrl = `https://codesandbox.io/api/v1/sandboxes/${sandboxId}/git/repo`;
            
            // GitHub 저장소 생성 요청
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}`
                },
                body: JSON.stringify({
                    repoName: `codesandbox-${sandboxId}`,
                    private: false,
                    description: '코드샌드박스에서 생성된 프로젝트'
                })
            });

            if (!response.ok) {
                throw new Error('GitHub 저장소 생성에 실패했습니다.');
            }

            const data = await response.json();
            console.log('GitHub 저장소가 생성되었습니다:', data.git_url);
            alert('GitHub 저장소에 성공적으로 저장되었습니다!');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container>
            <ConfigPanel>
                <TemplateSelect 
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                    <option value="vanilla">Vanilla JS</option>
                    <option value="parcel">Parcel</option>
                    <option value="static">Static HTML</option>
                    <option value="svelte">Svelte</option>
                    <option value="angular">Angular</option>
                </TemplateSelect>
                
                <label>
                    <input
                        type="checkbox"
                        checked={hideNavigation}
                        onChange={(e) => setHideNavigation(e.target.checked)}
                    />
                    네비게이션 숨기기
                </label>
                
                <label>
                    <input
                        type="checkbox"
                        checked={theme === 'dark'}
                        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    />
                    다크 모드
                </label>
            </ConfigPanel>

            <ButtonGroup>
                <Button
                    onClick={() => createProject('react')}
                    disabled={isLoading}
                >
                    {isLoading ? '생성 중...' : 'React 프로젝트'}
                </Button>
                <Button
                    onClick={() => createProject('vue')}
                    disabled={isLoading}
                >
                    {isLoading ? '생성 중...' : 'Vue 프로젝트'}
                </Button>
                <Button
                    className="python"
                    onClick={() => createProject('python')}
                    disabled={isLoading}
                >
                    {isLoading ? '생성 중...' : 'Python 프로젝트'}
                </Button>
                <Button
                    className="node"
                    onClick={() => createProject('node')}
                    disabled={isLoading}
                >
                    {isLoading ? '생성 중...' : 'Node.js 프로젝트'}
                </Button>
                <Button
                    onClick={() => createProject('vanilla')}
                    disabled={isLoading}
                >
                    {isLoading ? '생성 중...' : '선택한 템플릿으로 생성'}
                </Button>
                <Button
                    onClick={saveToGitHub}
                    disabled={isLoading || !embedded}
                >
                    GitHub에 저장
                </Button>
            </ButtonGroup>

            <WorkspaceContainer>
                {error ? (
                    <MessageContainer>
                        오류: {error}
                    </MessageContainer>
                ) : (
                    embedded && sandboxId ? (
                        <IframeContainer>
                            <iframe
                                src={`https://codesandbox.io/embed/${sandboxId}?fontsize=14&hidenavigation=0&theme=dark`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    border: 0,
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                }}
                                title="CodeSandbox Editor"
                                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
                            />
                        </IframeContainer>
                    ) : (
                        <MessageContainer>
                            {isLoading ?
                                'CodeSandbox 프로젝트를 생성하고 있습니다...' :
                                'CodeSandbox 프로젝트를 생성하려면 위 버튼을 클릭하세요.'
                            }
                        </MessageContainer>
                    )
                )}
            </WorkspaceContainer>

            <h1> 특징 요약 </h1>
            <ul>
                <li> - 브라우저에서 바로 코드 실행 가능</li>
                <li> - React, Vue, Angular, Svelte 등 다양한 프레임워크 템플릿 제공</li>
                <li> - Python 프로젝트 지원 (제한적)</li>
                <li> - Node.js 백엔드 개발 가능</li>
                <li> - 실시간 미리보기 지원</li>
                <li> - npm 패키지 설치 및 관리</li>
                <li> - 다크/라이트 테마 지원</li>
                <li> - 분할 뷰 (코드/프리뷰) 제공</li>
                <li> - GitHub 연동 및 프로젝트 저장 가능</li>
                <li> - 실시간 협업 기능 지원</li>
                <li> - 터미널 및 콘솔 액세스 제공</li>
                <li> - Hot Module Replacement (HMR) 지원</li>
            </ul>
        </Container>
    );
};

export default CodeSandboxPage; 