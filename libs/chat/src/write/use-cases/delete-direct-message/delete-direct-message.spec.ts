import { ChatFixture, createChatFixture } from '../../__tests__/chat.fixture'
import { chatterBuilder } from '../../__tests__/chatter.builder'
import { messageBuilder } from '../../__tests__/message.builder'
import {
    MessageAlreadyDeletedError,
    MessageWasNotSentByChatterError,
} from '../../domain'

const EMITTER = chatterBuilder().withId('1234').build()
const RECEIVER = chatterBuilder().withId('5678').build()

const messageSendBuilder = messageBuilder()
    .withId('1')
    .withEmitterId(EMITTER.id)

describe('Feature: Delete Direct Message', () => {
    let fixture: ChatFixture

    beforeEach(() => {
        fixture = createChatFixture()
    })

    test('Can delete a message', async () => {
        const messageSend = messageSendBuilder.build()
        fixture.givenChatters([EMITTER, RECEIVER])
        fixture.givenMessages([messageSend])

        await fixture.whenDeleteDirectMessage({
            id: messageSend.id,
            chatterId: EMITTER.id,
        })

        fixture.thenMessagesShouldBe([messageSendBuilder.deleted().build()])
    })

    test('Can NOT delete a message when message was not send by the chatter', async () => {
        const message = messageSendBuilder.build()
        fixture.givenChatters([EMITTER, RECEIVER])
        fixture.givenMessages([message])

        await fixture.whenDeleteDirectMessage({
            id: message.id,
            chatterId: RECEIVER.id,
        })

        fixture.thenErrorShouldBe(new MessageWasNotSentByChatterError())
    })

    test('Can NOT delete a message already deleted', async () => {
        const message = messageSendBuilder.deleted().build()
        fixture.givenChatters([EMITTER, RECEIVER])
        fixture.givenMessages([message])

        await fixture.whenDeleteDirectMessage({
            id: message.id,
            chatterId: EMITTER.id,
        })

        fixture.thenErrorShouldBe(new MessageAlreadyDeletedError())
    })
})
