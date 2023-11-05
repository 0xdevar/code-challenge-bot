# Challenge Bot

A simple bot for Discord to send programming related challenges & questions.

## Installation
Download from [Release](https://github.com/0xdevar/code-challenge-bot/releases)

## Usage
### Using Discord channel as a source for challenges.  
Send each challenge to the channel and each message should follow this syntax.  
Format:
```
question here
@@@
choice-1
choice-2
choice-3
@@@
choice index here starting from 0
```

Example:
```
كيف يمكن تعريف متغيّر في جافا سكريبت (JavaScript) الذي لا يمكن تغييره؟
@@@
let
const
var
@@@
1
```

## Environment Variables
- `DISCORD_CHANNEL_ID`  
  Channel id to send challenges to.
- `DISCORD_CHANNEL_SOURCE_ID`  
  Channel id for challenges as described above  
  bot requires permission to read messages in this channel
- `CHALLENGE_INTERVAL`  
  Time between each challenges. Default `15 minutes`


## Contributors

- [@0xWaleed](https://github.com/0xWaleed)
- [@aravns](https://github.com/aravns)