import Panel from '../Panel';
import './styles.css';

const PanelPortal = (): JSX.Element => {
    return (
        <div>
            <Panel>
                <div className="panel_content">Content</div>
            </Panel>
        </div>
    );
};

export default PanelPortal;
