import { useEffect, useState } from 'react';
import { Editor, Monaco } from '@monaco-editor/react';
import styled from 'styled-components';

// Pyodide 타입 선언
declare global {
    interface Window {
        loadPyodide: any;
    }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 70vh;
  padding: 20px;
  width: 100%;
`;

const EditorContainer = styled.div`
  flex: 1;
  margin-bottom: 10px;
  width: 100%;
  height: 50px;

  .monaco-editor {
    .view-line {
      font-size: 15px !important;
      line-height: 1.5 !important;
    }
    .line-numbers {
      font-size: 15px !important;
    }
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
`;

const RunButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  
  &:hover {
    background-color: #45a049;
  }
`;

// 패키지 설치를 위한 입력 필드와 버튼 스타일 추가
const PackageContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;

const PackageInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  flex: 1;
`;

const InstallButton = styled(RunButton)`
  margin: 0;
  background-color: #2196F3;
  &:hover {
    background-color: #1976D2;
  }
`;

const MonacoPage: React.FC = () => {
    const [code, setCode] = useState('print("Hello, World!")');
    const [output, setOutput] = useState('');
    const [pyodide, setPyodide] = useState<any>(null);
    const [packageName, setPackageName] = useState('');

    useEffect(() => {
        // Pyodide 스크립트를 동적으로 로드
        const loadPyodideScript = async () => {
            const script = document.createElement('script');
            script.src = "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js";
            script.async = true;
            script.onload = async () => {
                try {
                    const pyodideInstance = await window.loadPyodide({
                        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
                    });
                    // micropip 초기화
                    await pyodideInstance.loadPackage("micropip");
                    setPyodide(pyodideInstance);
                } catch (error) {
                    console.error('Pyodide 로딩 실패:', error);
                    setOutput('Pyodide 로딩 실패');
                }
            };
            document.body.appendChild(script);
        };

        loadPyodideScript();

        // 클린업 함수
        return () => {
            const script = document.querySelector('script[src*="pyodide.js"]');
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, []);

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setCode(value);
        }
    };

    const runCode = async () => {
        if (!pyodide) {
            setOutput('Pyodide가 아직 로딩 중입니다...');
            return;
        }

        try {
            // 출력을 캡처하기 위한 설정
            pyodide.runPython(`
                import sys
                from io import StringIO
                sys.stdout = StringIO()
            `);

            // 코드 실행
            await pyodide.runPythonAsync(code);

            // 출력 가져오기
            const result = pyodide.runPython("sys.stdout.getvalue()");
            setOutput(result);
        } catch (error: any) {
            setOutput(`오류: ${error.message}`);
        }
    };

    // 패키지 설치 함수 추가
    const installPackage = async () => {
        if (!pyodide) {
            setOutput('Pyodide가 아직 로딩 중입니다...');
            return;
        }

        try {
            setOutput(`${packageName} 설치 중...`);
            await pyodide.runPythonAsync(`
                import micropip
                await micropip.install('${packageName}')
            `);
            setOutput(`${packageName} 설치 완료!`);
            setPackageName('');  // 입력 필드 초기화
        } catch (error: any) {
            setOutput(`패키지 설치 오류: ${error.message}`);
        }
    };

    // Monaco 인스턴스가 로드될 때 호출되는 함수 추가
    const handleEditorDidMount = (editor: any, monaco: Monaco) => {
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: (model, position) => {
                const wordInfo = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: wordInfo.startColumn,
                    endColumn: wordInfo.endColumn
                };

                const suggestions = [
                    {
                        label: 'print',
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: 'print(${1:value})',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: '값을 출력합니다.',
                        range: range
                    },
                    {
                        label: 'def',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: 'def ${1:function_name}(${2:parameters}):\n\t${3:pass}',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: '함수를 정의합니다.',
                        range: range
                    },
                ];
                return { suggestions };
            }
        });
    };

    return (
        <Container>
            <PackageContainer>
                <PackageInput
                    type="text"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="설치할 패키지 이름 입력 (예: numpy)"
                    style={{ fontSize: '15px' }}
                />
                <InstallButton onClick={installPackage}>패키지 설치</InstallButton>
            </PackageContainer>
            <EditorContainer>
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    defaultValue={code}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 15,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        lineHeight: 24,
                        letterSpacing: 0.3,
                        quickSuggestions: true,
                        suggestOnTriggerCharacters: true,
                    }}
                />
            </EditorContainer>
            <RunButton onClick={runCode}>실행</RunButton>
            <ConsoleContainer>
                {output.split('\n').map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </ConsoleContainer>
        </Container>
    );
};

export default MonacoPage;