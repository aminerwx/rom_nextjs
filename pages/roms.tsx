import { NextPage } from 'next';
import style from '../styles/games.module.css'
import Image from 'next/image'
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
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
    name: string,
    url: string
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

const RomComponent: NextPage<Props> = ({games, platforms} : Props) => {
    return (
            <main className={style.r}>
                <aside className={`h-screen sticky top-0 ${style.sidebar}`}>
                    <p className='text-slate-200 text-lg pl-4 py-2 border'>Platforms</p>
                    {platforms.map(platform => 
                    <Link  href={`/roms/${platform.url}`} key={platform.id}>
                         <a>
                            <p className='text-slate-100 text-lg pl-4 py-2 border'>{platform.name}</p>
                        </a>
                    </Link>
                    )}
                </aside>
                <article className={`pt-12 ${style.container}`}>
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
    return {
        props: {
            games,
            platforms
        }
    }
}

export default RomComponent;