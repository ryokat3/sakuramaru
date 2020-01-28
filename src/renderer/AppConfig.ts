
export const defaultAppConfig = {
    name: "sakuramaru",
    configFileName: "sakuramaru.json",
    mapDir: "map",
    mapData: "mapData.json",
    doubleTapInterval: 500,
    doubleTapDistance: 3
}

export type AppConfig = typeof defaultAppConfig
