/* eslint-disable react/prop-types */
import { useEffect, useRef, forwardRef, useLayoutEffect } from "react";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
const Delta = Quill.import('delta');


const QuillEditor = forwardRef(
    ({ readOnly, initialValue, onTextChange, className, id, rows }, ref) => {
        const containerRef = useRef(null);
        const onTextChangeRef = useRef(onTextChange);

        // Initialization of Quill Editor
        useEffect(() => {
            const container = containerRef.current;
            const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));
            const quill = new Quill(editorContainer, { theme: 'snow' });
            ref.current = quill;

            // Enable or disable based on readOnly
            quill.enable(!readOnly);

            quill.on(Quill.events.TEXT_CHANGE, () => {
                const contents = quill.getContents();
                onTextChangeRef.current?.(contents);
            });

            return () => {
                ref.current = null;
                container.innerHTML = '';
            };
        }, [readOnly, ref]);

        // Setting the Initial Content inside the Editor
        useEffect(() => {
            if (initialValue && ref.current) {
                let initialContent;

                // Trim the initialValue to remove any leading/trailing whitespace
                const trimmedContent = initialValue.trim();

                // Initially assume the content is plain text
                initialContent = new Delta().insert(trimmedContent);

                // Check if the trimmed value looks like it could be a JSON string
                if (trimmedContent.startsWith('{') && trimmedContent.endsWith('}')) {
                    try {
                        const parsedValue = JSON.parse(trimmedContent);
                        // If valid Delta object
                        if (parsedValue && parsedValue.ops) {
                            initialContent = new Delta(parsedValue);
                        }
                    } catch (error) {
                        // Log the error if parsing fails, but initialContent is already set to plain text
                        console.error('Error parsing as JSON:', error);
                    }
                }

                // Set the content of the editor
                if (initialContent) {
                    ref.current.setContents(initialContent);
                }
            }
        }, [initialValue, ref]);

        // Update onTextChangeRef.current on prop change without re-initializing the editor
        useLayoutEffect(() => {
            onTextChangeRef.current = onTextChange;
        });

        return (
            <div ref={containerRef} className={className} id={id} rows={rows}></div>
        ) 
    },
);
QuillEditor.displayName = 'Editor';
export default QuillEditor;