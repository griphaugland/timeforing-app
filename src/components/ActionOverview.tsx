import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Play, Pause } from "lucide-react";
import { Case } from "./pages/Home";

interface Props {
  currentCase: Case | null | undefined;
  currentTime: {
    hours: string;
    minutes: string;
    seconds: string;
    millis: string;
  };
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

function ActionOverview({ currentCase, currentTime, onStart, onStop }: Props) {
  const isActive = Boolean(currentCase);

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
            <span className="number-block">{currentTime.hours}</span>
            <span>:</span>
            <span className="number-block">{currentTime.minutes}</span>
            <span>:</span>
            <span className="number-block">{currentTime.seconds}</span>
            <span>:</span>
            <span className="number-block">{currentTime.millis}</span>
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
          className="bg-white hover:bg-black/5 rounded-xl p-4 px-2 h-[80px] text-black text-3xl mt-auto font-extrabold"
        >
          <Pause />
        </Button>
      ) : (
        <Button
          onClick={onStart}
          className="bg-black rounded-xl p-4 px-2 h-[80px] text-white mt-auto font-extrabold"
        >
          <Play />
        </Button>
      )}
    </Card>
  );
}

export default ActionOverview;
