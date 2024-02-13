import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '')
    return {
        // vite config
        define: {
            plugins: [node()],
            __MONGO_USER__: JSON.stringify(env.MONGO_USER),
            __MONGO_PWD__: JSON.stringify(env.MONGO_PWD),
        },
    }
})