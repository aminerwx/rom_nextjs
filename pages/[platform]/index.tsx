import Image from "next/image";
import Link from "next/link";
import { NextPage } from "next";
import { prisma } from "../../utils/global";
import { ConsoleContext, ConsoleProps } from "../../utils/types";

interface Props {
  // games: Array<Game>,
  // roms: Array<Console>
  romsView: ConsoleProps;
}

export async function getStaticPaths() {
  const platforms = await prisma.console.findMany({});

  return {
    paths: platforms.map((platform) => {
      return {
        params: { platform: platform.url },
      };
    }),
    fallback: false, // can also be true or 'blocking'
  };
}

const RomComponent: NextPage<Props> = ({ romsView }: Props) => {
  console.log("ROM:\n", romsView.url);
  return (
    <>
      <article className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {romsView.games.map((game: any) => (
          <div key={game.id} className="bg-slate-50 rounded-lg max-w-xs">
            <Link
              href={`/${romsView.url}/${romsView.roms.find((rom: any) => rom.gameId === game.id)?.url}`}
            >
              <a>
                <div className="text-center">
                  <Image
                    src={`/metroid.png`}
                    //src={`/boxart/${romsView.roms.filter((r: any) => r.gameId === game.id)[0].image}`}
                    alt={`${game.title}`}
                    width={300}
                    height={300}
                    quality={25}
                    objectFit="contain"
                    loading="lazy"
                  />
                </div>
                <div>
                  <p className="text-center text-black text-xl leading-5 p-4">
                    {game.title}
                  </p>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </article>
    </>
  );
};

export async function getStaticProps(context: ConsoleContext) {
  const romsView = (await prisma.console.findUnique({
    where: {
      url: context.params.platform,
    },
    include: {
      games: {
        select: {
          id: true,
          title: true,
        },
      },
      roms: {
        select: {
          image: true,
          sha256: true,
          gameId: true,
          url: true,
        },
      },
    },
  })) as unknown as ConsoleProps;
  console.log("CONSOLE_VIEW\n", romsView);
  return {
    props: {
      romsView,
    },
  };
}

export default RomComponent;
