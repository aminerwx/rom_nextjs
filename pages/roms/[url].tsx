import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
const prisma = new PrismaClient();

type Game = {
    title: String
}

type Rom = {
    image: String
}

type ConsoleProps = {
    id: number,
    name: string,
    image: string,
    url: string,
    games: Game[],
    roms: Rom[]
}

type Context = {
    params: {
        url: string
    }
}

export async function getStaticPaths() {
    const platforms = await prisma.console.findMany({
        select: {
            url: true
        }
    });
    return {
      paths: platforms.map(platform => 
        { 
            return { 
                params: { url: platform.url}
            }
        }),
      fallback: false, // can also be true or 'blocking'
    }
}

const RomName: React.FC<{consoleView: ConsoleProps}> = ({consoleView}) => {
    return (
        <>
            RomName Page
            <p>
                {consoleView.games.map(game => 
                    <p>{game.title}</p>)}
            </p>
        </>
    )
}

export async function getStaticProps(context: Context) {
    console.log(context)
    const consoleView = await prisma.console.findUnique({
        where: {
            url: context.params.url
        },
        include: {
            games: {
                select: {
                    title: true,
                }
            },
            roms: {
                select: {
                    image: true
                }
            }
        }
    }) as ConsoleProps
    return {
        props: {
            consoleView
        }
    }
}


export default RomName;

{/* <article className={`pt-12 `}>
{res.games.map(game =>
    <div key={game.id}>
        <Image 
            src={`/boxart/${game.roms[0].image}`} 
            alt={`${game.title}`}
            layout='intrinsic'
            width={250}
            height={250}
            quality={100}
            objectFit='cover'
            loading='lazy'
            
        />
        <div>
            <p>
                {game.title}
            </p>
            <p>
                {game.roms[0].crc}
            </p>
        </div>
    </div>
)}
</article> */}