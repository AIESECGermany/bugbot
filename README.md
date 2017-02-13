# BugBot

BugBot provides a slack integration for connecting a html form to a Slack channel.

## Usage

Just invite @bugbot to a channel you wish to receive the form output to.

## Installation

1. clone this repo.
2. `npm install`
3. `cp config.json.dist conig.json`
4. put the correct Slack API Token and whitelist in config.json

### autostart 
1. put `bugbot ` to `/etc/init.d` and make it executable
2. execute `sudo update-rc.d bugbot defaults` on RPi or corresponding command on your OS.