# gulp-typed-css-modules

This is a gulp plugin for me, which wraps [typed-css-modules](https://github.com/Quramy/typed-css-modules).

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
To use your own `typed-css-modules` instead of the built-in one, do:

```js
gulp_tcm({
    tcm: require('typed-css-modules'),
})
```

## Options
- **quiet**: if true, suppress warning messages from `typed-css-modules`.
- **tcm**: `typed-css-modules` module.

Any other option is passed to `typed-css-modules` (`DtsCreator`).

## Contributing
welcome

## Changelog
*Note: All dates are in JST.*

* **1.1.0** (2017-05-07): Update built-in `typed-css-modules` from `0.1.3` to `0.2.0`. (`f408d78`)
* **1.0.0** (2016-12-15): The first version.

## License
MIT
