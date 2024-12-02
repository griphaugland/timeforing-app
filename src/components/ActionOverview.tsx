import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Play, Square } from "lucide-react";
import { Case } from "./pages/Home";

interface Props {
  currentCase: Case | null | undefined;
  currentTime: number;
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

function ActionOverview({ currentCase, currentTime, onStart, onStop }: Props) {
  const isActive = Boolean(currentCase);
  const currentTimeObj = {
    hours: Math.floor(currentTime / 3600000)
      .toString()
      .padStart(2, "0"),
    minutes: Math.floor((currentTime % 3600000) / 60000)
      .toString()
      .padStart(2, "0"),
    seconds: Math.floor((currentTime % 60000) / 1000)
      .toString()
      .padStart(2, "0"),
    millis: (currentTime % 1000).toString().padStart(3, "0"),
  };

  return (
    <Card className="flex flex-col p-4 h-full bg-content border-border border-2 rounded-2xl w-auto">
      <CardContent className="p-0 text-2xl h-full mb-4 w-full flex flex-col justify-between font-extrabold">
        {isActive ? (
          <div className="text-foreground text-2xl ">
            {currentCase?.caseName}
          </div>
        ) : (
          <div className="text-2xl text-gray-500 opacity-50">-</div>
        )}
        {isActive ? (
          <div className="text-foreground text-4xl font-extrabold max-w-[100%] flex gap-1">
            <span className="number-block">{currentTimeObj.hours}</span>
            <span>:</span>
            <span className="number-block">{currentTimeObj.minutes}</span>
            <span>:</span>
            <span className="number-block">{currentTimeObj.seconds}</span>
            <span>:</span>
            <span className="number-block">{currentTimeObj.millis}</span>
          </div>
        ) : (
          <div className="text-gray-500 opacity-50 text-4xl font-extrabold max-w-[100%] flex gap-1">
            <span className="number-block">00</span>
            <span>:</span>
            <span className="number-block">00</span>
            <span>:</span>
            <span className="number-block">00</span>
            <span>:</span>
            <span className="number-block">000</span>
          </div>
        )}
      </CardContent>
      {isActive ? (
        <Button
          onClick={onStop}
          className="bg-red-700 hover:bg-red-500 rounded-xl p-4 px-2 h-[80px] text-white text-3xl mt-auto font-extrabold"
        >
          <Square fill="white" />
        </Button>
      ) : (
        <Button
          onClick={onStart}
          className="bg-green-700 hover:bg-green-600 rounded-xl p-4 px-2 h-[80px] text-white mt-auto font-extrabold"
        >
          <Play fill="white" />
        </Button>
      )}
    </Card>
  );
}

export default ActionOverview;
