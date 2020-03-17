import { withSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import { IntervalSelector } from './interval-selector';
import { MetaSelector } from './meta-selector';
import { TokensSelector } from './tokens-selector';

const PostsSelector = ( {
	loadedCategories,
	loadingCategories,
	loadedTags,
	loadingTags,
	relatedPosts,
	setRelatedPosts,
	renderPanel: Panel,
} ) => {
	useEffect( () => {
		/* relatedPosts is often nullish if schema doesn't match */
		if ( ! relatedPosts ) {
			setRelatedPosts( {} );
		}
	}, [ relatedPosts, setRelatedPosts ] );

	return (
		<Panel name="related-posts" title={ __( 'Related posts', 'jeo' ) }>
			{ loadedCategories && (
				<TokensSelector
					label={ __( 'Categories' ) }
					collection={ loadedCategories }
					loadingCollection={ loadingCategories }
					value={ relatedPosts.categories }
					onChange={ ( tokens ) => {
						setRelatedPosts( { ...relatedPosts, categories: tokens } );
					} }
				/>
			) }

			{ loadedTags && (
				<TokensSelector
					label={ __( 'Tags' ) }
					collection={ loadedTags }
					loadingCollection={ loadingTags }
					value={ relatedPosts.tags }
					onChange={ ( tokens ) => {
						setRelatedPosts( { ...relatedPosts, tags: tokens } );
					} }
				/>
			) }

			<IntervalSelector
				startDate={ relatedPosts.after }
				endDate={ relatedPosts.before }
				startLabel={ __( 'Start date', 'jeo' ) }
				endLabel={ __( 'End date', 'jeo' ) }
				onStartChange={ ( date ) => {
					setRelatedPosts( { ...relatedPosts, after: date ? date.toISOString() : undefined } );
				} }
				onEndChange={ ( date ) => {
					setRelatedPosts( { ...relatedPosts, before: date ? date.toISOString() : undefined } );
				} }
			/>

			<MetaSelector
				label={ __( 'Meta queries', 'jeo' ) }
				value={ relatedPosts.meta_query }
				onChange={ ( queries ) => {
					setRelatedPosts( { ...relatedPosts, meta_query: queries } );
				} }
			/>
		</Panel>
	);
};

export default withSelect(
	( select ) => ( {
		loadedCategories: select( 'core' ).getEntityRecords( 'taxonomy', 'category' ),
		loadingCategories: select( 'core/data' ).isResolving( 'core', 'getEntityRecords', [
			'taxonomy',
			'category',
		] ),
		loadedTags: select( 'core' ).getEntityRecords( 'taxonomy', 'post_tag' ),
		loadingTags: select( 'core/data' ).isResolving( 'core', 'getEntityRecords', [
			'taxonomy',
			'post_tag',
		] ),
	} )
)( PostsSelector );
