import Draggable from 'react-draggable';
import { useGlobalContext } from './GlobalContextProvider';

const DebugPanel = () => {
    const { debugText } = useGlobalContext();
    return (
        <Draggable handle=".handle">
            <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: '9999', backgroundColor: 'black', border: '1px solid #ccc', borderRadius: '5px' }}>
                <div className="handle" style={{ cursor: 'move', padding: '5px', border: '1px solid #ccc', backgroundColor: 'black', textAlign: 'center' }}>Drag</div>
                <pre style={{
                    margin: '0',
                    padding: '10px',
                    userSelect: 'text',
                    overflowY: 'auto',
                    maxHeight: '80vh',
                    width: '30vw',
                }}>
                    {debugText.map((text, index) => (
                        <details key={index} style={{ marginBottom: '10px' }}>
                            <summary>{text.title}</summary>
                            <div>{text.content}</div>
                        </details>
                    ))}
                </pre>
            </div>
        </Draggable>
    );
};

export default DebugPanel;
