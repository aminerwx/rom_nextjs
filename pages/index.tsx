import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../utils/global";

type Game = {
  id: string;
  title: string;
  rating: string;
  release: string;
  publisher: string;
  genre: string;
  description: string;
  platformId: number;
  roms: Array<Rom>;
};

type Console = {
  id: number;
  name: string;
  url: string;
  image: string;
  company: string;
  games: Array<Game>;
  roms: Rom[];
};

type Rom = {
  sha256: string;
  image: string;
  crc: string;
};

interface Props {
  // games: Array<Game>,
  platforms: Array<Console>;
}

const ConsoleComponent: NextPage<Props> = ({ platforms }: Props) => {
  return (
    <>
      <article className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
        {platforms.map((platform) => (
          <Link href={`/${platform.url}`} key={platform.id}>
            <a>
              <div
                className={`border bg-white w-80 h-52 flex justify-center items-center rounded-lg`}
              >
                <div className="text-center flex flex-col">
                  <Image
                    width={200}
                    height={160}
                    quality={75}
                    src={`/${platform.image}`}
                    alt={platform.image}
                    layout="intrinsic"
                    objectFit="contain"
                  />
                  <span className="bg-gray-100 text-gray-800 text-sm font-medium mx-auto mt-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                    {platform.games.length}
                  </span>
                </div>
              </div>
            </a>
          </Link>
        ))}
      </article>
    </>
  );
};

export async function getStaticProps() {
  const platforms = await prisma.console.findMany({
    orderBy: [
      {
        games: {
          _count: "desc",
        },
      },
    ],
    include: {
      games: {
        select: {
          id: true,
        },
      },
    },
  });
  return {
    props: {
      platforms,
    },
  };
}

export default ConsoleComponent;
