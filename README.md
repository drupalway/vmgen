VM generator powered by Vagrant, Ansible, Node.js and DrupalVM
==============================================================

# Requirements:
1. Unix-based OS(tested on Ubuntu and OS X)
2. Vagrant
3. VirtualBox
4. Ansible
5. Vagrant plugins:
5.1. hostsupdater (`vagrant plugin install vagrant-hostsupdater`)
5.2. auto_network (`vagrant plugin install vagrant-auto_network`)
6. NodeJS(npm):
  For Ubuntu - http://tecadmin.net/install-latest-nodejs-npm-on-ubuntu/
  For OSX - `brew install node`
# Installation:
1. Install the vmgen package in your system - `npm install -g vmgen`
2. Create directory 'projects' at your home('~') directory, so it's should be "~/projects/"
3. Under projects directory create your project directory, named as machine name of your project for example "~/projects/my_project/"
4. `cd ~/projects/my_project`
5. Create a directory 'docroot' in this directory and put there all your Drupal code, and ensure that /docroot is a drupal's root directory.
6. From the ~/projects/my_project directory run `vmgen my_project PHP_VERSION`, where PHP_VERSION can be 5.6 or 7 according to supported PHP versions
7. Now you can see a new directory under ~/projects/my_project - "vm", just cd into that directory and run `vagrant up` to start VM installation, once it's complete you should be able to access your VM via `vagrant ssh` from the "vm" directory.

Any additional information about VM you can find here - https://github.com/geerlingguy/drupal-vm
