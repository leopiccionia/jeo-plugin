import { Button, Dashicon, PanelBody, SelectControl, TextControl } from '@wordpress/components';
import { Fragment, useCallback, useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import './interaction-settings.css';

const eventOptions = [
	{ label: __( 'No', 'jeo' ), value: 'none' },
	{ label: __( 'On click', 'jeo' ), value: 'click' },
	{ label: __( 'On hover', 'jeo' ), value: 'mouseover' },
];

export default function InteractionSettings( {
	interaction,
	interactionIndex,
	layer,
	onInsert,
	onUpdate,
	onDelete,
} ) {
	const titleOptions = useMemo( () => {
		return [
			{ label: __( 'None', 'jeo' ), value: undefined },
			...Object.keys( layer.fields ).map( ( field ) => {
				return { label: field, value: field };
			} ),
		];
	}, [ layer.fields ] );

	const unusedFieldOptions = useMemo( () => {
		return Object.keys( layer.fields ).flatMap( ( key ) => {
			const found = interaction.fields.find( ( { field } ) => {
				return field === key;
			} );
			return found ? [] : [ { label: key, value: key } ];
		} );
	}, [ layer.fields, interaction.fields ] );

	const [ newField, setNewField ] = useState( null );

	useEffect( () => {
		setNewField( unusedFieldOptions.length > 0 ?
			unusedFieldOptions[ 0 ].value :
			null
		);
	}, [ unusedFieldOptions ] );

	const changeEvent = useCallback( ( on ) => {
		if ( on === 'none' && interactionIndex !== -1 ) {
			onDelete( interaction.id );
		} else if ( on !== 'none' ) {
			onInsert( { ...interaction, on } );
		}
	} );

	const changeTitle = useCallback( ( title ) => {
		onUpdate( interaction.id, { ...interaction, title } );
	} );

	const addField = useCallback( () => {
		onUpdate( interaction.id, {
			...interaction,
			fields: [
				...interaction.fields,
				{ field: newField, label: '' },
			],
		} );
	}, [ interaction, onUpdate ] );

	const updateLabel = ( key ) => ( label ) => {
		onUpdate( interaction.id, {
			...interaction,
			fields: interaction.fields.map( ( field ) => {
				return ( field.field === key ) ? { ...field, label } : field;
			} ),
		} );
	};

	const deleteField = ( key ) => ( ) => {
		onUpdate( interaction.id, {
			...interaction,
			fields: interaction.fields.filter( ( field ) => {
				return field.field !== key;
			} ),
		} );
	};

	const interactive = interaction.on !== 'none';

	return (
		<PanelBody className="jeo-interaction-settings" title={ layer.id } initialOpen={ interactive }>
			<SelectControl
				label={ __( 'Show popup?', 'jeo' ) }
				value={ interaction.on }
				options={ eventOptions }
				onChange={ changeEvent }
			/>
			{ interactive && (
				<Fragment>
					<SelectControl
						label={ __( 'Title' ) }
						value={ interaction.title }
						options={ titleOptions }
						onChange={ changeTitle }
					/>

					{ ( unusedFieldOptions.length > 0 ) && (
						<Fragment>
							<SelectControl
								label={ __( 'Add field', 'jeo' ) }
								value={ newField }
								options={ unusedFieldOptions }
								onChange={ setNewField }
							/>
							<Button isPrimary onClick={ addField }>
								{ __( 'Add' ) }
							</Button>
						</Fragment>
					) }

					{ ( interaction.fields.length > 0 ) && (
						<fieldset className="jeo-interaction-fields">
							<legend>{ __( 'Fields', 'jeo' ) }</legend>
							<div className="jeo-interaction-fields__grid">
								{ interaction.fields.map( ( { field, label } ) => {
									const inputId = `${ layer.id }_${ field }`;
									return (
										<Fragment key={ field }>
											<label htmlFor={ inputId }>{ field }</label>
											<TextControl
												id={ inputId }
												value={ label }
												placeholder={ layer.fields[ field ] }
												onChange={ updateLabel( field ) }
											/>
											<Button onClick={ deleteField( field ) }>
												<Dashicon icon="no-alt" />
											</Button>
										</Fragment>
									);
								} ) }
							</div>
						</fieldset>
					) }
				</Fragment>
			) }
		</PanelBody>
	);
}
