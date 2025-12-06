export const getEnv = (envname) => {
    const env = import.meta.env
    return env[envname]
}

// Backwards compatibility - keep old name to prevent breaking existing code
export const getEvn = getEnv
