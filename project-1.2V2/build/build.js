const minify = require('html-minifier').minify;
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

function minifyFile(path) {
    const content = fs.readFileSync(path, {encoding: 'utf8'});

    return minify(content, {
        removeAttributeQuotes: true,
        collapseInlineTagWhitespace:true,
        collapseWhitespace:true,
        decodeEntities:true,
        ignoreCustomComments: true,
        minifyJS: true,
        minifyCSS: true
    })
}

function copyFile(fromPath, toPath) {
    const content = fs.readFileSync(fromPath, {encoding: 'utf8'});
    mkdirp.sync(path.dirname(toPath));
    fs.writeFileSync(toPath, content, {encoding: 'utf8'});
    console.log(`file saved: ${toPath}`);
}

function buildFile(fromPath, toPath) {
    const result = minifyFile(fromPath);

    mkdirp.sync(path.dirname(toPath));
    fs.writeFileSync(toPath, result, {encoding: 'utf8'});
    console.log(`file saved: ${toPath}`);
}

copyFile('./package.json', './deploy/package.json');
copyFile('./index.html', './deploy/index.html');
buildFile('./src/todo.html', './deploy/lists/todo.html');
