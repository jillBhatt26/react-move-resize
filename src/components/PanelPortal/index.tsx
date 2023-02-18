import usePortal from 'react-useportal';
import Panel from '../Panel';
import './styles.css';

const PanelPortal = (): JSX.Element => {
    // hooks
    const { Portal } = usePortal({
        bindTo: document.getElementById('panel-portal') as HTMLDivElement
    });

    return (
        <Portal>
            <Panel>
                <div className="panel_content">Content</div>
            </Panel>
        </Portal>
    );
};

export default PanelPortal;
