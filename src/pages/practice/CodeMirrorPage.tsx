import React, { useState, useEffect } from "react";
import CodeMirrorEditor from "./components/CodeMirrorEditor";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;
  width: 100%;
  overflow-y: auto;
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props => props.active ? '#4CAF50' : '#e0e0e0'};
  color: ${props => props.active ? 'white' : 'black'};
  font-size: 16px;
  
  &:hover {
    background-color: ${props => props.active ? '#45a049' : '#d0d0d0'};
  }
`;

const ConsoleContainer = styled.div`
  height: 200px;
  background-color: #1e1e1e;
  color: white;
  padding: 10px;
  font-family: monospace;
  font-size: 15px;
  overflow-y: auto;
  border-radius: 4px;
  width: 100%;
  margin-top: 10px;
`;

const RunButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 10px 0;
  
  &:hover {
    background-color: #45a049;
  }
`;

declare global {
    interface Window {
        loadPyodide: any;
    }
}

const CodeMirrorPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'python' | 'sql'>('python');
    const [output, setOutput] = useState('콘솔 출력이 여기에 표시됩니다...');
    const [isRunning, setIsRunning] = useState(false);
    const [code, setCode] = useState('');
    const [pyodide, setPyodide] = useState<any>(null);

    useEffect(() => {
        // Pyodide 스크립트 로드
        const loadPyodideScript = async () => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
            document.head.appendChild(script);

            script.onload = async () => {
                const pyodideInstance = await window.loadPyodide({
                    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
                });
                setPyodide(pyodideInstance);
                setOutput("Python 환경 준비 완료!");
            };
        };

        loadPyodideScript();
    }, []);

    const handleCodeChange = (newCode: string) => {
        setCode(newCode);
    };

    const handleRunCode = async () => {
        if (!pyodide) {
            setOutput("Python 환경이 아직 준비되지 않았습니다.");
            return;
        }

        setIsRunning(true);
        setOutput("코드 실행 중...");

        try {
            pyodide.runPython(`
                import sys
                from io import StringIO
                sys.stdout = StringIO()
            `);

            await pyodide.runPythonAsync(code);
            const output = pyodide.runPython("sys.stdout.getvalue()");
            setOutput(output || "실행 완료 (출력 없음)");
        } catch (error) {
            if (error instanceof Error) {
                setOutput(`실행 오류: ${error.message}`);
            } else {
                setOutput('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <Container>
            <TabContainer>
                <Tab
                    active={activeTab === 'python'}
                    onClick={() => setActiveTab('python')}
                >
                    Python 에디터
                </Tab>
                <Tab
                    active={activeTab === 'sql'}
                    onClick={() => setActiveTab('sql')}
                >
                    SQL 에디터
                </Tab>
            </TabContainer>

            <CodeMirrorEditor
                language={activeTab}
                onChange={handleCodeChange}
            />

            <RunButton
                onClick={handleRunCode}
                disabled={isRunning || !pyodide}
            >
                {isRunning ? '실행 중...' : '실행'}
            </RunButton>

            <ConsoleContainer>
                <div style={{ color: '#4CAF50' }}>출력:</div>
                {output.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </ConsoleContainer>
        </Container>
    );
}

export default CodeMirrorPage; 