# Pile (pile.js) #
## An _anything_ developer's tool ##
---

Pile is a command line tool to help with boilerplate or any project file structure.
Think of it like as a way to streamline the redundant effort it takes to setup a 
directory structure when designing or creating an app.

---

### Current State

As of right now, it is in it's early stage and is currently setup to only handle (you could easily make it do more)
setting up a basic web site structure.

---


### Installing

To install just run:
``npm install -g pilejs``

This will install the command **pile**

### Usage

In your terminal, cd into your projects directory and type:
``pile --init``

This will add a **stackfile** to your directory with some examples inside. Once you have
edited the **stackfile** with your setup and settings and bears, oh my! Just run: **pile**.
That will create your directories, download defined files, and even create a stubbed out
html file with your libraries already in it.

A small static webserver is also included.  In whatever directory you want to serve from (great for testing for ajax
and such), just run ``pile --server`` and open the url in your browser.

---

### Coming Very VERY Soon

* A website, that will give you the ability to publish your stackfiles privately or for everyone
* A service that will install desired libraries without the need of the url paths.
* Git submodule support, automatically add and init as submodules.
* Git clone/checkout will let you specify git urls and have grab from a repository.
* Build functions including compression for files.
* NPM tie in for project specific installs.

---

### The End

Thanks for taking time to peak this little project of mine and I hope you find it interesting and/or useful.
If you have any suggestions or want to help out, email me at wess@frenzylabs.com.




