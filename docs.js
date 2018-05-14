'use strict';
/* eslint no-console:0 */

/*
* Parses the JavaScript files in `addon/` and
* creates documentation Markdown files for use in GitHub Pages.
* The docs files are written to the 'gh-pages' branch
* in the directory 'api/methods'.
*/

const fs = require('fs');
const cp = require('child_process')
const path = require('path');
const ncp = require('ncp');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const RSVP = require('rsvp');
const packageJSON = require('./package.json');
const walkSync = require('walk-sync');

/* Runs an arbitrary shell command.
*
* @param {string} command - The shell command to execute
* @returns {Promise} (resolves {string}, rejects {Error}) A promise that resolves with the stdout of the command, or rejects with an Error that has the stderr as its message.
*/
function execCmd(command) {
  return new RSVP.Promise(function(resolve, reject) {
    var result;

    console.log('> ' + command + '\n');
    try {
      result = cp.execSync(command);
      resolve(result.toString());
    } catch(error) {
      reject(error);
    }
  });
}

/* Parses a source file for JSDoc comments.
*
* @param {string} filePath - The path to the source JavaScript file
* @returns {Promise} (resolves {string}) A promise that resolves with the Markdown text representation
*/
function parseSourceFile(filePath) {
  return execCmd('node ./node_modules/documentation/bin/documentation build "' + filePath + '" -f md --shallow');
}

/* Takes Markdown and adds yml frontmatter and a table of contents, and adds 1 to
* the level of headings.
*
* @param {string} markdown - Unmassaged markdown.
* @returns {Promise} (resolves {string}) A promise that resolves with the massaged Markdown text representation.
*/
function massageMarkdown(markdown, options) {
  var headerRegex = /^#{1,6} /;
  var h2Regex = /^## (.*)$/;
  var lines = markdown.split('\n');
  var tableOfContents = [
    '### Methods\n'
  ];
  // The jekyll yml frontmatter
  var frontmatter = [
    '---',
    'layout: page',
    'title: ' + options.title,
    '---'
  ];
  var processedMarkdown;
  var h2;
  var tocLine;

  function dasherize(str) {
    return str.toLowerCase().replace(/[^\w]+/g, '-');
  }

  // For each line, if the line is a heading, increase its level by 1.
  // (I.e., there shouldn't be any H1s in the Markdown.)
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].match(headerRegex)) {
      lines[i] = '#' + lines[i];
    }

    h2 = lines[i].match(h2Regex);

    if (h2) {
      // - [Header text](#header-text)
      tocLine = '- [' + h2[1] + ']' + '(#' + dasherize(h2[1]) + ')';

      tableOfContents.push(tocLine);
    }
  }

  // Place the markdown inside a Liquid '{% raw %}{% endraw %}' block
  // so that '{{component-name}}' hbs tags are rendered in code blocks.
  // (Liquid will parse them as Liquid tags otherwise.)
  processedMarkdown = frontmatter.join('\n') + '\n\n' +
    '{% raw %}\n' +
    tableOfContents.join('\n') + '\n\n' +
    lines.join('\n') +
    '{% endraw %}';

  return new RSVP.Promise(function(resolve) {
    resolve(processedMarkdown);
  });
}

/* Write a documentation Markdown file.
*
* @param {string} srcPath - The full path of the source file or directory.
* @param {string} destDir - The directory in which to write the Markdown file.
* @param {Object} options
* @param {string} options.slug - The slug of the documentation. Used to construct the filename.
* @param {string} options.title - The page title of the documentation.
* @returns {Promise}
*/
function writeDocsFile(srcPath, destDir, options) {
  // capture stdout of 'documentation'
  // FIXME: Change this to use documentation Node API
  var filename = options.slug + '.md';
  var destPath = path.join(destDir, filename);
  var promises = [];
  var filePath;
  var files;

  if (fs.statSync(srcPath).isDirectory()) {
    // If the path is a directory,
    // get a list of files in the directory
    files = fs.readdirSync(srcPath);
  } else {
    // Otherwise, the path is a file name
    files = [srcPath];
  }

  for (var i = 0; i < files.length; i++) {
    if (files[0] !== srcPath) {
      // If it's just a filename, add the path
      filePath = path.join(srcPath, files[i]);
    } else {
      filePath = srcPath;
    }

    // Only try to parse files
    if (fs.statSync(filePath).isFile()) {
      promises.push(parseSourceFile(filePath));
    }
  }

  return RSVP.all(promises)
    .then(function(markdownArray) {
      return massageMarkdown(markdownArray.join('\n'), options);
    })
    .then(function(markdown) {
      return new RSVP.Promise(function(resolve, reject) {
        // use {'flags': 'a'} to append and {'flags': 'w'} to erase and write a new file
        var stream = fs.createWriteStream(destPath, { flags: 'w' });

        stream.on('finish', resolve);
        stream.on('error', reject);

        stream.write(markdown);

        stream.end();

        console.log('Wrote Markdown to file ' + destPath);
      });
    });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/* Write documentation for the files in a directory.
*
* Individual files in the directory will each have their own documentation
* files. Subdirectories will group the docs for all files together.
*
* @param {string} srcDir - The directory in which the source files are contained.
* @param {string} destDir - The directory in which to write the documentation files.
* @returns {Promise}
*/
function writeApiDocs(srcPaths, destDir) {
  return removeDir(destDir)
    .then(() => createDir(destDir))
    .then(() => {
      return RSVP.map(srcPaths, srcPath => {
        let slug = path.basename(srcPath, '.js');
        let title = capitalizeFirstLetter(slug.replace('-', ' '));

        return writeDocsFile(srcPath, destDir, { slug, title });
      });
    })
}

/* Copies the documentation files from the temporary directory to the Jekyll
* docs directory.
*
* @param {string} srcDir - The directory in which the source files are contained.
* @param {string} destDir - The directory in which to write the documentation files.
* @returns {Promise}
*/
function copyDocs(srcDir, destDir) {
  return new RSVP.Promise(function(resolve, reject) {
    // Copy the docs directory
    ncp(srcDir, destDir, function (err) {
      if (err) {
        reject(err);
      } else {
        console.log('Copied docs to ' + destDir);
        resolve();
      }
    });
  });
}

/* Creates a directory (and its parent directories, if necessary).
*
* @param {string} dir - The directory to create.
* @returns {Promise}
*/
function createDir(dir) {
  return new RSVP.Promise(function(resolve, reject) {
    // Delete the temporary compiled docs directory.
    mkdirp(dir, function (err) {
      if (err) {
        reject(err);
      } else {
        console.log('Created directory ' + dir);
        resolve();
      }
    });
  });
}

/* Deletes a directory recursively.
*
* @param {string} dir - The directory to delete.
* @returns {Promise}
*/
function removeDir(dir) {
  return new RSVP.Promise(function(resolve, reject) {
    // Delete the temporary compiled docs directory.
    rimraf(dir, function (err) {
      if (err) {
        reject(err);
      } else {
        console.log('Removed directory ' + dir);
        resolve();
      }
    });
  });
}

(function() {
  var versionArray = packageJSON.version.split('.');
  // ex., '1.0.3' -> 'v1.0.x'
  var version = 'v' + versionArray[0] + '.' + versionArray[1] + '.x';

  var tmpDir = path.join(__dirname, 'tmp_docs');
  var destDir = path.join(__dirname, 'docs', version);
  var guidesDir = path.join(__dirname, 'guides');

  const apiSourcesPaths = walkSync('.', {
    globs: ['addon-test-support/{create.js,properties/*.js,macros/*.js}' ]
  });

  // Create the temporary directory for the docs
  createDir(tmpDir)
    .then(() => copyDocs(guidesDir, tmpDir))
    .then(() => writeApiDocs(apiSourcesPaths, path.join(tmpDir, 'api')))
    .then(() => execCmd('git branch'))
    .then((branches) => {
      const branch = 'gh-pages';

      // Switch to the GitHub Pages branch
      if (branches.includes(branch)) {
        return execCmd(`git checkout ${branch}`);
      } else {
        return execCmd(`git checkout -b ${branch}`);
      }
    })
    .then(() => removeDir(destDir))
    .then(() => createDir(destDir))
    .then(() => copyDocs(tmpDir, destDir))
    .then(() => removeDir(tmpDir))
    .then(() => {
      console.log('Finished writing documentation files.');
    })
    .catch(function(reason) {
      console.log(reason.stack);
    });
})();
