import { Modal } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import LayersLibrary from './layers-library';
import LayersSettings from './layers-settings';
import MapSettings from './map-settings';
import { TabPanel } from '../common-components';

const tabs = [
	{ name: 'map', title: __( 'Map Settings' ), className: 'tab-map' },
	{ name: 'layers', title: __( 'Map Layers' ), className: 'tab-layers' },
	{ name: 'library', title: __( 'Layers Library' ), className: 'tab-library' },
];

export default ( {
	attributes,
	setAttributes,
	modal,
	setModal,
	loadedLayers,
	loadingLayers,
} ) => (
	<Modal
		className="jeo-map-editor-modal"
		title={ __( 'Map Editor' ) }
		onRequestClose={ () => setModal( false ) }
	>
		<TabPanel
			className="jeo-tabs"
			activeClass="active-tab"
			tabs={ tabs }
			initialTabName={ modal }
		>
			{ ( tab ) => {
				switch ( tab.name ) {
					case 'map':
						return (
							<MapSettings
								attributes={ attributes }
								setAttributes={ setAttributes }
							/>
						);
					case 'layers':
						return (
							<LayersSettings
								attributes={ attributes }
								setAttributes={ setAttributes }
								loadedLayers={ loadedLayers }
								loadingLayers={ loadingLayers }
							/>
						);
					case 'library':
						return (
							<LayersLibrary
								attributes={ attributes }
								setAttributes={ setAttributes }
							/>
						);
				}
			} }
		</TabPanel>
	</Modal>
);
