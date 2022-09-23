import Image from 'next/image';
import Link from 'next/link';
import { NextPage } from 'next';
import { prisma } from '../../utils/global';
import { RomContext, Game, Console } from '../../utils/types';


export async function getStaticPaths() {
    const platforms = await prisma.console.findMany({
        include: {
            roms: true,
        }
    });
    const paths = [];
    for(let i = 0; i < platforms.length; i++) {
        const filtered_roms = platforms[i].roms.filter(r => r.platformId === platforms[i].id);
        for(let j = 0; j < filtered_roms.length; j++) { 
            paths.push({
                params: {
                    platform: platforms[i].url,
                    rom: filtered_roms[j].url
                }
            })
        }
    }
    console.log(paths.length)
    return { paths, fallback: false}
}

interface RomProps {
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
    game: Game,
    platform: Console
}

const RomInfo = (props: any)=> {
    return (
        <div className='flex flex-col border flex-wrap mt-9'>
            <div className='text-black bg-slate-50 border-y border-r border-sky-300 mb-2'>
                <span className='text-xl bg-sky-300 pl-3 pr-20 py-1 w-32 inline-block'>
                    Sha256
                </span>
                <span className='text-lg bg-slate-50 px-3 py-1 truncate'>
                   {props.rom.sha256}
                </span>
            </div>
            <div className='text-black bg-slate-50 border-y border-r border-sky-300 my-2'>
                <span className='text-xl bg-sky-300 pl-3 pr-20 py-1 w-32 inline-block'>
                    Filename
                </span>
                <span className='text-lg bg-slate-50 px-3 py-1'> 
                   {props.rom.filename}
                </span>
            </div>
            <div className='text-black bg-slate-50 border-y border-r border-sky-300 my-2'>
                <span className='text-xl bg-sky-300 pl-3 pr-20 py-1 w-32 inline-block'>
                    Size
                </span>
                <span className='text-lg bg-slate-50 px-3 py-1'> 
                   {props.rom.size}
                </span>
            </div>
            <div className='text-black bg-slate-50 border-y border-r border-sky-300 mt-2'>
                <span className='text-xl bg-sky-300 pl-3 pr-20 py-1 w-32 inline-block'>
                    Platform
                </span>
                <span className='text-lg bg-slate-50 px-3 py-1'> 
                   {props.rom.platform.name}
                </span>
            </div>
            <div className='text-black bg-slate-50 border-y border-r border-sky-300 mt-2'>
                <span className='text-xl bg-sky-300 pl-3 pr-20 py-1 w-32 inline-block'>
                    Platform
                </span>
                <span className='text-lg bg-slate-50 px-3 py-1'> 
                   {props.rom.platform.name}
                </span>
            </div>
            <div className='text-black bg-slate-50 border-y border-r border-sky-300 mt-2'>
                <span className='text-xl bg-sky-300 pl-3 pr-20 py-1 w-32 inline-block'>
                    Platform
                </span>
                <span className='text-lg bg-slate-50 px-3 py-1'> 
                   {props.rom.platform.name}
                </span>
            </div>
        </div>
    )
}

const RomComponent: NextPage<{romView: RomProps[]}> = ({romView}) => {
    return (<>
        <article className='flex border max-w-screen-lg'>
            {romView.map((rom: RomProps) =>
                <div className=''>
                    <div className="flex flex-col">
                        <div className='text-center text-4xl my-5'>{rom.game.title}</div>
                        <div className='grid md:grid-cols-2 border'>
                            <Image 
                                src={`/boxart/${rom.image}`} 
                                alt={`${rom.game.title}`}
                                width={300}
                                height={300}
                                quality={25}
                                objectFit='contain'
                                loading='lazy'
                            />
                            <div className='text-clip flex justify-center items-center'>Description:<br/>{rom.game.description}</div>
                        </div>
                    </div>
                    {/* <div>
                        <p className='text-center text-black text-xl leading-5 p-4'>
                            {rom.game.title}
                        </p>
                    </div> */}
                    
                    <RomInfo rom={rom} />
                </div>
            )}
        </article>
</>)
}

export async function getStaticProps(context: RomContext) {
    const platform = await prisma.console.findUnique({
        select: { 
            id: true 
        },
        where: {
            url: context.params.platform
        }
    })
    const romView = await prisma.rom.findMany({
        where: {
            url: {
                equals: context.params.rom
            },
            platformId: {
                equals: platform?.id
            }
        },
        include: {
            game: true,
            platform: true
        }
    }) as unknown as RomProps;
    console.log('ROM VIEW:\n', romView)
    return {
        props: {
            romView
        }
    }
}

export default RomComponent;


