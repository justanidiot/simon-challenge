var gulp = require('gulp');
// Gulp dependencies for HTML files
var htmlmin = require('gulp-htmlmin');
// Gulp dependencies for our stylesheets
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
// gulp dependencies for our scripts
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
// Sourcemaps for debugging minified files
var sourcemaps = require('gulp-sourcemaps');
// Deleting files and folders
var del = require('del');
// Development server and live-reload functionalities
var browserSync = require('browser-sync');

// Source files config
var app = {
	source: {
		js: [
			'bower_components/jquery/dist/jquery.js',
			'bower_components/bootstrap/dist/js/bootstrap.js',
			'bower_components/datatables.net/js/jquery.dataTables.js',
			'bower_components/datatables.net-bs/js/dataTables.bootstrap.js',
			'js/main.js'
		],
		less: 'less/app.less',
		fonts: 'bower_components/bootstrap/fonts/**/*.*'
	},
	dest: {
		js: 'js',
		css: 'css',
		fonts: 'fonts'
	}
};

// Build/Production config
var build = {
	src: {
		css: 'css/app.css',
		js: 'js/app.js',
		fonts: 'fonts/*.*',
		html: 'index.html'
	},
	dest: {
		css: '../build/css',
		js: '../build/js',
		fonts: '../build/fonts',
		html: '../build/',
	}
};

var serve = done => {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	done();
};

var styles = done => {
	return gulp.src( app.source.less )
    	.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(less())
		.pipe(cleanCSS())
  		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest( app.dest.css ));

	done();
};

var fonts = done => {
	return gulp.src( app.source.fonts )
		.pipe(gulp.dest( app.dest.fonts ));
	done();
};

var scripts = done => {
	return gulp.src( app.source.js )
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(concat('app.js'))
    .pipe(uglify({
    	mangle: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest( app.dest.js ));

    done();
};

var buildStyles = done => {
	return gulp.src( build.src.css )
		.pipe(gulp.dest( build.dest.css ));
	done();
};

var buildScripts = done => {
	return gulp.src( build.src.js )
		.pipe(gulp.dest( build.dest.js ));
	done();
};

var buildFonts = done => {
	return gulp.src( build.src.fonts )
		.pipe(gulp.dest( build.dest.fonts ));
	done();
};

var buildHtml = done => {
	return gulp.src( build.src.html )
		.pipe(htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest( build.dest.html ));
	done();
};

var cleanBuild = done => {
	return del('../build/', { force: true }).then( paths => {
		done();
	})
};

var reloadBrowser = done => {
	browserSync.reload();
	done();
};

// gulp.task('build', gulp.series(styles, fonts, scripts, build));
gulp.task('build', gulp.series(styles, fonts, scripts, cleanBuild, buildStyles, buildScripts, buildFonts, buildHtml ));

gulp.task('default', gulp.series( styles, fonts, scripts, serve, done => {
	gulp.watch('index.html', gulp.parallel( reloadBrowser ));
	gulp.watch('less/**/*.less', gulp.series( styles, reloadBrowser ));
	gulp.watch(app.source.js, gulp.series( scripts, reloadBrowser ));
	done();
}));