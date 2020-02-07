window.JeoLayerTypes.registerLayerType( 'mapbox', {
	addStyle( map, attributes ) {

		this
		._getStyleDefinition( attributes )
		.then( function( styleDefinition ) {
			styleDefinition.glyphs = 'mapbox://fonts/' + jeo_settings.mapbox_username + '/{fontstack}/{range}.pbf';
			return map.setStyle( styleDefinition );
		} );

	},

	addLayer( map, attributes ) {
		const access_token =
			typeof attributes.layer_type_options.access_token !== 'undefined' ?
				attributes.layer_type_options.access_token :
				window.mapboxgl.accessToken;




		return this
		._getStyleDefinition( attributes )
		.then( function( styleDefinition ) {

			Object.entries(styleDefinition.sources).forEach( ([source_key, source]) => {
				map.addSource( attributes.layer_id + '_' + source_key, source );

			});

			styleDefinition.layers.forEach(layer => {

				layer.id = attributes.layer_id + '_' + layer.id;

				if ( ! attributes.visible ) {
					layer.layout = {
						visibility: 'none',
					};
				}

				if ( layer.source ) {
					layer.source = attributes.layer_id + '_' + layer.source;
					map.addLayer( layer );
				}

			});

		} )
		.catch( function( error ) {
			console.log( error );
		} );

	},

	addInteractions( map, attributes ) {
		if (attributes.layer_type_options.interactions) {

			const int = attributes.layer_type_options.interactions;

			int.forEach( interaction => {

				let parentLayer = false;

				// find layer
				Object.keys(map.style._layers).forEach( key => {
					if ( map.style._layers[key].sourceLayer == interaction.id ) {
						parentLayer = map.style._layers[key];
					}
				});

				if (parentLayer) {

					let popUp = new mapboxgl.Popup({
						closeButton: false,
						closeOnClick: true
					});

					const type = interaction.on == 'click' || interaction.on == 'mouseover' ? interaction.on : 'click';

					map.on(type, parentLayer.id, function(e) {
						// Change the cursor style as a UI indicator.
						map.getCanvas().style.cursor = 'pointer';

						var feature = e.features[0];

						var coordinates = feature.geometry.coordinates.slice();

						// Ensure that if the map is zoomed out such that multiple
						// copies of the feature are visible, the popup appears
						// over the copy being pointed to.
						while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
							coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
						}

						var html = '';

						// title
						if ( feature.properties.hasOwnProperty(interaction.title) ) {
							html += '<h3>' + feature.properties[interaction.title] + '</h3>';
						}

						interaction.fields.forEach( (field) => {
							if ( feature.properties.hasOwnProperty(field.field) ) {
								html += '<p><strong>' + field.label + ': </strong>' + feature.properties[field.field] + '</p>';
							}
						});

						// Populate the popup and set its coordinates
						// based on the feature found.
						popUp.setLngLat([e.lngLat.lng, e.lngLat.lat])
							.setHTML(html)
							.addTo(map);
					});
					map.on('mouseenter', parentLayer.id, function () {
						map.getCanvas().style.cursor = 'pointer';
					});
					map.on('mouseleave', parentLayer.id, function() {
						map.getCanvas().style.cursor = '';
						//popUp.remove();
					});

				}

			});
		}
	},

	getSchema( attributes ) {
		const base_schema = {
			type: 'object',
			required: [ 'style_id' ],
			properties: {
				style_id: {
					type: 'string',
					title: 'Style ID',
				},
				access_token: {
					type: 'string',
					title: 'Access token',
					description:
						'Optional. If this layer needs a different access token from the one set in Settings, inform it here.',
				},
			},
		};

		if ( ! attributes ) {
			return Promise.resolve( base_schema );
		}

		const self = this;

		return new Promise( function( resolve, reject ) {
			const form_layers = [];

			self
				._getStyleLayers( attributes )
				.then( function( layers ) {
					if ( layers.vector_layers ) {
						//console.log(layers.vector_layers);
						for ( let l = 0; l < layers.vector_layers.length; l++ ) {
							const new_layer = {
								id: layers.vector_layers[ l ].id,
								fields: layers.vector_layers[ l ].fields,
							};
							form_layers.push( new_layer );
						}
					}

					// TODO: merge form_layers to the schema
					// console.log( form_layers );

					resolve( base_schema );
				} )
				.catch( function( error ) {
					reject( error );
				} );
		} );
	},

	_styleDefinitions: [],
	_styleLayers: [],

	_getStyleDefinition( attributes ) {
		const self = this;

		return new Promise( function( resolve, reject ) {
			// cache
			if ( self._styleDefinitions[ attributes.layer_id ] ) {
				resolve( self._styleDefinitions[ attributes.layer_id ] );
			}

			const access_token =
				typeof attributes.layer_type_options.access_token !== 'undefined' ?
					attributes.layer_type_options.access_token :
					window.mapboxgl.accessToken;

			jQuery.get(
				'https://api.mapbox.com/styles/v1/' +
					attributes.layer_type_options.style_id +
					'?access_token=' +
					access_token,
				function( data ) {
					self._styleDefinitions[ attributes.layer_id ] = data;
					resolve( data );
				}
			);
		} );
	},

	_getStyleLayers( attributes ) {
		const self = this;

		return new Promise( function( resolve, reject ) {
			// cache
			if ( self._styleLayers[ attributes.layer_id ] ) {
				resolve( self._styleLayers[ attributes.layer_id ] );
			}

			const access_token =
				typeof attributes.layer_type_options.access_token !== 'undefined' ?
					attributes.layer_type_options.access_token :
					window.mapboxgl.accessToken;

			self._getStyleDefinition( attributes ).then( function( styleDefinition ) {
				const composite =
					self._styleDefinitions[ attributes.layer_id ].sources.composite;

				if ( typeof composite === 'object' ) {
					const layers = composite.url.replace( 'mapbox://', '' );
					jQuery.get(
						'https://api.mapbox.com/v4/' +
							layers +
							'.json?secure&access_token=' +
							access_token,
						function( data ) {
							self._styleLayers[ attributes.layer_id ] = data;
							resolve( data );
						}
					);
				} else {
					reject( 'No composite source' );
				}
			} );
		} );
	},
} );
