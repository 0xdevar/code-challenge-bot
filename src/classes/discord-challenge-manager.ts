import {Client, TextChannel} from "discord.js"

/**
 *
 * create challenges
 * manage active challenge
 * destory challengs
 * aware of the time
 *
 */

export class DiscordChallengeManager
{
	channelId: string;
	client: Client;
	channel?: TextChannel;

	constructor(client: Client, channelId: string) {
		this.client = client;
		this.channelId = channelId;
	}

	async boot() {
		this.channel = await this.client.channels.fetch(this.channelId) as TextChannel;

		// check channel id 
		if(!this.channel) {
			throw Error("you'r channelId is not exist");
		}

		this.setup()
	} 

	setup() {
		this.channel?.send({
			content: "Hello World!"
		})
	}
}
