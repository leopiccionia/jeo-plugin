<h3><?php the_title(); ?></h3>
<?php the_post_thumbnail(); ?>
<?php the_content(); ?>
<?php _e('Attribution: ', 'jeo'); ?><a href="<?php echo esc_url( get_post_meta( get_the_ID(), 'attribution', true ) ); ?>"><?php echo esc_html( get_post_meta( get_the_ID(), 'attribution', true ) ); ?></a>
<?php if ( $source_url ): ?>
	<p>
		<a href="<?php echo esc_url( $source_url );?>" class="download-source"><?php _e('Download from source', 'jeo'); ?></a>
	</p>
<?php endif; ?>
