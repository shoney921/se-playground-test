import React from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { python } from '@codemirror/lang-python';
import { sql } from '@codemirror/lang-sql';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const EditorContainer = styled.div`
  .cm-editor {
    height: 400px;
    font-size: 15px;
    border-radius: 4px;
    overflow: hidden;
    
    &.cm-focused {
      outline: none;
    }
  }
`;

interface CodeMirrorEditorProps {
    language: 'python' | 'sql';
    initialValue?: string;
    onChange?: (value: string) => void;
}

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
    language,
    initialValue = '',
    onChange
}) => {
    const editorRef = useRef<EditorView>();
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const languageSupport = language === 'python' ? python() : sql();

        const state = EditorState.create({
            doc: initialValue,
            extensions: [
                basicSetup,
                languageSupport,
                EditorView.updateListener.of(update => {
                    if (update.docChanged && onChange) {
                        onChange(update.state.doc.toString());
                    }
                }),
                EditorView.theme({
                    '&': {
                        backgroundColor: '#1e1e1e',
                        color: '#d4d4d4'
                    },
                    '.cm-content': {
                        caretColor: '#fff',
                        padding: '10px'
                    },
                    '.cm-line': {
                        lineHeight: '1.6'
                    }
                }),
                EditorState.transactionFilter.of(tr => {
                    return tr;
                })
            ]
        });

        const view = new EditorView({
            state,
            parent: containerRef.current
        });

        editorRef.current = view;

        return () => {
            view.destroy();
        };
    }, [language]);

    return <EditorContainer ref={containerRef} />;
};

export default CodeMirrorEditor; 