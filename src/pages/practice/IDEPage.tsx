import React, { useState } from "react";
import MonacoPage from "./MonacoPage";
import MonacoSQLPage from "./MonacoSQLPage";
import CodeMirrorPage from "./CodeMirrorPage";
import styled from "styled-components";

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

type EditorType = 'monaco' | 'monaco-sql' | 'codemirror';

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
                    active={activeEditor === 'monaco-sql'}
                    onClick={() => setActiveEditor('monaco-sql')}
                >
                    Monaco SQL
                </Tab>
                <Tab
                    active={activeEditor === 'codemirror'}
                    onClick={() => setActiveEditor('codemirror')}
                >
                    CodeMirror (Copilot 지원)
                </Tab>
            </TabContainer>

            {activeEditor === 'monaco' && <MonacoPage />}
            {activeEditor === 'monaco-sql' && <MonacoSQLPage />}
            {activeEditor === 'codemirror' && <CodeMirrorPage />}
        </>
    );
}

export default IDEPage;