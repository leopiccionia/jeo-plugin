import { PluginDocumentSettingPanel } from '@wordpress/edit-post';
import AttributionSettings from './attribution-settings';
import LegendsEditor from '../posts-sidebar/legends-editor/legend-editor';
import { withDispatch, withSelect } from '@wordpress/data';
import { Fragment, useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Map, { MapboxAPIKey } from '../map-blocks/map';
import { renderLayer } from '../map-blocks/map-preview-layer';
import { isEmpty, isEqual } from 'lodash-es';
import { useDebounce } from 'use-debounce';
import LayerPreviewPortal from './layer-preview-portal';
import LayerSettings from './layer-settings';
import './layers-sidebar.css';

const mapDefaults = {
	initial_zoom: jeo_settings.map_defaults.zoom,
	center_lat: jeo_settings.map_defaults.lat,
	center_lon: jeo_settings.map_defaults.lng,
	min_zoom: 0,
	max_zoom: 20,
};

const LayersSidebar = ( {
	postMeta,
	setPostMeta,
	sendNotice,
	removeNotice,
	lockPostAutoSaving,
	lockPostSaving,
	unlockPostSaving,
} ) => {
	const {
		center_lat: centerLat,
		center_lon: centerLon,
		initial_zoom: initialZoom,
	} = { ...mapDefaults, ...postMeta };
	const [ layerTypeSchema, setLayerTypeSchema ] = useState( {} );

	const [ key, setKey ] = useState( 0 );
	const [ hasError, setHasError ] = useState( false );

	const editingMap = useRef( false );
	const [ debouncedPostMeta ] = useDebounce( postMeta, 1000 );
	const oldPostMeta = useRef( debouncedPostMeta );

	const animationOptions = {
		animate: false,
	};

	useEffect( () => {
		if ( postMeta.type ) {
			setHasError( false );
			setKey( key + 1 );
		}
	}, [ postMeta.type ] );

	useEffect( () => {
		if ( debouncedPostMeta.type ) {
			window.JeoLayerTypes
				.getLayerTypeSchema( debouncedPostMeta )
				.then( ( schema ) => {
					setLayerTypeSchema( schema );
				} );
		} else {
			setLayerTypeSchema( {} );
			sendNotice( 'warning', __( 'No layer configured.', 'jeo' ), {
				id: 'warning_no_type',
				isDismissible: true,
			} );
			lockPostSaving();
			lockPostAutoSaving( 'layer_lock_key' );
		}
	}, [ debouncedPostMeta.type ] );

	useEffect( () => {
		if ( hasError ) {
			sendNotice( 'error', __( 'Error loading your layer. Please check your settings.', 'jeo' ), {
				id: 'error_loading_layer',
				isDismissible: false,
			} );
			lockPostSaving();
			lockPostAutoSaving( 'layer_lock_key' );
		} else {
			removeNotice( 'error_loading_layer' );
			unlockPostSaving( 'layer_lock_key' );
		}
	}, [ hasError ] );

	useEffect( () => {
		const debouncedLayerTypeOptions = debouncedPostMeta.layer_type_options;
		const oldLayerTypeOptions = oldPostMeta.current.layer_type_options;
		if ( layerTypeSchema && layerTypeSchema.properties && debouncedLayerTypeOptions ) {
			const optionsKeys = Object.keys( layerTypeSchema.properties );
			let anyEmpty = false;
			optionsKeys.some( ( k ) => {
				if ( isEmpty( debouncedLayerTypeOptions[ k ] ) && layerTypeSchema.required.includes( k ) ) {
					anyEmpty = true;
					setHasError( true );
					return anyEmpty;
				}
				return false;
			} );
			if ( ! isEqual( debouncedLayerTypeOptions, oldLayerTypeOptions ) && ! anyEmpty ) {
				oldPostMeta.current = debouncedPostMeta;
				setHasError( false );
				setKey( key + 1 );
			}
		}
	}, [ debouncedPostMeta, layerTypeSchema ] );

	//todo: find a better way to intercept mapbox api requests errors
	const origOpen = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function() {
		this.addEventListener( 'load', function() {
			if ( this.status >= 400 ) {
				setHasError( true );
			}
		} );
		origOpen.apply( this, arguments );
	};

	return (
		<Fragment>
			{ MapboxAPIKey && (
				<LayerPreviewPortal>
					<Map
						key={ key }
						onError={ ( ) => {
							if ( ! hasError ) {
								setHasError( true );
							}
						} }
						onStyleLoad={ ( map ) => {
							map.addControl( new mapboxgl.NavigationControl( { showCompass: false } ), 'top-left' );
							map.addControl( new mapboxgl.FullscreenControl(), 'top-left' );
						} }
						style="mapbox://styles/mapbox/streets-v11"
						containerStyle={ { height: '500px', width: '100%' } }
						zoom={ [ initialZoom || 11 ] }
						center={ [ centerLon || 0, centerLat || 0 ] }
						animationOptions={ animationOptions }
						onMoveEnd={ ( map ) => {
							if ( ! editingMap.current ) {
								const center = map.getCenter();
								const zoom = Math.round( map.getZoom() * 10 ) / 10;

								setPostMeta( {
									center_lat: center.lat,
									center_lon: center.lng,
									initial_zoom: zoom,
								} );
							}
						} }
					>
						{ ! hasError && renderLayer( debouncedPostMeta, {
							id: 1,
							use: 'fixed',
						} ) }
					</Map>
				</LayerPreviewPortal>
			) }
			<PluginDocumentSettingPanel name="settings" title={ __( 'Settings' ) }>
				<LayerSettings />
			</PluginDocumentSettingPanel>

			<PluginDocumentSettingPanel name="attribution-settings" title={ __( 'Attributions' ) }>
				<AttributionSettings />
			</PluginDocumentSettingPanel>

			<PluginDocumentSettingPanel name="legend-settings" title={ __( 'Legend' ) }>
				<LegendsEditor />
			</PluginDocumentSettingPanel>
		</Fragment>
	);
};
export default withDispatch(
	( dispatch ) => ( {
		setPostMeta: ( meta ) => {
			dispatch( 'core/editor' ).editPost( { meta } );
		},
		sendNotice: ( type, message, options ) => {
			dispatch( 'core/notices' ).createNotice( type, message, options );
		},
		removeNotice: ( id ) => {
			dispatch( 'core/notices' ).removeNotice( id );
		},
		lockPostSaving: () => {
			dispatch( 'core/editor' ).lockPostSaving( );
		},
		lockPostAutoSaving: ( key ) => {
			dispatch( 'core/editor' ).lockPostAutosaving( key );
		},
		unlockPostSaving: () => {
			dispatch( 'core/editor' ).unlockPostSaving( );
		},
	} )
)( withSelect(
	( select ) => ( {
		postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
	} )
)( LayersSidebar ) );
