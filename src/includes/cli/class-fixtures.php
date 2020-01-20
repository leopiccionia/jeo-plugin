<?php

namespace Jeo;

/**
 * Class used while developing, allow to create a bunch of layers and maps while the admin is not ready yet
 */
class Fixtures {

	private function get_fixtures_schema() {

		/**
		 * Schema of posts to be created / upated
		 *
		 * Once a post was created and the meta schema is changed, it will be updated when you call wp jeo fixtures update
		 */
		$posts = [


			/**
			 * Layers
			 */

			[
				'post_type' => 'map-layer',
				'post_title' => 'Layer1',
				'post_status' => 'mapbox',
				'meta' => [
					'type' => 'mapbox',
					'attribution' => 'Sample attribution for this layer',
					'layer_type_options' => [
						'style_id' => 'infoamazonia/cjvwvumyx5i851coa874sx97e'
					]
				]
			],
			[
				'post_type' => 'map-layer',
				'post_title' => 'Switchable',
				'post_status' => 'publish',
				'meta' => [
					'type' => 'tilelayer',
					'attribution' => 'Copyright the whole world',
					'layer_type_options' => [
						'url' => 'https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg'
					]
				]
			],
			[
				'post_type' => 'map-layer',
				'post_title' => 'Swapable 1',
				'post_status' => 'publish',
				'meta' => [
					'type' => 'tilelayer',
					'attribution' => 'Sample veryu long super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  super extra large  attribution for this layer',
					'layer_type_options' => [
						'url' => 'https://wri-tiles.s3.amazonaws.com/glad_prod/tiles/{z}/{x}/{y}.png'
					]
				]
			],
			[
				'post_type' => 'map-layer',
				'post_title' => 'Swapable 2',
				'post_status' => 'publish',
				'meta' => [
					'type' => 'mapbox',
					'attribution' => 'Sample attribution for <a href="http://jeo.com">this layer with a link</a>',
					'layer_type_options' => [
						'style_id' => 'infoamazonia/ck33yfty30o0s1dqpien3edi4'
					]
				]
			],


			/**
			 * Posts
			 */

			[
				'post_type' => 'post',
				'post_title' => 'Post 1',
				'post_status' => 'publish',
				'meta' => [
					'_primary_point' => [
						'_geocode_lat' => '-22,888889',
						'_geocode_lon' => '-47,081944',
						'_geocode_full_address' => 'Jardim Chapadão, Campinas, Região Imediata de Campinas, Região Metropolitana de Campinas, Região Intermediária de Campinas, São Paulo, Região Sudeste, 13069-901, Brasil',
						'_geocode_country' => 'Brasil',
						'_geocode_country_code' => '',
						'_geocode_city' => 'Campinas',
						'_geocode_region_level_2' => 'São Paulo',
						'_geocode_region_level_3' => 'Região Intermediária de Campinas',
						'_geocode_city_level_1' => 'Jardim Chapadão',
					],
					'_primary_point' => [
						'_geocode_lat' => '-23,57458535',
						'_geocode_lon' => '-46,628883891755',
						'_geocode_full_address' => 'Parque da Aclimação, Aclimação, Liberdade, São Paulo, Região Imediata de São Paulo, Região Metropolitana de São Paulo, Região Intermediária de São Paulo, São Paulo, Região Sudeste, 01534-001, Brasil',
						'_geocode_country' => 'Brasil',
						'_geocode_country_code' => '',
						'_geocode_city' => 'São Paulo',
						'_geocode_region_level_2' => 'São Paulo',
						'_geocode_region_level_3' => 'Região Intermediária de São Paulo',
						'_geocode_city_level_1' => 'Aclimação',
					]
				],
				'category' => [
					'category 1',
					'category 2'
				]
			],
			[
				'post_type' => 'post',
				'post_title' => 'Post 2',
				'post_status' => 'publish',
				'meta' => [
					'_primary_point' => [
						'_geocode_lat' => '-23,54659435',
						'_geocode_lon' => '-46,644533061712',
						'_geocode_full_address' => 'Edifício Copan, Rua Araújo, Vila Buarque, República, São Paulo, Região Imediata de São Paulo, Região Metropolitana de São Paulo, Região Intermediária de São Paulo, São Paulo, Região Sudeste, 01046-010, Brasil',
						'_geocode_country' => 'Brasil',
						'_geocode_country_code' => '',
						'_geocode_city' => 'São Paulo',
						'_geocode_region_level_2' => 'São Paulo',
						'_geocode_region_level_3' => 'Região Intermediária de São Paulo',
						'_geocode_city_level_1' => 'Vila Buarque',
					],
					'_secondary_point' => [
						'_geocode_lat' => '-23,183525102463',
						'_geocode_lon' => '-46,898231506348',
						'_geocode_full_address' => 'Rua Jorge Gebran, Parque do Colégio, Chácara Urbana, Jundiaí, Região Imediata de Jundiaí, Região Intermediária de Campinas, São Paulo, Região Sudeste, 13209-090, Brasil',
						'_geocode_country' => 'Brasil',
						'_geocode_country_code' => '',
						'_geocode_city' => 'Jundiaí',
						'_geocode_region_level_2' => 'São Paulo',
						'_geocode_region_level_3' => 'Região Intermediária de Campinas',
						'_geocode_city_level_1' => 'Parque do Colégio',
					]
				],
				'category' => [
					'category 2',
					'category 3'
				]
			],
			[
				'post_type' => 'post',
				'post_title' => 'Post 3',
				'post_status' => 'publish',
				'meta' => [
					'_primary_point' => [
						'_geocode_lat' => '-22,939108160587',
						'_geocode_lon' => '-46,542205810547',
						'_geocode_full_address' => 'Rua Belmiro Ramos Franco, Jardim São Lourenço, Bragança Paulista, Região Imediata de Bragança Paulista, Região Intermediária de Campinas, São Paulo, Região Sudeste, 12908-040, Brasil',
						'_geocode_country' => 'Brasil',
						'_geocode_country_code' => '',
						'_geocode_city' => 'Bragança Paulista',
						'_geocode_region_level_2' => 'São Paulo',
						'_geocode_region_level_3' => 'Região Intermediária de Campinas',
						'_geocode_city_level_1' => 'Jardim São Lourenço',
					],
					'_secondary_point' => [
						'_geocode_lat' => '-23,118574871158',
						'_geocode_lon' => '-46,564693450928',
						'_geocode_full_address' => 'Rua Clóvis Soares, Vila Lixão, Alvinópolis, Atibaia, Região Imediata de Bragança Paulista, Região Intermediária de Campinas, São Paulo, Região Sudeste, 12942-560, Brasil',
						'_geocode_country' => 'Brasil',
						'_geocode_country_code' => '',
						'_geocode_city' => 'Atibaia',
						'_geocode_region_level_2' => 'São Paulo',
						'_geocode_region_level_3' => 'Região Intermediária de Campinas',
						'_geocode_city_level_1' => 'Vila Lixão',
					]
				],
				'category' => [
					'category 3'
				]
			],



		];

		return $posts;

	}

	/**
	 * Allow update to be used in other contexts, such as tests
	 */
	private function success_msg($msg) {
		if( class_exists('WP_CLI') ) {
			\WP_CLI::success( $msg );
		}
	}

	private function get_post_by_schema( $schema ) {

		return get_page_by_title($schema['post_title'], 'OBJECT', $schema['post_type']);

	}

	private function get_posts() {

		$schema = $this->get_fixtures_schema();

		$results = [];

		foreach ($schema as $item) {

			$post = $this->get_post_by_schema( $item );
			if ( $post ) {
				$results[] = array_merge( ['ID' => $post->ID ], $item );
			}

		}

		return $results;

	}


	/**
	 * List current fixtures
	 *
	 * searches for items in the schema that are present in the database
	 */
	public function list() {

		$posts = $this->get_posts();

		\WP_CLI\Utils\format_items( 'table', $posts, array( 'ID', 'post_type', 'post_title', 'meta' ) );

	}

	/**
	 * Updates fixtures in the database
	 *
	 * This command reads the fixtures_schema and updates the database, creating and/or updating posts as necessary
	 *
	 * Note: post title and post type can not be update. If they are changed, a new post will be created
	 *
	 */
	public function update() {

		$schema = $this->get_fixtures_schema();

		foreach ($schema as $item) {

			$post = $this->get_post_by_schema( $item );

			if ( $post ) {
				$post_id = $post->ID;
				$message = "Existing post found ($post_id): ";
			} else {
				$new = $item;
				unset($new['meta']);
				$post_id = wp_insert_post($new);
				$message = "New post created ($post_id): ";
			}

			$this->success_msg( $message );

			foreach ( $item['meta'] as $key => $value ) {
				delete_post_meta( $post_id, $key );
			}

			foreach ( $item['meta'] as $key => $value ) {
				if ( add_post_meta( $post_id, $key, $value ) ) {
					$this->success_msg( "$key metadata updated" );
				}
			}

			$term1 = term_exists( 'category 1', 'category', 0 );
			$term2 = term_exists( 'category 2', 'category', 0 );
			$term3 = term_exists( 'category 3', 'category', 0 );

			if ( ! $term1 ) $term1 = wp_insert_term( 'category 1', 'category' );
			if ( ! $term2 ) $term2 = wp_insert_term( 'category 2', 'category' );
			if ( ! $term3 ) $term3 = wp_insert_term( 'category 3', 'category' );

			if ( isset($item['category']) ) {

				$cat_ids = [];

				foreach( $item['category'] as $cat ) {

					$term = get_term_by( 'name', $cat, 'category' );

					if ( ! $term ) $term = wp_insert_term( $cat, 'category' );

					$cat_ids[] = $term->term_id;

				}

				wp_set_post_categories( $post_id, $cat_ids );
			}


			// Create MAP post
			$map = get_page_by_title( 'Map 1', 'OBJECT', 'map');

			if ( $map ) {

				$map_id = $map->ID;
				$message = "Existing Map found ($map_id): ";

			} else {

				$map = [
					'post_type' => 'map',
					'post_title' => 'Map 1',
					'post_status' => 'publish',
					'post_content' => 'map content'
				];

				$map_id = wp_insert_post($map);

				$message = "New map created ($map_id): ";
			}
			$this->success_msg( $message );

			$map_layers = $this->get_map_layers();

			update_post_meta( $map_id, 'layers', $map_layers );

			$related = $this->get_map_related_posts();

			update_post_meta( $map_id, 'related_posts', (object) $related );

			update_post_meta( $map_id, 'initial_zoom', 1 );
			update_post_meta( $map_id, 'center_lat', 0 );
			update_post_meta( $map_id, 'center_lon', 0 );

		}

	}

	public function sample_maps() {

		$specs = $this->get_map_layers();

		$div = "<div class=\"jeomap\" data-center_lat=\"0\" data-center_lon=\"0\" data-initial_zoom=\"1\" data-layers='" . json_encode($specs) . "' ";

		$related = $this->get_map_related_posts();

		$div .= "data-related_posts='" . json_encode($related) . "' ";


		$div .= " style=\"width:600px; height: 600px;\"></div>";

		\WP_CLI::line( $div );

	}

	private function get_map_layers() {

		$layers = $this->get_posts();

		$layers = array_filter( $layers, function($el) {
			return $el['post_type'] == 'map-layer';
		});

		$specs = [
			[
				'use' => 'fixed',
			],
			[
				'use' => 'switchable',
				'default' => true
			],
			[
				'use' => 'swappable',
				'default' => true
			],
			[
				'use' => 'swappable',
				'default' => false
			]
		];

		$i = 0;

		foreach ( $layers as $layer ) {

			$specs[$i]['id'] = $layer['ID'];
			$i++;

		}

		return $specs;

	}

	private function get_map_related_posts() {
		$cat1 = get_term_by( 'name', 'category 1', 'category' );
		$cat2 = get_term_by( 'name', 'category 2', 'category' );
		$cat3 = get_term_by( 'name', 'category 3', 'category' );

		$related = [
			'cat' => [
				$cat1->term_id,
				$cat2->term_id,
				$cat3->term_id
			]
		];
		return $related;
	}
}
