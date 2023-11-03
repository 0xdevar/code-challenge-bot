import {Challenge} from "../types/challenge.ts";
import {Client, TextChannel} from "discord.js";
import * as config from "../config.ts";

export async function getRandomChallenge(client: Client): Promise<Challenge> {
	const channel = await client.channels.fetch(config.CHANNEL_SOURCE_ID) as TextChannel;

	if (!channel) {
		throw new Error(`Invalid source channel [${config.CHANNEL_SOURCE_ID}]`);
	}

	const messages = await channel.messages.fetch({limit: 100});

	// @ts-ignore: allow deno compile command
	const message = messages.random();

	if (!message) {
		throw new Error(`No challenge found in channel [${config.CHANNEL_SOURCE_ID}]`);
	}

	const content = message.content.replaceAll("`", "");

	return Challenge.parse(content);
}