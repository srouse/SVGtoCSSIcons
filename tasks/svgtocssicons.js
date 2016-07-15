'use strict';

var path = require("path");

var all_stylesheets = [];

module.exports = function (grunt) {

    grunt.registerMultiTask('svgtocssicons', 'process SVG to a CSS or SCSS style sheet', function () {

        var done = this.async();

        if ( this.files.length < 1 ) {
		    grunt.verbose.warn('Destination not written because no source files were provided.');
	    }

        var files = this.files.slice();
        var options = this.options();

        var type = "css";//( options.type ) ? options.type : "css";
        var prefix_filter = ( options.prefix_filter ) ? options.prefix_filter : false;
        var suffix_filter = ( options.suffix_filter ) ? options.suffix_filter : false;

        var prefix = ( options.prefix ) ? options.prefix : false;
        var mixin_name = ( options.mixin_name ) ? options.mixin_name : "all_icons";

        var sizes;// determined from file name...// = ( options.sizes ) ? options.sizes : [100];
        var default_size = ( options.default_size ) ? options.default_size : 100;

        var preserveAspectRatio = ( options.preserveAspectRatio ) ? options.preserveAspectRatio : false;

        function process() {

            if( files.length <= 0 ) {
                done();
                return;
            }

            var file = files.pop();
            var svgFiles = file.src;

            var scss=[],scss_macro=[],less=[],less_macro=[],css=[],javascript_array=[];
            var selector,fileName,fileName_arr,svg_less_encoded,svg_css_encoded,svg_scss_encoded;
            var selector_mixin_name;

            /*if ( type == "scss" ) {
                scss.push( scssFunctions() );
                scss_macro.push("\n@mixin " + mixin_name + "(");
                scss_macro.push("\t$suffix : '' , $color: '' , $preserveAspectRatio : 'xMaxYMax meet',");
                //scss_macro.push("\t$default_size: 24px, $size_suffixes: '', $sizes: '',");
                scss_macro.push("\t$extra_css : '', $extra_defs : ''");
                scss_macro.push(") {\n");
            }else if ( type == "less" ) {
                //less.push( lessFunctions() );
                less_macro.push("\n." + mixin_name + "( @suffix : '' , @color : '', @preserveAspectRatio : 'xMaxYMax meet', @extra_css : '', @extra_defs : '' ) {\n");
            }else{
                //css.push(  );
            }*/

            for ( var i=0; i<svgFiles.length; i++ ) {
                fileName = svgFiles[i];
                fileName_arr = fileName.split("/");
                selector = fileName_arr.pop().split(".")[0];

                if ( prefix_filter ) {
                    if ( selector.indexOf( prefix_filter ) !== 0 ) {
                        continue;
                    }
                    selector = selector.slice( prefix_filter.length );
                }

                if ( suffix_filter ) {
                    if (
                        selector.lastIndexOf( suffix_filter ) !==
                        ( selector.length - suffix_filter.length )
                    ) {
                        continue;
                    }

                    selector = selector.slice( 0, selector.lastIndexOf( suffix_filter ) );
                }

                if ( prefix ) {
                    selector = prefix + selector;
                }

                selector_mixin_name = mixin_name + "-" + selector;

                svg_css_encoded = grunt.file.read( fileName ).replace(/\'/g, "\"" );
                /*if ( type != "css" ) {
                    svg_css_encoded = svg_css_encoded.replace( /<defs>[\s\S]*?<\/defs>/g , "" );

                    if ( svg_css_encoded.indexOf("<defs>") == -1 ) {//sometimes defs and styles are missing...
                        svg_css_encoded = svg_css_encoded.replace(/<title>/g, "<defs><style></style></defs><title>" );
                    }

                    svg_css_encoded = svg_css_encoded.replace(/(preserveAspectRatio=')([a-zA-Z0-9:;\.\s\(\)\-\,]*)(')/ig, "" );
                    svg_css_encoded = svg_css_encoded.replace( /<svg / , "<svg preserveAspectRatio=\"xMaxYMax meet\" " );
                }*/

                svg_css_encoded = encodeURIComponent( svg_css_encoded );

                if ( type == "scss" ) {
                    // SCSS
                    /*svg_scss_encoded = svg_css_encoded.replace(
                        /\%20preserveAspectRatio\%3D\%22xMaxYMax\%20meet\%22/ ,
                        " preserveAspectRatio%3D%22#{unquote(svg-url( $preserveAspectRatio ))}%22"
                    );
                    svg_scss_encoded = svg_scss_encoded.replace(
                        /\%3C\%2Fstyle\%3E/g ,
                        "*%7Bfill%3A#{ svg-url( $color ) }%20!important%7D#{ unquote(svg-url( $extra_css ))}%3C%2Fstyle%3E   #{unquote(svg-url( $extra_defs ))}"
                    );

                    scss.push( "@mixin " +
                                selector_mixin_name +
                                " ( $color: '', $preserveAspectRatio : 'xMaxYMax meet' , $extra_css : '' , $extra_defs : '' ) { " +
                                "\n\t\tbackground-image: url('data:image/svg+xml;charset=US-ASCII," +
                                svg_scss_encoded +
                                "'); background-repeat: no-repeat; }" );

                    scss_macro.push("\t." + selector_mixin_name + "#{$suffix} {");
                    scss_macro.push("\t\t@include " + selector_mixin_name + "( $color, $preserveAspectRatio , $extra_css , $extra_defs );");
                    scss_macro.push("\t\tbackground-size: " + default_size + "px " + default_size + "px;");
                    scss_macro.push("\t}\n");

                    //scss_macro.push("\t." + selector + "#{$suffix} {");
                    //scss_macro.push("\t\t@extend ." + selector_mixin_name + "#{$suffix};");
                    //scss_macro.push("\t}\n");

                    /*
                    scss_macro.push("\t@if $size_suffixes != \"\" {");
                    scss_macro.push("\t\t@for $i from 1 through length($size_suffixes) {");
                    scss_macro.push("\t\t\t." + selector + "#{$suffix}#{nth($size_suffixes, $i)} {");
                    scss_macro.push("\t\t\t\t@extend ." + selector_mixin_name + "#{$suffix};");
                    scss_macro.push("\t\t\t\tbackground-size: nth($sizes, $i) nth($sizes, $i);");
                    scss_macro.push("\t\t\t}");
                    scss_macro.push("\t\t}");
                    scss_macro.push("\t}");
                    * /

                    var js_object = {
                        name:selector,
                        styles:[]
                    };

                    var size;
                    for ( var s=0; s<sizes.length; s++ ) {
                        size = sizes[s];
                        scss_macro.push("\t." + selector + "-" + size + "#{$suffix} {");
                        scss_macro.push("\t\t@extend ." + selector_mixin_name + "#{$suffix};");
                        scss_macro.push("\t\tbackground-size: " + size + "px " + size + "px;");
                        scss_macro.push("\t}");

                        js_object.styles.push({
                            name:selector + "-" + size,
                            size:size
                        });
                    }

                    javascript_array.push( js_object );*/

                }else if ( type == "less" ){
                    // LESS
                    /*svg_less_encoded = svg_css_encoded.replace(
                        /\%20preserveAspectRatio\%3D\%22xMaxYMax\%20meet\%22/ ,
                        " preserveAspectRatio%3D%22@{preserveAspectRatio-encoded}%22"
                    );
                    svg_less_encoded = svg_less_encoded.replace(
                        /\%3C\%2Fstyle\%3E/g,
                        "*%7Bfill%3A@{color-encoded}%7D@{css-encoded}%3C%2Fstyle%3E   @{defs-encoded}"
                    );

                    less.push( "." +
                                selector +
                                " ( @color: '', @preserveAspectRatio : 'xMaxYMax meet' , @extra_css : '' , @extra_defs : ''  ) { " +
                                "\n\t\t\ @color-encoded: escape( @color );" +
                                "\n\t\t\ @css-encoded: escape( @extra_css );" +
                                "\n\t\t\ @defs-encoded: escape( @extra_defs );" +
                                "\n\t\t\ @preserveAspectRatio-encoded: escape( @preserveAspectRatio );" +
                                "\n\t\tbackground-image: url('data:image/svg+xml;charset=US-ASCII," +
                                svg_less_encoded +
                                "'); \n\t\tbackground-repeat: no-repeat;}" );
                    less_macro.push("\t." + selector + "@{suffix} {");
                    less_macro.push("\t\t." + selector + "( @color, @preserveAspectRatio , @extra_css , @extra_defs );");
                    less_macro.push("\t}\n");*/
                }else{

                    var filename_info = getSizesFromFilename( selector );
                    sizes = filename_info.size_info;
                    selector = filename_info.name;

                    var js_object = {
                        name:selector,
                        styles:[]
                    };


                    var size,main_selectors = [];
                    for ( var s=0; s<sizes.length; s++ ) {
                        size = sizes[s];
                        main_selectors.push( "." + selector + "-" + size );
                    }

                    css.push("\n" + main_selectors.join(", ") + " {");
                    css.push( "\tbackground-image: url('data:image/svg+xml;charset=US-ASCII," + svg_css_encoded + "');" );
                    css.push( "\tbackground-repeat: no-repeat;" );
                    css.push("}");

                    for ( var s=0; s<sizes.length; s++ ) {
                        size = sizes[s];
                        css.push("\t." + selector + "-" + size + " {");
                        css.push("\t\tbackground-size: " + size + "px " + size + "px;");
                        css.push("\t}");

                        js_object.styles.push({
                            name:selector + "-" + size,
                            size:size
                        });
                    }

                    javascript_array.push( js_object );
                }
            }

            if ( type == "scss" ) {
                //scss_macro.push("}\n");
                //grunt.file.write( file.dest + ".scss" , scss.join("\n") + "\n\n\n" + scss_macro.join("\n") );
            }else if ( type == "less" ){
                //less_macro.push("}\n");
                //grunt.file.write( file.dest + ".less" , less.join("\n") + "\n\n\n" + less_macro.join("\n") );
            }else{
                grunt.file.write( file.dest + ".css" , css.join("\n") );
            }

            grunt.file.write( file.dest + ".json" , JSON.stringify( javascript_array ) );

            var dest_filename_array = file.dest.split("/");
            var dest_filename = dest_filename_array.pop();
            var dest_folder = dest_filename_array.join("/");

            all_stylesheets.push( dest_filename );

            // writes it everytime, but I want to make sure that multiple entries are accomodated
            var icons_html_filename = require.resolve( "../icon_viewer/icons.html" );
            var icons_html_content = grunt.file.read( icons_html_filename );
            var icons_html_content = icons_html_content.replace( "{%- icon_urls %}" ,  JSON.stringify( all_stylesheets ) );
            grunt.file.write( dest_folder + "/icons.html" , icons_html_content );

            process();
        }
        process();


        function getSizesFromFilename ( filename ) {
            //var filename_arr = filename.split(".");
            //filename_arr.unshift();
            var filename_arr = filename.split("-");
            var size_info = filename_arr.pop();
            var size_info_arr = size_info.split(",");

            var final_size_info = [];
            for ( var i=0; i<size_info_arr.length; i++ ) {
                var size = parseInt( size_info_arr[i] );
                if ( size != 0 && !isNaN( size ) ) {
                    final_size_info.push( size );
                }
            }

            return {
                size_info:final_size_info,
                name:filename_arr.join("-")
            };
        }


        function scssFunctions () {
            var scss = [];
            scss.push("\n\n@function str-replace($string, $search, $replace: '') { ");
            scss.push("    $index: str-index($string, $search); ");
            scss.push("    @if $index { @return str-slice($string, 1, $index - 1) + $replace + str-replace(str-slice($string, $index + str-length($search)), $search, $replace); } ");
            scss.push("    @return $string;  ");
            scss.push("}\n ");
            scss.push("@function svg-url($svg){ ");
            scss.push("    $svg: str-replace(inspect( $svg ),'\"','%22'); ");
            scss.push("    $svg: str-replace($svg,'<','%3C'); ");
            scss.push("    $svg: str-replace($svg,'>','%3E'); ");
            scss.push("    $svg: str-replace($svg,'&','%26'); ");
            scss.push("    $svg: str-replace($svg,'#','%23'); ");
            scss.push("    $svg: str-replace($svg,' ','%20'); ");
            scss.push("    $svg: str-replace($svg,':','%3a'); ");
            scss.push("    $svg: str-replace($svg,'{','%7b'); ");
            scss.push("    $svg: str-replace($svg,'}','%7d'); ");
            scss.push("    @return $svg;   ");
            scss.push("}\n ");

            return scss.join("\n");
        }

        function produceHTMLExample () {



        }

    });

}
