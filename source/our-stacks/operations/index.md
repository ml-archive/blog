---
title: Operations
date: 2016-09-29 15:27:11
layout: stack
---
#Operations
Building and maintaining our server setup with AWS.

###Product
We strive to build a flexible, stable and secure server setup, and have the right tools to quickly find problems.
Besides this we build tools to automate tasks for both Operations and developers. We see it as an important task to let developers do common tasks and solve most problems themselves.

###Tasks
**AWS Maintenance**

Our main task is to make sure our AWS environment is running, and optimized. Tasks varies from implementing new systems, optimizing our systems to monitoring and fixing problems in our setup.
Our setup is automated through Puppet, for configuration management.

**Building systems for automation**

We want to automate as much as possible. Some of the systems we have are:
- Akira - CI/CD tool for our developers
- Exeter - Let our developers run commands, create cronjobs and queues
- Autoscale - We use AWS Autoscale for our servers, with some additions to make sure new servers are properly configured

Most of our custom built systems are developed in Ruby and Bash

**Building client setups**

We sometime have clients who want us to build servers to their standard in their own hosting setup. This can for example be Windows server, RedHat, Oracle Linux etc.
In these cases, we are working close together with the client IT team, so get our API’s running smoothly in their own datacenters.

###IDE
The IDE’s we use mostly are:
- PHPStorm
- RubyMine

###Other tools
- VIM
- Atom
- Terminator (Terminal for ubuntu desktop)
- AWS CloudWatch
- LogStash/Kibana
- Postman - For testing API’s
- GITLab

###Stack
Mostly used systems in our stack

- AWS
- Linux (Ubuntu server)
- Apache2
- NGinx
- Let’s Encrypt
- Docker
- GITLab - Self-hosted git GUI interface
- OwnCloud - Self-hosted fileserver
- PHP 5.4 / PHP 5.5 / PHP 7.0
- MySQL 5.7
- Vagrant / Virtualbox
- Ruby
- MongoDB
- ElasticSearch
- Open source
- NCUpdater
- A simple ruby gem to make it easy to update ruby systems.
- https://github.com/nodes-cloud/ncupdater

###Open source
**NCUpdater**

A simple ruby gem to make it easy to update ruby systems.
https://github.com/nodes-cloud/ncupdater

# NCApi will be removed in first version until released
NCApi
A simple ruby gem to make API calls a bit more simple
https://github.com/nodes-cloud/ncapi

Infrastructure drawing

![Infrastructure](https://d1gwekl0pol55k.cloudfront.net/image/baas/translate_values/nodes-cloud-v0-5_IcTvrdDdNo.png)
