<?php

namespace Jeo;

class Settings {

	use Singleton;

	public $option_key = 'jeo-settings';

	protected function init() {

		$this->default_options = [
			'enabled_post_types' => [
				'post'
			],
			'active_geocoder' => 'nominatim',
			'map_default_zoom' => 11,
			'map_default_lat' => -23.54998517,
			'map_default_lng' => -46.65599340,
		];

		add_action('admin_menu', [$this, 'add_menu_item']);
		add_action('admin_init', [$this, 'admin_init']);
		add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);
		add_action( 'wp_enqueue_scripts', 'jeo_scripts_typography' );
	}

	public function get_option( $option_name ) {
		$options = get_option($this->option_key);
		if (!$options) {
			$options = [];
		}
		$options = array_merge($this->default_options, $options);
		if ( isset($options[$option_name]) ) {
			return $options[$option_name];
		}
		return null;
	}

	public function get_field_name($name) {
		return $this->option_key . '[' . $name . ']';
	}

	public function get_geocoder_option_field_name($geocoder, $name) {
		return $this->get_field_name('geocoders') . '[' . $geocoder . ']' . '[' . $name . ']';
	}

	public function get_geocoder_options($geocoder_slug) {
		$options = $this->get_option('geocoders');
		$geoObj = \jeo_geocode_handler()->initialize_geocoder($geocoder_slug);
		$defaults = $geoObj->get_default_options();
		$current = isset($options[$geocoder_slug]) ? $options[$geocoder_slug] : [];
		//var_dump($options); die;
		return array_merge($defaults, $current);
	}

	public function get_geocoder_option($geocoder_slug, $option_name) {
		$options = $this->get_geocoder_options($geocoder_slug);
		return isset($options[$option_name]) ? $options[$option_name] : '';
	}

	public function admin_init() {
		register_setting( 'jeo-settings', $this->option_key );
	}

	public function enqueue_admin_scripts($page) {
		if ($page == 'jeo_page_jeo-settings') {
			wp_enqueue_script('jeo-settings', JEO_BASEURL . '/includes/settings/settings-page.js', ['jquery']);
		}
	}

	public function add_menu_item() {
		add_submenu_page(
			'jeo-main-menu',
			__('Jeo Settings', 'jeo'),
			'Jeo Settings',
			'manage_options',
			'jeo-settings',
			[$this, 'admin_page']
			// $icon_url:string,
			// $position:integer|null
		);
	}

	public function admin_page() {
		include 'settings-page.php';
	}

}
