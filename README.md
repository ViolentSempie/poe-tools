## Sempie's PoE tools

This is an electron / react / vite app with some tools that I enjoy.<br />
Follows the PoE third-party guidelines as much as I can.<br />
This tool only reads the Client.txt log file.

## Inspirations

This tool was inspired by [Lailloken-UI](https://github.com/Lailloken/Lailloken-UI).<br />
However, since I run on Linux, I cannot run his tool.<br />
This app is for those who don't want to run AutoHotkey or can't because they play on Linux / MacOS.

## Features

### Leveling tracker

Tracks your leveling progress using [Exile Leveling](https://heartofphos.github.io/exile-leveling/).
It currently tracks the basics, based on where you move. You can skip parts or go back to previous parts if you accidentally triggered the next step.

### Build Roulette

Tired of destroying maps? Are your build guides getting too easy to follow? Try our build roulette!

Build roulette allows you to randomize the skill gem you're going to use. This will be your main 6-link skill gem.

Once you've picked your class, you can then randomly generate 4 keystones you have to pick in your build. 

Loosely based on [Poebuildroulette](https://github.com/poebuildroulette/poebuildroulette.github.io)

We've added some additional rules, like how you can pick a class and it'll randomize keystones that are relatively close, so that you don't have to go all over the passive tree.

The build roulette will also try to not brick your build by picking keystones that conflict with each other.

If you find any keystones that conflict, [check the github issues here](https://github.com/ViolentSempie/poe-tools/labels/build%20roulette%20brick).

## Getting Started

First, run Path of Exile.

Then you can start the app:

```bash
yarn start
```