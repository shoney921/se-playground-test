import React, { useState } from "react";
import MonacoPage from "./MonacoPage";
import MonacoSQLPage from "./MonacoSQLPage";
import CodeMirrorPage from "./CodeMirrorPage";
import GitpodPage from './GitpodPage';
import styled from "styled-components";
import CodespacesPage from './CodespacesPage';
import StackBlitzPage from './StackBlitzPage';

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

type EditorType = 'monaco' | 'monaco-sql' | 'codemirror' | 'gitpod' | 'codespaces' | 'stackblitz';

const IDEPage: React.FC = () => {
    const [activeEditor, setActiveEditor] = useState<EditorType>('monaco');

    return (
        <>
            <TabContainer>
                <Tab
                    active={activeEditor === 'monaco'}
                    onClick={() => setActiveEditor('monaco')}
                >
                    Monaco Python
                </Tab>
                <Tab
                    active={activeEditor === 'codemirror'}
                    onClick={() => setActiveEditor('codemirror')}
                >
                    CodeMirror
                </Tab>
                <Tab
                    active={activeEditor === 'gitpod'}
                    onClick={() => setActiveEditor('gitpod')}
                >
                    Gitpod (Copilot 지원)
                </Tab>
                <Tab
                    active={activeEditor === 'codespaces'}
                    onClick={() => setActiveEditor('codespaces')}
                >
                    GitHub Codespaces
                </Tab>
                <Tab
                    active={activeEditor === 'stackblitz'}
                    onClick={() => setActiveEditor('stackblitz')}
                >
                    StackBlitz
                </Tab>
            </TabContainer>

            {activeEditor === 'monaco' && <MonacoPage />}
            {activeEditor === 'codemirror' && <CodeMirrorPage />}
            {activeEditor === 'gitpod' && <GitpodPage />}
            {activeEditor === 'codespaces' && <CodespacesPage />}
            {activeEditor === 'stackblitz' && <StackBlitzPage />}
        </>
    );
}

export default IDEPage;