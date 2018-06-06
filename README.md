<h1>
<img style="border-radius:4px" src="https://raw.githubusercontent.com/MobileKOTH/MKOTH-GSuite/master/misc/MKOTH%20Icon.png" width="32"/>
	Mobile King of the Hill Series Processor
</h1>
<div align="center">
<a href="https://mobilekoth.github.io/"><img style="border-radius:8px" src="https://raw.githubusercontent.com/MobileKOTH/MKOTH-GSuite/master/misc/MKOTH%20Banner.jpg" width="640" alt="MKOTH Banner" /></a>

[![Guild](https://discordapp.com/api/guilds/271109067261476866/embed.png)](https://discord.me/mkoth)
[![Youtube](https://img.shields.io/badge/subscribe-YouTube-red.svg)](http://www.youtube.com/channel/UCkI59BmyEeXUWv8-BhPSU6g?sub_confirmation=1)
[![facebook](https://img.shields.io/badge/%F0%9F%91%8D-facebook-blue.svg)](https://www.facebook.com/Mobile-KOTH-234357333726469/)
[![SpreadSheet](https://img.shields.io/badge/Google-Spreadsheets-brightgreen.svg)](https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I)
</div>

## Introduction
The backend [player data and ranking management system](https://docs.google.com/spreadsheets/d/1VRfWwvRSMQizzBanGNRMFVzoYFthrsNKzOgF5wKVM5I) for [Mobile King of the Hill (**MKOTH**)](https://mobilekoth.github.io/), a competitive community for [Bloons TD Battles](https://store.steampowered.com/app/444640/Bloons_TD_Battles/). It is powered by G Suite (Google Spreadsheet, Google Forms) and automated by [Google Apps Script](https://developers.google.com/apps-script/) for player data, series and ranking processing.

**MKOTH** was originally started by by Gim Leng aka saynotobloons aka icewarm2 from 2015, but was handed over to Darrell aka The Last Dart since 2017. This is loosely based on the original MKOTH code posted on Pastebin:  
https://pastebin.com/4x2nQfhm  
https://pastebin.com/nwkaAsQm  
https://pastebin.com/wMefPGjn

## Prerequisite
Mainly based on JavaScript 1.6 and ECMAScript 5, [Google Apps Script](https://developers.google.com/apps-script/) has not yet implemented support for ECMAScript 6 syntax and above (no `let` `const` `class` etc).

For series submissions, basic validations are in place but these submissions are still recommended to be manually verified for authenticity, as any member can use the [submission form](https://docs.google.com/forms/d/1Ccym-20keX_AbFlELm1s0nYNsST71GJMzUcIusz7bIU) to create a malicious submission.

The code is however also designed to be able to revert any fake series submissions.

## Roadmap
- [x] Holiday mode
- [x] Demotion for King and Nobleman
- [ ] Script files exportation to App Script
- [ ] Complete backend revamp
    - [ ] Use functional programming paradigm?
    - [ ] Better database abstraction on spreadsheets
- [ ] Google Web App API
- [ ] Auto series approval
- [ ] ELO player class up requirement
