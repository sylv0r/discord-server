import {
    DeterministicDateProvider,
    DeterministicIdProvider,
    DeterministicPasswordEncryption,
    User,
} from '../domain'
import { InMemoryUserRepository } from '../infra'
import { FakeAuthProvider } from '../infra/auth-provider'
import {
    LoginHandler,
    LoginPayload,
    RegisterHandler,
    RegisterPayload,
} from '../use-cases'

export const createFixture = () => {
    const userRepository = new InMemoryUserRepository()
    const passwordHasher = new DeterministicPasswordEncryption()
    const idProvider = new DeterministicIdProvider()
    const dateProvider = new DeterministicDateProvider()
    const authProvider = new FakeAuthProvider()

    const register = new RegisterHandler(
        userRepository,
        passwordHasher,
        idProvider,
        dateProvider
    )
    const login = new LoginHandler(userRepository, authProvider, passwordHasher)

    let error: Error

    return {
        givenId(id: string) {
            idProvider.id = id
        },
        givenHash(password: string, hash: string) {
            passwordHasher.givenHash(password, hash)
        },
        givenNow(now: Date) {
            dateProvider.now = now
        },
        givenUsers(users: User[]) {
            userRepository.givenUsers(users)
        },
        async whenRegister(payload: RegisterPayload) {
            try {
                await register.handle(payload)
            } catch (e) {
                error = e
            }
        },
        async whenLogin(payload: LoginPayload) {
            try {
                await login.handle(payload)
            } catch (e) {
                error = e
            }
        },
        thenUsersShouldBe(expectedUsers: User[]) {
            expect(userRepository.getAll()).toEqual(
                expectedUsers.map((user) => user.snapshot)
            )
        },
        thenErrorShouldBe(expectedError: Error) {
            expect(error).toEqual(expectedError)
        },
        thenUserIsLoggedIn(expectedUser: User) {
            expect(authProvider.loggedInUser?.snapshot).toEqual(
                expectedUser.snapshot
            )
        },
    }
}

export type Fixture = ReturnType<typeof createFixture>
