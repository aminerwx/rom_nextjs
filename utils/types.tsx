export type Game = {
    id: string,
    title: string,
    gemre: string,
    rating: string,
    release: string,
    publisher: string,
    platformId: number,
    description: string,
}

export type Rom = {
    sha256: string,
    filename: string,
    size: string,
    crc: string,
    md5: string,
    sha1: string,
    image: string,
    platformId: number,
    gameId: string,
    url: string
}

export type Console = {
    id: number,
    name: string,
    url: string,
    image: string,
    company: string,
    games: Game[]
    roms: Rom[]
}

export type ConsoleProps = {
    id: number,
    name: string,
    image: string,
    url: string,
    games: Game[],
    roms: Rom[],
}

export type ConsoleContext = {
    params: {
        platform: string
    }
}

export type RomContext = {
    params: {
        rom: string,
        platform: string
    }
}

