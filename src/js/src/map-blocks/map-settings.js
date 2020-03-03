import React from 'react';
import ReactMapboxGl from 'react-mapbox-gl';
import { TextControl, RangeControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const MapboxAPIKey = window.jeo_settings.mapbox_key;

const Map = ReactMapboxGl( { accessToken: MapboxAPIKey } );

const mapDefaults = {
	initial_zoom: jeo_settings.map_defaults.zoom,
	center_lat: jeo_settings.map_defaults.lat,
	center_lon: jeo_settings.map_defaults.lng,
	min_zoom: 0,
	max_zoom: 20
};

export default ( { attributes, setAttributes } ) => {

	const {
		center_lat: centerLat,
		center_lon: centerLon,
		initial_zoom: initialZoom,
		min_zoom: minZoom,
		max_zoom: maxZoom,
	} = { ...mapDefaults, ...attributes };

	const attributeUpdater = ( attribute ) => ( value ) =>
		setAttributes( { ...attributes, [ attribute ]: value } );

	return (
		<Fragment>
			<form className="jeo-map-settings">
				<section className="map-preview">
					{ MapboxAPIKey && (
						<Map
							style="mapbox://styles/mapbox/streets-v11"
							containerStyle={ { height: '500px', width: '600px' } }
							zoom={ [ initialZoom || 11 ] }
							center={ [ centerLon || 0, centerLat || 0 ] } // @TODO: add default center to jeo settings
							onMoveEnd={ ( map ) => {
								const center = map.getCenter();
								setAttributes( {
									...attributes,
									center_lat: center.lat,
									center_lon: center.lng,
									initial_zoom: Math.round( map.getZoom() * 10 ) / 10,
								} );
							} }
						/>
					) }
				</section>
				<section className="center">
					<h3>{ __( 'Center' ) }</h3>
					<TextControl
						type="number"
						label={ __( 'Latitude' ) }
						value={ centerLat }
						onChange={ attributeUpdater( 'center_lat' ) }
					/>
					<TextControl
						type="number"
						label={ __( 'Longitude' ) }
						value={ centerLon }
						onChange={ attributeUpdater( 'center_lon' ) }
					/>
				</section>
				<section className="zoom">
					<h3>{ __( 'Zoom' ) }</h3>
					<RangeControl
						label={ __( 'Initial zoom' ) }
						initialPosition={ 11 }
						min={ 0 }
						max={ 20 }
						step={ 0.1 }
						value={ initialZoom }
						onChange={ attributeUpdater( 'initial_zoom' ) }
					/>
					<RangeControl
						label={ __( 'Min zoom' ) }
						initialPosition={ 0 }
						min={ 0 }
						max={ 20 }
						step={ 0.1 }
						value={ minZoom }
						onChange={ attributeUpdater( 'min_zoom' ) }
					/>
					<RangeControl
						label={ __( 'Max zoom' ) }
						initialPosition={ 20 }
						min={ 0 }
						max={ 20 }
						step={ 0.1 }
						value={ maxZoom }
						onChange={ attributeUpdater( 'max_zoom' ) }
					/>
				</section>
			</form>
		</Fragment>
	);
};
