<?php

function hello_elementor_child_enqueue_scripts()
{
	wp_enqueue_style(
		'hello-elementor-child-style',
		get_stylesheet_directory_uri() . '/css/build/main.min.css',
		[
			'hello-elementor-theme-style',
		],
		'1.0.1'
	);
	wp_enqueue_script(
		'hello-elementor-child-script',
		get_stylesheet_directory_uri() . '/js/build/main.min.js',
		[
			'hello-elementor-theme-script',
		],
		'1.0.1'
	);
}



add_action('wp_enqueue_scripts', 'hello_elementor_child_enqueue_scripts', 20);

// Allow SVG
add_filter( 'wp_check_filetype_and_ext', function($data, $file, $filename, $mimes) {

	global $wp_version;
	if ( $wp_version !== '4.7.1' ) {
	   return $data;
	}
  
	$filetype = wp_check_filetype( $filename, $mimes );
  
	return [
		'ext'             => $filetype['ext'],
		'type'            => $filetype['type'],
		'proper_filename' => $data['proper_filename']
	];
  
  }, 10, 4 );
  
  function wppln_mime_types( $mimes ){
	$mimes['svg'] = 'image/svg+xml';
	return $mimes;
  }
  add_filter( 'upload_mimes', 'wppln_mime_types' );
  
  function wppln_fix_svg() {
	echo '<style type="text/css">
		  .attachment-266x266, .thumbnail img {
			   width: 100% !important;
			   height: auto !important;
		  }
		  </style>';
  }
  add_action( 'admin_head', 'wppln_fix_svg' );


?>