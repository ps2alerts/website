# ps2alerts/website
This module is the publicly facing section of the PS2Alerts project. Users are able to visit the site and read the statistics metrics on a per-alert or global basis and many more.

THIS PROJECT IS UNDERGOING A VAST RE-REWITE. If you wish to contribute, please join our Discord located at: https://discord.gg/7xF65ap

## Running the module

Please see the [ps2alerts/stack](https://github.com/ps2alerts/stack) repository for information on how to install the dev environment and start this project.

Once the stack is running (**and** you have run the setup in the above repository), you will be able to access the terminal with the command `ps2alerts-website-term`, there you can re-run grunt, run `grunt watch` to automatically compile LESS into CSS and JS files etc, and interact with bower / composer.

You will need a data dump or generate your own data in order to have the project show any data. Acquire this from the Discord group.

## Compilation

The below technologies are used in order to compile the website module:

* npm
* grunt
* bower (yes I know it's dead, this project is 4 years old!)

As part of the startup routine, npm and grunt-cli is baked into the development Docker image of this project (which you run) therefore the commands are available to you. Upon start however we cheat a little bit and use a container dedicated to running these tools to give you the intial files etc to begin running the project, so you don't have to worry about initializing the project.

If you make changes to any of the JavaScript or LESS files, you will need to re-compile. In order to do this, perform the following:

```
ps2alerts-website-term
grunt
```

If you want to automatically have the system create you files as you edit them, replace `grunt` above with `grunt watch`, it will then continuously watch files for changes and automatically compile them.

You don't need to worry about compilation for deployments. Our stack wizards will take care of that.

## Angular

This module uses Angular version 1 aka AngularJS. More info here: https://angularjs.org/.

Everything you need to find will be in `app/public`.

## PHP

Because the website is a Single Page Application, back in the day I wrote this there was no real clean way to handle the "initial load" of the website in terms of when Google Crawled it. Things have changed since then and the support is **much** better, however there remains a server component to the website in order to do the initial render. 