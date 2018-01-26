// load all required libraries
const gulp = require('gulp');
const gutil = require('gulp-util');
const log = require('fancy-log');

const File = gutil.File;

const markdownToJSON = require('gulp-markdown-to-json');
const marked = require('marked');
const flatten = require('gulp-flatten');
const concat_json = require("gulp-combine-json");
const runSeq = require('run-sequence');


// =================================================================
// default tasks
// =================================================================

gulp.task('default', function() {
  return runSeq(
    'md-posts',
    'md-concat'
    );
});

// =================================================================
// mardown tasks
// =================================================================


var md_path = './data/articles/**/*.md';
var json_path = './data/articles/**/*.json';

marked.setOptions({
  gfm: false,
  tables: false,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: true
});

// generates json files for each md
gulp.task('md-posts', () => {
  gulp.src(md_path)
    .pipe(markdownToJSON(marked, (data, file) => {
      // delete data.body;
      
      // set folder name
      var path = file.path
      var folder_name = path.match(/\d..([(0-9])(-)\w.+(?=\/)/g);
      data.article = folder_name.toString();
      var array = [];
      array.push(data)
      return array
    }))
    .pipe(gulp.dest('./data/articles/'))
});

// combine all generated json files into one single file
gulp.task('md-concat', () => {
  gulp.src(json_path)
    .pipe(concat_json("combined.json"))
    .pipe(gulp.dest('./data/json'));
});