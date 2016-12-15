'use strict';

const path = require('path');
const through2 = require('through2');
const gutil = require('gulp-util');
const bufferstreams = require('bufferstreams');

const pluginName = 'gulp-typed-css-modules';

module.exports = options=>{
    options = options || {};

    const DtsCreator = options.tcm || require('typed-css-modules');

    const creator = new DtsCreator(options);

    return through2.obj((file, encoding, callback)=>{
        const filepath = file.path;
        const newpath = file.path + '.d.ts';

        file.path = newpath;
        if (file.isNull()){
            callback(null);
            return;
        }
        if (file.isBuffer()){
            runtcm(filepath, creator, file.contents.toString(encoding), options)
            .then(content=>{
                file.contents = content;
                callback(null, file);
            })
            .catch(err=>{
                callback(null);
            });
            return;
        }
        if (file.isStream()){
            file.contents = file.contents.pipe(new bufferstreams((err, buf, callback)=>{
                if (err){
                    throw err;
                }

                runtcm(filepath, creator, buf.toString(encoding), options)
                .then(content=>{
                    callback(null, content);
                })
                .catch(err=>{
                    callback(err);
                });
            }));

            callback(null, file);
            return;
        }
        callback(null);
    });
};

function showWarning(file, err){
    gutil.log(gutil.colors.cyan(pluginName), gutil.colors.yellow('Warning'), gutil.colors.gray(file), err);
}
function showError(file, err){
    gutil.log(gutil.colors.cyan(pluginName), gutil.colors.red('Error'), gutil.colors.gray(file), err);
}

function runtcm(filepath, creator, content, options){
    return creator.create(filepath, content)
    .then(content=>{
        if (!options.quiet){
            for (let mes of content.messageList){
                showWarning(filepath, mes);
            }
        }
        return new Buffer(content.formatted);
    })
    .catch(err=>{
        showError(filepath, err);
        return Promise.reject(err);
    });
}
