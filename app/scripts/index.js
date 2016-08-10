#!/usr/bin/env node
var fs = require('fs-extra'),
  path = require("path"),
  app_root = __dirname.replace('/scripts', ''),
  dest_root = path.resolve("./"),
  wrench = require('wrench'),
  basics = {};
require('commander')
  .arguments('<project_name> <php_version>')
  .action(function (project_name, php_version) {
    basics.php          = php_version;
    basics.project_name = project_name;
  })
  .parse(process.argv);

if (basics.php && basics.project_name) {
  // Prepare files.
  wrench.mkdirSyncRecursive(dest_root + '/vm', "0777");
  fs.copy(app_root + '/drupal_vm', dest_root + '/vm');
  fs.createReadStream(app_root + '/templates/config.yml').pipe(fs.createWriteStream(dest_root + '/vm/config.yml'));

  if (basics.php == '7.0' || basics.php == '7') {
    basics.box = 'geerlingguy/ubuntu1604';
    basics.php = '7.0';
    basics.drush = '8.1.3';
    basics.php_additional = false;
  }
  else {
    basics.php = '5.6';
    basics.drush = '6.7.0';
    basics.box = 'geerlingguy/ubuntu1404';
    fs.readFile(app_root + '/templates/php_packages', 'utf8', function (err, data) {
      basics.php_additional = data;
    });
  }

  // Handle the config.yml variables.
  fs.readFile(dest_root + '/vm/config.yml', 'utf8', function (err, data) {
    if (err) return console.log(err);
    var file = data.replace(/<VAGRANT_BOX>/gm, basics.box);
    file = file.replace(/<PROJECT_NAME>/gm, basics.project_name);
    file = file.replace(/<PHP_VERSION>/gm, basics.php);
    file = file.replace(/<DRUSH_VERSION>/gm, basics.drush);
    if (!basics.php_additional) {
      file = file.replace(/<PHP5_PACKAGES>/gm, "");
    }
    else {
      file = file.replace(/<PHP5_PACKAGES>/gm, basics.php_additional);
    }
    fs.writeFile(dest_root + '/vm/config.yml', file, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
  // Fix the permissions.
  wrench.chmodSyncRecursive(dest_root + '/vm', "0777");
}
