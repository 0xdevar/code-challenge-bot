import assert from "assert";

export let TOKEN = process.env.DISCORD_TOKEN || assert.fail("DISCORD_TOKEN is not defined");

export const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID || assert.fail("CHANNEL_ID is not defined");

export const CHANNEL_SOURCE_ID = process.env.DISCORD_CHANNEL_SOURCE_ID
	|| assert.fail("CHANNEL_SOURCE_ID is not defined");

export const CHALLENGE_INTERVAL = process.env.CHALLENGE_INTERVAL !== undefined
								  ? Number(process.env.CHALLENGE_INTERVAL)
								  : 1000 * 60 * 15;
