export interface RuntimeInfo {
    dir: string,
    argv: string[]
}

export function getRuntimeInfo(): RuntimeInfo {
    return {
        dir:  process.cwd(),
        argv: process.argv
    }
}
