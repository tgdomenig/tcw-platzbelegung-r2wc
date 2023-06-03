<?php

add_action( 'wp_enqueue_scripts', 'my_theme_enqueue_styles' );

function my_theme_enqueue_styles() {

    /* ---- child theme boiler plate according to WP Codex ---- */
    $parent_style = 'parent-style';

    wp_enqueue_style( $parent_style, get_template_directory_uri() . '/style.css' );
 
    wp_enqueue_style( 'child-style',
        get_stylesheet_directory_uri() . '/style.min.css',
        array( $parent_style ),
        wp_get_theme()->get('Version')
    );

}

/*
add_action( 'generate_before_main_content','generate_before_main_content_fn' );  
*/

/*
add_action( 'generate_after_header','generate_before_main_content_fn' );  

function generate_before_main_content_fn() {
	echo '<div class="itc_sponsoren">';
	echo do_shortcode('[foogallery id="114"]');
	echo '</div>';
 }
 */