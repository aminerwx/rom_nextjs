import { NextPage } from 'next';
import style from '../styles/games.module.css'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Game = {
    id: string,
    title: string,
    rating: string,
    release: string,
    publisher: string,
    genre: string,
    description: string,
    platformId: number,
    roms: Array<Rom>
}

type Console = {
    id: number,
    name: string
}

type Rom = {
    sha256: string,
    image: string,
    crc: string
}

interface Props  {
    games: Array<Game>,
    platforms: Array<Console>
}

const GameComponent: NextPage<Props> = ({games, platforms} : Props) => {
    return (
            <main className={style.r}>
                <aside className={style.sidebar}>
                    Sidebar
                    {platforms.map(platform => 
                         <a href="#" key={platform.id}><p>
                            {platform.name}</p></a>
                    )}
                </aside>
                <article className={style.container}>
                    {/* {games} */}
                    {games.map(game =>
                        <div key={game.id} className={style.card}>
                            <Image 
                                src={`/boxart/${game.roms[0].image}`} 
                                alt={`${game.title}`}
                                layout='intrinsic'
                                width={250}
                                height={250}
                                quality={100}
                                className={style.img}
                                objectFit='cover'
                                loading='lazy'
                                
                            />
                            <div className={style.box}>
                                <p className={style.name}>
                                    {game.title}
                                </p>
                                <p className={style.name}>
                                    {game.roms[0].crc}
                                </p>
                            </div>
                        </div>
                    )}
                </article>
            </main>
    );
}

export async function getStaticProps() {
    const games = await prisma.game.findMany({
        orderBy: [
            {
                title: 'asc'
            }
        ],
        include: {
            roms: {
                select: {
                    image: true,
                    crc: true
                }
            }
        },
        take: 80
    });

    const platforms = await prisma.console.findMany({
        orderBy: [
            {
                name: 'asc'
            }
        ]
    });
    console.log(platforms)
    return {
        props: {
            games,
            platforms
        }
    }
}

export default GameComponent;
