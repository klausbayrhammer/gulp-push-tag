var git = require('gulp-git');
var bump = require('gulp-bump');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var fs = require('fs');

gulp.task('publish', function (cb) {
    runSequence('bump_patch', 'commit', 'tag', 'push', cb);
});

gulp.task('bump_patch', function () {
    return gulp.src('./package.json')
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'));
});

gulp.task('commit', function () {
    var version = getPackageJsonVersion();
    return gulp.src('.')
        .pipe(git.commit('Release ' + version));
});

gulp.task('tag', function (cb) {
    var version = getPackageJsonVersion();

    return git.tag(version, 'Created Tag for version ' + version, cb);
});

gulp.task('push', function (cb) {
    git.push('origin', 'master', {args: " --tags --verbose"}, cb);
});

function getPackageJsonVersion () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
}
