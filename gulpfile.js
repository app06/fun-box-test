const gulp = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync');

const dist = './dist/';

gulp.task('copy:html', () => {
    return gulp.src('./src/index.html')
                .pipe(gulp.dest(dist))
                .pipe(browserSync.stream());
});

gulp.task('scss', () => {
    return gulp.src('./src/scss/common.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 4 versions', '> 1%']
            })
        )
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${dist}/css/`))
        .pipe(browserSync.stream());
});

gulp.task('scss:prod', () => {
    return gulp.src('./src/scss/common.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 4 versions', '> 1%']
            })
        )
        .pipe(gulp.dest(`${dist}/css/`));
});

gulp.task('copy:img', () => {
    return gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest(`${dist}/img/`))
        .on('end', browserSync.reload);
});

gulp.task('build:js', () => {
    return gulp.src('./src/js/common.js')
                .pipe(webpack({
                    mode: 'development',
                    output: {
                        filename: 'common.js'
                    },
                    watch: false,
                    devtool: 'source-map',
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: 'usage'
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(gulp.dest(`${dist}/js/`))
                .on('end', browserSync.reload);
});

gulp.task('build:js:prod', () => {
    return gulp.src('./src/js/common.js')
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'common.js'
            },
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: 'usage'
                                }]]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(`${dist}/js/`));
});

gulp.task('watch', () => {
    browserSync.init({
		server: dist,
		port: 8080,
        open: false,
		notify: false
    });
    
    gulp.watch('./src/index.html', gulp.parallel('copy:html'));
    gulp.watch('./src/img/**/*.*', gulp.parallel('copy:img'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('build:js'));
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('scss'));
});

gulp.task('clean:build', function() {
    return del(dist)
});

gulp.task('build', gulp.parallel('copy:html', 'copy:img', 'scss', 'build:js'));

gulp.task('build:prod', gulp.series(
    gulp.parallel('clean:build'),
    gulp.parallel('copy:html', 'copy:img', 'scss:prod', 'build:js:prod')
));

gulp.task('default', gulp.series(
        gulp.parallel('clean:build'),
        gulp.parallel('watch', 'build')
    )
);