import { type RaceListItem } from "@/server/api/routers/racesList";
import Image from "next/image";
import Link from "next/link";

export function RaceListItem(props: RaceListItem) {
  return (
    <Link href={`race/${props.raceResultsSheetName}`}>
      <li className="bg-list-item-bg border-list-item-border flex flex-col rounded-xl border p-4">
        <p className="text-text-secondary m-0 flex font-normal">
          {props.region} • {props.trackCountryName}{" "}
          <span className="text-white">{props.trackCountryFlag}</span>
        </p>
        <h3 className="m-0 mb-4 text-[24px] font-bold leading-tight text-white">
          {props.trackLocation} - {props.trackLayout}
        </h3>
        <section className="relative flex flex-col self-stretch overflow-hidden rounded-md">
          <Image
            alt=""
            className="flex object-cover"
            height={563}
            src={props.carImageUrl ?? ""}
            width={1000}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent">
            <p className="mx-3 mb-3 mt-8 text-xl font-medium text-white">
              {props.car}
            </p>
          </div>
          <Image
            alt=""
            className="absolute left-2 top-2 object-cover drop-shadow-logo"
            height={70}
            src={props.trackLocationLogoUrl ?? ""}
            width={100}
          />
          <Image
            alt=""
            className="absolute right-2 top-2 h-[70px] w-[70px] rounded-[4px] bg-white object-contain p-1 sm:h-[100px] sm:w-[100px] md:h-[150px] md:w-[150px]"
            height={70}
            src={props.trackMapImageUrl ?? ""}
            width={100}
          />
        </section>
        <button className="bg-button text-button-text border-button mt-4 rounded-md border p-3 text-base font-semibold transition duration-200 ease-in-out hover:bg-white hover:text-black">
          View results
        </button>
      </li>
    </Link>
  );
}
