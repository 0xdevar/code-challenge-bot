export const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID;
export const CHANNEL_SOURCE_ID = process.env.DISCORD_CHANNEL_SOURCE_ID;
export const CHALLENGE_INTERVAL = process.env.CHALLENGE_INTERVAL !== undefined
								  ? Number(process.env.CHALLENGE_INTERVAL)
								  : 1000 * 60 * 15;
