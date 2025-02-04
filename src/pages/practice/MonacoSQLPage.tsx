import Editor, { useMonaco } from '@monaco-editor/react';
import tomorrowTheme from 'monaco-themes/themes/Tomorrow.json';
import { useEffect } from 'react';
import * as monaco from 'monaco-editor';

interface SqlQueryEditorProps {
    // Add any props you need here
}

const SqlQueryEditor: React.FC<SqlQueryEditorProps> = () => {
    const monacoInstance = useMonaco();

    useEffect(() => {
        if (!monacoInstance) return;

        // Define the theme type explicitly
        monacoInstance.editor.defineTheme('tomorrow', tomorrowTheme as monaco.editor.IStandaloneThemeData);
        monacoInstance.editor.setTheme('tomorrow');
    }, [monacoInstance]);

    return (
        <>
            <div>
                <span>SQL 쿼리 작성</span>
            </div>
            <Editor
                height="500px" // Add a default height
                defaultLanguage="sql" // Specify SQL as the language
                theme="tomorrow"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                }}
            />
        </>
    );
}

export default SqlQueryEditor;