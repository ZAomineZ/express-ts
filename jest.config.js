module.exports = {
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    moduleFileExtension: ['js', 'ts'],
    testMatch: [
        '**/tests/**/*.test.(ts|js)'
    ],
    testEnvironment: 'node'
}
