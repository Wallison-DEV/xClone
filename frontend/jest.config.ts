import type { JestConfigWithTsJest  } from 'ts-jest/dist/types';

const config: JestConfigWithTsJest  = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
};

export default config;