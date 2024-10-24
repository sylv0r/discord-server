import { CommandHandler } from '@app/shared'
import {
    SendFriendRequestCommand,
    SendFriendRequestPaylaod,
} from './send-friend-request.command'
import { DateProvider } from '../../domain'
import { UserSocialRepository } from '../../gateways'

export class SendFriendRequestHandler
    implements CommandHandler<SendFriendRequestCommand>
{
    constructor(
        private userSocialRepository: UserSocialRepository,
        private dateProvider: DateProvider
    ) {}

    async handle(command: SendFriendRequestPaylaod): Promise<void> {
        const sender = await this.userSocialRepository.byId(command.senderId)
        const receiver = await this.userSocialRepository.byId(
            command.receiverId
        )

        sender.requestToBeFriendWith(receiver, {
            id: command.requestId,
            currentDate: this.dateProvider.getNow(),
        })

        await this.userSocialRepository.save(sender)
    }
}