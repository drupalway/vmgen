#!/usr/bin/env node

// Prepare required packages to be used.
var fs        = require('fs');
var fs_extra  = require('fs-extra');
var path      = require("path");
var commander = require('commander');
// Prepare global variables.
var app_root     = __dirname.replace('/scripts', '');
var dest_root    = path.resolve("./");
var replacements = {};

// Parse the CLI params.
commander
  .arguments('<project_name> <php_version>')
  .action(function (project_name, php_version) {
    replacements.php          = php_version;
    replacements.project_name = project_name;
  })
  .parse(process.argv);

if (replacements.php && replacements.project_name) {
  // Prepare files.
  fs.mkdirSync(dest_root + '/vm', 0777);
  fs_extra.copy(app_root + '/drupal_vm', dest_root + '/vm');

  fs.createReadStream(app_root + '/templates/config.yml')
    .pipe(fs.createWriteStream(dest_root + '/vm/config.yml'));

  if (replacements.php == '7.0' || replacements.php == '7') {
    replacements.box   = 'geerlingguy/ubuntu1604';
    replacements.php   = '7.0';
  }
  else if (replacements.php == '7.1') {
    replacements.box   = 'geerlingguy/ubuntu1604';
    replacements.php   = '7.1';
  }
  else {
    replacements.php   = '5.6';
    replacements.box   = 'geerlingguy/ubuntu1404';
  }

  // Handle the config.yml variables.
  fs.readFile(dest_root + '/vm/config.yml', 'utf8', function (err, data) {
    if (err) return console.log(err);
    var file = data.replace(/<VAGRANT_BOX>/gm, replacements.box);
    file = file.replace(/<PROJECT_NAME>/gm, replacements.project_name);
    file = file.replace(/<PHP_VERSION>/gm, replacements.php);
    fs.writeFile(dest_root + '/vm/config.yml', file, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  // Fix the permissions.
  fs.chmod(dest_root + '/vm', 0777, function (err) {
    if (err) console.log(err);
  });
}
