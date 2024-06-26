import { useState } from "react";
import { WordRequestType } from "@/types/dictionary";
import VerbComponent from "./grammaticalTypes/Verb";
import NounComponent from "./grammaticalTypes/Noun";
import { Button } from "../Button";
import AdjektivComponent from "./grammaticalTypes/Adjektiv";
import AdverbComponent from "./grammaticalTypes/Adverb";
import InterjectionComponent from "./grammaticalTypes/Interjection";
import PrepositionComponent from "./grammaticalTypes/Preposition";
import ConjunctionComponent from "./grammaticalTypes/Conjunction";
import PronoumComponent from "./grammaticalTypes/Pronoum";
import Loading from "../Loading";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

const Results = ({
  data,
  isLoading,
  isError,
  currentIndex,
  setCurrentIndex,
}: {
  data: WordRequestType;
  isLoading: boolean;
  isError: boolean;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
}) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center mt-24">
        <Loading />
      </div>
    );
  }
  if (isError) {
    return <p>Something went wrong...</p>;
  }

  function getGrammaticalClassComponent(
    grammaticalClass: string,
    index: number,
  ) {
    const wordSource = data.hits?.hits[index]?._source;
    switch (grammaticalClass) {
      case "vb":
        return <VerbComponent data={wordSource} />;
      case "vbm":
        return <VerbComponent data={wordSource} />;
      case "nn":
        return <NounComponent data={wordSource} />;
      case "nnm":
        return <NounComponent data={wordSource} />;
      case "av":
        return <AdjektivComponent data={wordSource} />;
      case "avm":
        return <AdjektivComponent data={wordSource} />;
      case "ab":
        return <AdverbComponent data={wordSource} />;
      case "abm":
        return <AdverbComponent data={wordSource} />;
      case "in":
        return <InterjectionComponent data={wordSource} />;
      case "inm":
        return <InterjectionComponent data={wordSource} />;
      case "pp":
        return <PrepositionComponent data={wordSource} />;
      case "ppm":
        return <PrepositionComponent data={wordSource} />;
      case "kn":
        return <ConjunctionComponent data={wordSource} />;
      case "sn":
        return <ConjunctionComponent data={wordSource} />;
      case "snm":
        return <ConjunctionComponent data={wordSource} />;
      case "pn":
        return <PronoumComponent data={wordSource} />;
      default:
        return <p>Error trying to find the component</p>;
    }
  }

  const handleIncreaseIndex = () => {
    if (currentIndex < data.hits?.hits.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };
  const handleDecreaseIndex = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else {
      setCurrentIndex(data.hits?.hits.length - 1);
    }
  };
  return (
    <>
      <div className="w-full">
        <div className="flex-col flex items-center">
          <div className="justify-center  items-center flex flex-col w-full overflow-x-scroll pb-3 md:pb-0">
            <div>
              <p className="font-light text-sm">
                Results for:{" "}
                <span className="font-semibold underline">
                  {
                    data.hits?.hits[currentIndex]?._source
                      .FormRepresentations[0].baseform
                  }
                </span>
              </p>
              {getGrammaticalClassComponent(
                data.hits?.hits[currentIndex]?._source.FormRepresentations[0]
                  .partOfSpeech,
                currentIndex,
              )}
            </div>
          </div>
          {data.hits?.hits.length > 1 && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleDecreaseIndex}
                className=" rounded-lg flex items-center gap-3 px-2 py-1 hover:bg-gray-800 text-sm  border-t-2 border-transparent  "
              >
                <ChevronRightIcon
                  className="rotate-180"
                  width={20}
                  strokeWidth={2}
                />
              </button>
              <p>{currentIndex + 1}</p>

              <button
                onClick={handleIncreaseIndex}
                className=" rounded-lg flex items-center gap-3 px-2 py-1 hover:bg-gray-800 text-sm  border-t-2 border-transparent  "
              >
                <ChevronLeftIcon
                  className="rotate-180"
                  width={20}
                  strokeWidth={2}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Results;
