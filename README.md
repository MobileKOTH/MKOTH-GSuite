<h1>
<img src="https://media.discordapp.net/icons/271109067261476866/24f121de60193300e17e61c7914e7cdf.jpg" width="32"/>
	Mobile King of the Hill Series Processor
</h1>

[![Guild](https://discordapp.com/api/guilds/271109067261476866/embed.png)](https://discord.me/mkoth)
## Introduction
The backend player data and ranking management system for [Mobile King of the Hill (**MKOTH**)]("https://mobilekoth.wordpress.com/"), a competitive community for Bloons TD Battles. It is powered by G Suite (Google Spreadsheet, Google Forms) and enhanced by [Google Apps Script]("https://developers.google.com/apps-script/") for series processing and automation.

**MKOTH** was originally started by by Gim Leng aka saynotobloons aka icewarm2 from 2015, but was handed over to Darrell aka The Last Dart since 2017. This is loosely based on the original MKOTH code posted on Pastebin:  
https://pastebin.com/4x2nQfhm  
https://pastebin.com/nwkaAsQm  
https://pastebin.com/wMefPGjn

## Prerequisite
Mainly based on JavaScript 1.6 and ECMAScript 5, [Google Apps Script]("https://developers.google.com/apps-script/") has not yet implemented support for ECMAScript 6 syntax and above (no `let` `const` `class` etc).

For series submissions, basic validations are in place but these submissions are still recommended to be manually verified for authenticity, as anyone can use the submission form to create a malicious submission.

The code is however also designed to be able to revert any fake series submissions.

## Roadmap
- Code files synchronisation
- Complete backend revamp
    - Use functional programming paradigm?
    - Better database abstraction on spreadsheets
- Google Web App API
- Auto series approval
- ELO player class up requirement
