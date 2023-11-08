import {Client, Collection, Message, MessageType, TextChannel} from "discord.js";
import * as config from "../config.ts";
import {Challenge} from "../types/challenge.ts";

const consumedMessages: Record<string, boolean> = {};

function pickNextMessage(collection: Collection<string, Message<true>>): Message {
	const size = collection.size;

	const consumedKeys = Object.keys(consumedMessages);
	if (consumedKeys.length >= size) {
		consumedKeys.forEach(key => {
			delete consumedMessages[key];
		});
	}

	let out;

	do {
		out = collection.random();

		if (!out) {
			throw new Error("No challenge found");
		}

	} while (consumedMessages[out.id]);

	consumedMessages[out.id] = true;

	return out;
}

export async function getRandomChallenge(client: Client): Promise<Challenge> {
	const channel = await client.channels.fetch(config.CHANNEL_SOURCE_ID) as TextChannel;

	if (!channel) {
		throw new Error(`Invalid source channel [${config.CHANNEL_SOURCE_ID}]`);
	}

	const messages = await channel.messages.fetch({limit: 100});

	const onlyMessages = messages.filter(m => m.type === MessageType.Default);

	const message = pickNextMessage(onlyMessages);

	const content = message.content.replace(/(^```|```$)/g, "");

	const author = message.author;

	return Challenge.parse(content, author.displayName);
}