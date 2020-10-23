import { Button, SelectControl, CheckboxControl, TextareaControl, Spinner, Icon } from '@wordpress/components';
import { withDispatch, withSelect } from '@wordpress/data';
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useState,
	useRef,
} from '@wordpress/element';
import { __ } from '@wordpress/i18n';
// import { useDebounce } from 'use-debounce';

const CartoIntegration = ( { postMeta, setPostMeta }) => {
	const [ useCartoIntegration, setUseCartoInteration ] = useState(postMeta.use_carto_integration)
	const [ cartoSQLQuery, setCartoSQLQuery ] = useState(postMeta.carto_integration_sql);
	const [ processingGeoJsonStatus, setProcessingGeoJsonStatus ] = useState( { doneGeoJsonStage: false, doingGeoJsonStage: false, error: false } );
	const [ uploudingToMabbox, setUploudingToMabbox ] = useState( false );

	const cartoIntegrationProcess = () => {
		const sure = confirm(__("This action will overwrite current layer settings"));
		const url = `${window.location.origin}/wp-json/jeowp/carto_integrate`;

		if(!sure) {
			return;
		}

		setProcessingGeoJsonStatus({ doneGeoJsonStage: false, doingGeoJsonStage: true, error: false })
		setPostMeta( { ...postMeta, type: "mapbox-tileset-vector"} );

		fetch(url, {
			method: 'POST',
			headers: {
				'X-WP-Nonce': jeo_settings.nonce,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				sql_query: cartoSQLQuery,
			})
		}).then(response => response.json()).then(data => {
			// console.log("Done, data bellow:");
			let retrievedUploudObject = false;

			if (data.hasOwnProperty('error')) {
				setProcessingGeoJsonStatus({ doneGeoJsonStage: false, doingGeoJsonStage: false, error: data.error })
			} else {
				setProcessingGeoJsonStatus({ doneGeoJsonStage: true, doingGeoJsonStage: false, error: false })
				retrievedUploudObject = data.content;
			}

			if(retrievedUploudObject) {
				retrievedUploudObject = JSON.parse(retrievedUploudObject);

				const timerId = setInterval(() => {
					const owner = retrievedUploudObject.owner;
					const id = retrievedUploudObject.id;
					const uploudStatusUrl = `https://api.mapbox.com/uploads/v1/${owner}/${id}?access_token=${jeo_private_options.mapbox_private_key}`;

					fetch(uploudStatusUrl).then(uploudResponse => uploudResponse.json()).then( uploudData => {
						if(uploudData.complete) {
							setUploudingToMabbox(true);
							clearInterval(timerId);

							setPostMeta( {
								...postMeta,
								type: "mapbox-tileset-vector",
								layer_type_options: {
									source_layer: uploudData.name,
									tileset_id: uploudData.tileset,
									style_source_type: "vector"
								},
							} )

							console.log(postMeta);
							console.log(uploudData);
						}
					})
				}, 5000);
			}
		})
		;
	}

	return (
		<>
			<CheckboxControl
				label={ __( 'Use integration' ) }
				checked={ useCartoIntegration }
				onChange={ () => {
					setUseCartoInteration(!postMeta.use_carto_integration);
					setPostMeta( {
						...postMeta,
						use_carto_integration: !postMeta.use_carto_integration
					 } )
				} }
			/>

			{ useCartoIntegration &&
				<>
					<TextareaControl
						label={ __( 'SQL Query' ) }
						value={ cartoSQLQuery }
						onChange={ ( value ) => {
							setCartoSQLQuery(value);
							setPostMeta( {
								...postMeta,
								carto_integration_sql: value
							} )
						} }
						type="textarea"
					/>
					{ cartoSQLQuery.length > 0 &&
						<Button isSecondary onClick={ cartoIntegrationProcess } disabled={ processingGeoJsonStatus.doingGeoJsonStage || processingGeoJsonStatus.doneGeoJsonStage ||  uploudingToMabbox }>
							{ __("Syncronize") }
						</Button>
					}
					<div className="migration-status">
						{ !processingGeoJsonStatus.doneGeoJsonStage &&  processingGeoJsonStatus.doingGeoJsonStage && <Spinner /> }
						{ processingGeoJsonStatus.doneGeoJsonStage && !processingGeoJsonStatus.doingGeoJsonStage &&
							<>
								<br />
								<p> { __("Succesfull tileset migration") } </p>
							</>
						}

						{ (!processingGeoJsonStatus.doneGeoJsonStage && !processingGeoJsonStatus.doingGeoJsonStage && processingGeoJsonStatus.error) &&
							<span> Error: { processingGeoJsonStatus.error } </span>
						}

						{ processingGeoJsonStatus.doneGeoJsonStage &&  !uploudingToMabbox &&
							<>
								<p>
									<Spinner />
									{ __("Uploading staged file to Mapbox") }
								</p>
							</>
						}

						{ processingGeoJsonStatus.doneGeoJsonStage &&  uploudingToMabbox &&
							<>
								<p>
									{ __("All set! Check") }
									<strong> { __("\"Settings\"") } </strong>
									{ __("panel above.") }
								</p>
							</>
						}
					</div>

				</>
			}
		</>
	)
}

export default withDispatch( ( dispatch ) => ( {
	setPostMeta: ( meta ) => {
		dispatch( 'core/editor' ).editPost( { meta } );
	},
} ) )(
	withSelect( ( select ) => ( {
		postMeta: select( 'core/editor' ).getEditedPostAttribute( 'meta' ),
	} ) )( CartoIntegration )
);
