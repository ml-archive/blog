---
title: Operations
date: 2016-09-29 15:27:11
layout: stack
---
#Operations
Building and maintaining our server setup with AWS.

###Product
We strive to build a flexible, stable and secure server setup, where we have the right tools to quickly find problems.

Because of this we build tools to automate tasks for both operations- and web-developers. We see it as an important goal to let developers do common tasks and solve most problems themselves.

###Tasks
**AWS Maintenance**

Our main task is to make sure our AWS environment is running, and optimized for performance. Tasks vary, but include implementing new systems, optimizing our systems, monitoring and fixing problems in our setup. In order for us to facilitate automation, we use puppet, which streamlines server configuration.

**Building systems for automation**

We want to automate as much as possible. Some of the systems we have built to facilitate this are:

- Akira - Continuous Integration and deployment tool for our developers.
- Exeter - Gives our developers the ability to run commands, create cronjobs and manage queues.
- Autoscale - We use AWS Autoscaling for our servers, with some additions to make sure new servers are properly configured

Most of our custom-built systems are developed in Ruby and Bash

**Building client setups**

We sometimes have clients who want us to configure servers that conform to their cases, in their own environments. This includes Windows server, RedHat, Oracle Linux and more.
In these cases, we work closely with the client's IT team, to get our implementations running smoothly in their own datacenters.

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

###Open source
**NCUpdater**

A simple ruby gem to make it easy to update ruby systems.
https://github.com/nodes-cloud/ncupdater

###Infrastructure drawing

![Infrastructure](https://d1gwekl0pol55k.cloudfront.net/image/baas/translate_values/pub-nodes-cloud-v0-6_pZn4iLV5KK.png)
