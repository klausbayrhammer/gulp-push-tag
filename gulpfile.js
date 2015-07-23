var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');

function cb(obj) {
    var stream = new require('stream').Transform({objectMode: true});
    stream._transform = function (file, unused, callback) {
        obj();
        callback(null, file);
    };
    return stream;
}

gulp.task('bump_patch', function () {
    return gulp.src('./package.json')
        .pipe(bump({type: 'patch'}))
        .pipe(gulp.dest('./'))
        .pipe(git.commit('release version'))
        .pipe(filter('package.json'))
        .pipe(tag_version())
        .pipe(gulp.dest('./'))
        .pipe(cb(function () {
            git.push('origin', 'master', {args: " --tags --verbose"}, function (err) {
                if (err) {
                    throw err;
                }
            });
        }));
});