# gulp-typed-css-modules

This is a gulp plugin for me, that wraps [typed-css-modules](https://github.com/Quramy/typed-css-modules).

## Installation
```sh
npm install --save-dev gulp-typed-css-modules
```

## Usage
```js
const gulp = require('gulp');
const gulp_tcm = require('gulp-typed-css-modules');

gulp.task('tcm', function(){
    return gulp.src(["src/**/*.css"], {                                             
        base: '.',                                                                  
    })                                              
    .pipe(gulp_tcm())
    .pipe(gulp.dest("./"));                                           
});  
```

This will create `*.css.d.ts` files next to each `*.css` file.

### Providing `typed-css-modules`
To use your own `typed-css-modules` instead of the built in one, do:

```js
gulp_tcm({
    tcm: require('typed-css-modules'),
})
```

## Options
- **quiet**: if true, suppress warning messages from `typed-css-modules`.
- **tcm**: `typed-css-modules` module.

Any other options are passed to `typed-css-modules` (`DtsCreator`).

## Contributing
welcome

## License
MIT