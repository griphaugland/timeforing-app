import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageSlots from "../navigation/page-slots";
import ActionOverview from "../ActionOverview";
import { TableOverview } from "../TableOverview";
import { useDailyEntries } from "../../hooks/daily-entries-hook";
import CaseDialog from "../CaseDialog";
import Wrapper from "../navigation/wrapper";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";

export interface Case {
  caseName: string;
  startTime: string;
  endTime: string;
  activity: string;
  totalTime: string;
  id: string;
}

export default function HomePage() {
  const { allCases, setAllCases, refreshCases } = useDailyEntries([]);
  const navigate = useNavigate();
  const [currentCaseId, setCurrentCaseId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [currentState, setCurrentState] = useState("");
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const today = useMemo(() => {
    const date = new Date();
    const day = date.toLocaleDateString("en-GB", { day: "numeric" });
    const month = date.toLocaleDateString("en-GB", { month: "long" });
    return `${day}. ${month}`;
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const generateId = () => crypto.randomUUID();

  const handleCaseSubmit = (caseName: string, activity: string) => {
    const newCaseId = generateId();
    const newCase = {
      id: newCaseId,
      caseName,
      activity,
      startTime: formatTime(new Date()),
      endTime: "--:--",
      totalTime: "--:--",
    };

    setAllCases((prev: Case[]) => [newCase, ...prev]);
    setCurrentCaseId(newCaseId);
    setCreateDialogOpen(false);
    onStart();
  };

  const onStart = () => {
    if (currentState === "START") return;
    setCurrentState("START");
    setStartTimestamp(Date.now());
  };

  const onStop = () => {
    if (!currentCaseId || currentState === "STOP") return;

    const endTime = formatTime(new Date());
    const totalTime = formatTotalTime(currentTime);

    setAllCases(
      (prev: Case[]) =>
        prev
          .map((caseItem: Case) =>
            caseItem.id === currentCaseId
              ? { ...caseItem, endTime, totalTime }
              : caseItem
          )
          .filter((caseItem) => caseItem.totalTime !== "--:--") // Filter out cases with '--:--' totalTime
    );

    setCurrentCaseId(null);
    setCurrentTime(0);
    setStartTimestamp(null);
    setCurrentState("STOP");
  };

  const onReset = () => {
    setStartTimestamp(null);
    setCurrentTime(0);
    setCurrentState("RESET");
  };

  // Helper function to format the time into HH:mm:ss
  const formatTotalTime = (time: number) => {
    const sec = Math.floor(time / 1000);
    const min = Math.floor(sec / 60);
    const hour = Math.floor(min / 60);
    const seconds = (sec % 60).toString().padStart(2, "0");
    const minutes = (min % 60).toString().padStart(2, "0");
    const hours = (hour % 24).toString().padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  const currentCase = useMemo(
    () => allCases.find((c: Case) => c.id === currentCaseId),
    [allCases, currentCaseId]
  );
  const handleRefresh = () => {
    if (allCases.length === 0) return;
    refreshCases(); // Trigger the refresh function
  };

  useEffect(() => {
    const updateTimer = () => {
      if (startTimestamp !== null) {
        const elapsedTime = Date.now() - startTimestamp;
        setCurrentTime(elapsedTime);
      }
      requestAnimationFrame(updateTimer);
    };

    if (currentState === "START" && startTimestamp !== null) {
      requestAnimationFrame(updateTimer);
    }

    return () => {
      setStartTimestamp(null); // Cleanup on unmount or stop
    };
  }, [currentState, startTimestamp]);

  return (
    <Wrapper>
      <PageSlots>
        <PageSlots.Top>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl text-black font-bold">{today}</h1>
            <Button variant="greyText" onClick={handleRefresh}>
              <RotateCcw />
            </Button>
          </div>
        </PageSlots.Top>
        <PageSlots.Left>
          <TableOverview
            cases={allCases}
            refresh={refreshCases}
            currentTime={currentTime}
            isTimerRunning={currentState === "START"}
          />
        </PageSlots.Left>
        <PageSlots.Right>
          <ActionOverview
            onStart={() => setCreateDialogOpen(true)}
            onStop={onStop}
            onReset={onReset}
            currentCase={currentCase}
            currentTime={currentTime}
          />
        </PageSlots.Right>
        <PageSlots.Bottom>
          <div className="flex justify-start items-start h-16">
            <Button
              variant="greyText"
              size="tiny"
              onClick={() => navigate("/previous")}
            >
              <CalendarIcon />
            </Button>
          </div>
        </PageSlots.Bottom>
      </PageSlots>
      <CaseDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCaseSubmit}
      />
    </Wrapper>
  );
}
