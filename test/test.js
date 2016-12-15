'use strict';

const assert = require('assert');
const path = require('path');
const PassThrough = require('stream').PassThrough;
const es = require('event-stream');
const Vinyl = require('vinyl');

const gulptcm = require('../');

// mock for DtsCreator
class FakeTCMFactory{
    constructor(){
        this.buf = null;
    }
    make(resultString){
        const factory = this;
        return class FakeTCM {
            create(filepath, content){
                factory.buf = content;

                return Promise.resolve({
                    tokens: [],
                    contents: [],
                    formatted: resultString,
                    messageList: [],
                    outputFilePath: filepath,
                });
            }
        };
    }
}

describe('gulp-typed-css-modules', ()=>{
    describe('buffer mode', ()=>{
        it('handle file', done=>{

            const file = new Vinyl({
                path: path.join(__dirname, 'fake.css'),
                contents: new Buffer('.foo { display: none; }'),
            });

            const factory = new FakeTCMFactory();

            const stream = gulptcm({
                tcm: factory.make('export const myClass: string;\n'),
            });

            stream.write(file);

            stream.once('data', file=>{
                // file is returned as Buffer file
                assert(file.isBuffer());

                // file extension is changed
                assert.equal(file.path, path.join(__dirname, 'fake.css.d.ts'));

                // file content is properly passed
                assert.equal(factory.buf, '.foo { display: none; }');

                // the content of buffer is correct
                assert.equal(file.contents.toString('utf8'), 'export const myClass: string;\n');

                done();
            });
        });
    });
    describe('stream mode', ()=>{
        it('handle file', done=>{

            const inputStream = new PassThrough();
            const file = new Vinyl({
                path: path.join(__dirname, 'sake.css'),
                // contents: es.readArray(['.bar ', '{ displa', 'y: none;', ' }\n']),
                contents: inputStream,
            });

            inputStream.write(new Buffer('.bar '));
            inputStream.write(new Buffer('{ displa'));
            inputStream.write(new Buffer('y: none;'));
            inputStream.write(new Buffer(' }\n'));
            inputStream.end();

            const factory = new FakeTCMFactory();

            const stream = gulptcm({
                tcm: factory.make('export const bar: string;\n'),
            });

            stream.write(file);

            stream.once('data', file=>{
                // file is returned as Stream file
                assert(file.isStream());

                // file extension is changed
                assert.equal(file.path, path.join(__dirname, 'sake.css.d.ts'));

                // the content of buffer is correct
                file.contents.pipe(es.wait((err, data)=>{
                    // file content is properly passed
                    assert.equal(factory.buf, '.bar { display: none; }\n');

                    // result of tcm is received
                    assert.equal(data, 'export const bar: string;\n');
                    done();
                }));
            });
        });
    });
    describe('null file', ()=>{
        it ('ignore null files', done=>{
            const file = new Vinyl({
                path: path.join(__dirname, 'fake.css'),
                contents: null,
            });

            const factory = new FakeTCMFactory();
            factory.buf = '吉野家';

            const stream = gulptcm({
                tcm: factory.make('This is not returned!'),
            });

            stream.write(file);
            stream.end();

            stream.once('data', file=>{
                done(new Error('file comes!'));
            });
            stream.once('end', ()=>{
                // no tcm call
                assert.equal(factory.buf, '吉野家');

                done();
            });
        });
    });
});
