'use strict';

/*
 * Parses the JavaScript files in `test-support/page-object` and
 * creates documentation Markdown files for use in GitHub Pages.
 * The docs files are written to the 'gh-pages' branch
 * in the directory 'api/methods'.
 */

var fs = require('fs');
var path = require('path');
var execSync = require('sync-exec');
var ncp = require('ncp');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var RSVP = require('rsvp');
var packageJSON = require('./package.json');

/* Runs an arbitrary shell command.
 *
 * @param {string} command - The shell command to execute
 * @returns {Promise} (resolves {string}, rejects {Error}) A promise that resolves with the stdout of the command, or rejects with an Error that has the stderr as its message.
 */
function execCmd(command) {
  return new RSVP.Promise(function(resolve, reject) {
    var result;

    console.log('> ' + command + '\n');

    result = execSync(command);

    if (result.status !== 0) {
      reject(new Error(result.stderr));
    } else if (result.stdout) {
      resolve(result.stdout);
    } else {
      resolve();
    }
  });
}

/* Parses a source file for JSDoc comments.
 *
 * @param {string} filePath - The path to the source JavaScript file
 * @returns {Promise} (resolves {string}) A promise that resolves with the Markdown text representation
 */
function parseSourceFile(filePath) {
  return execCmd('node ./node_modules/documentation/bin/documentation "' + filePath + '" --format "md" --github --shallow');
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
  var tableOfContents = [];
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

  processedMarkdown = frontmatter.join('\n') + '\n\n' +
                      tableOfContents.join('\n') + '\n\n' +
                      lines.join('\n');

  return new RSVP.Promise(function(resolve, reject) {
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

/* Write documentation for the files in a directory.
 *
 * Individual files in the directory will each have their own documentation
 * files. Subdirectories will group the docs for all files together.
 *
 * @param {string} srcDir - The directory in which the source files are contained.
 * @param {string} destDir - The directory in which to write the documentation files.
 * @returns {Promise}
 */
function writeDocs(srcDir, destDir) {
  var promises = [];
  var sources;
  var srcPath;
  var stat;
  var options;
  var slug;

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  if (fs.statSync(srcDir).isDirectory()) {
    // If the path is a directory,
    // get a list of files in the directory
    sources = fs.readdirSync(srcDir);
  } else {
    return new RSVP.Promise(function(resolve, reject) {
      reject('Must pass a directory to writeDocs');
    });
  }

  for (var i = 0; i < sources.length; i++) {
    srcPath = path.join(srcDir, sources[i]);
    stat = fs.statSync(srcPath);
    slug = sources[i].split('.')[0];

    options = {
      slug: slug,
      title: capitalizeFirstLetter(slug.replace('-', ' '))
    }

    if (stat.isFile() || stat.isDirectory()) {
      promises.push(writeDocsFile(srcPath, destDir, options));
    }
  }

  return RSVP.all(promises)
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
        console.log('Finished writing documentation files.');
        resolve();
      }
    });
  });
}

(function() {
  var versionArray = packageJSON.version.split('.');
  // ex., '1.0.3' -> 'v1.0.x'
  var version = 'v' + versionArray[0] + '.' + versionArray[1] + '.x';

  var srcDir  = path.join(__dirname, 'test-support', 'page-object');
  var tmpDir  = path.join(__dirname, 'tmp_docs');
  var destDir = path.join(__dirname, 'docs', version, 'api');

  // Create the temporary directory for the docs
  createDir(tmpDir)
  .then(function() {
    // Create the documentation files
    return writeDocs(srcDir, tmpDir);
  })
  .then(function() {
    // Switch to the GitHub Pages branch
    return execCmd('git checkout gh-pages');
  })
  .then(function() {
    // Delete the existing destination directory
    return removeDir(destDir);
  })
  .then(function() {
    // Create the destination directory
    return createDir(destDir);
  })
  .then(function() {
    // Copy the docs to the destination directory
    return copyDocs(tmpDir, destDir);
  })
  .then(function() {
    // Delete the temporary directory
    return removeDir(tmpDir);
  })
  .catch(function(reason) {
    console.log(reason.stack);
  });
})();
