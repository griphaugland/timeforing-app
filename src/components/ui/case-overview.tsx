import { useEffect, useState } from "react";
import { ChevronDown, Ellipsis } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Case } from "../pages/Home";

type CaseOverviewDialogProps = {
  detailsDialogOpen: boolean;
  setDetailsDialogOpen: (open: boolean) => void;
  relatedCases: Case[];
  handleEditSession: (caseItem: Case) => void;
  handleOpenDeleteDialog: (caseItem: Case) => void;
  isTimerRunning: boolean;
  currentCase: Case | null | undefined;
  currentTime: number;
};

function CaseOverviewDialog(props: CaseOverviewDialogProps) {
  const [formattedTime, setFormattedTime] = useState("00:00:00:000");
  // Utility: Group cases by activity
  const {
    detailsDialogOpen,
    setDetailsDialogOpen,
    relatedCases,
    handleEditSession,
    handleOpenDeleteDialog,
    isTimerRunning,
    currentTime,
    currentCase,
  } = props;
  const groupCasesByActivity = (cases: Case[]) => {
    return cases.reduce<Record<string, Case[]>>((acc, caseItem) => {
      const activity = caseItem.activity;
      if (!acc[activity]) {
        acc[activity] = [];
      }
      acc[activity].push(caseItem);
      return acc;
    }, {});
  };

  // Converts HH:mm:ss to total seconds
  const timeToSeconds = (time: string) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const secondsToTime = (totalSeconds: number) => {
    const roundedSeconds = Math.floor(totalSeconds); // Round to the nearest integer
    const hours = Math.floor(roundedSeconds / 3600);
    const minutes = Math.floor((roundedSeconds % 3600) / 60);
    const seconds = roundedSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  useEffect(() => {
    const calculateTotalTimeForCaseName = (
      ClickedCaseName: string,
      cases: Case[]
    ) => {
      console.log(ClickedCaseName, cases);
      console.log(currentCase);
      const totalSecondsWithSameCaseName = cases
        .filter((caseItem) => caseItem.caseName === ClickedCaseName)
        .reduce((acc, caseItem) => {
          if (caseItem.totalTime !== "--:--") {
            acc += timeToSeconds(caseItem.totalTime);
          }
          return acc;
        }, 0);

      const currentElapsed = isTimerRunning ? currentTime / 1000 : 0;
      if (currentCase?.caseName === ClickedCaseName && isTimerRunning) {
        return totalSecondsWithSameCaseName + currentElapsed;
      } else {
        return totalSecondsWithSameCaseName;
      }
    };

    if (relatedCases.length > 0) {
      const calculatedTime = calculateTotalTimeForCaseName(
        relatedCases[0].caseName,
        relatedCases
      );
      setFormattedTime(secondsToTime(calculatedTime));
    }
  }, [relatedCases, currentTime, isTimerRunning]);

  return (
    <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
      <DialogContent className="max-w-2xl w-full h-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">All Sessions</DialogTitle>
          <div className="mt-2 text-2xl flex justify-between">
            <p>Total time spent on this case: </p>
            <span className="font-bold">{formattedTime}</span>
          </div>
        </DialogHeader>
        <Card className="w-full bg-content border-none rounded-2xl">
          <CardContent className="p-0">
            <div className="relative w-full">
              <Table className="">
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="w-[30%] font-extrabold">
                      Case
                    </TableHead>
                    <TableHead className="w-[15%] font-extrabold">
                      Start
                    </TableHead>
                    <TableHead className="w-[15%] font-extrabold">
                      End
                    </TableHead>
                    <TableHead className="w-[15%] font-extrabold">
                      Time
                    </TableHead>
                    <TableHead className="w-[20%] font-extrabold">
                      Activity
                    </TableHead>
                    <TableHead className="w-[5%] font-extrabold">
                      Edit
                    </TableHead>
                  </TableRow>
                </TableHeader>
              </Table>

              <ScrollArea className="h-[320px]">
                {Object.entries(
                  groupCasesByActivity(relatedCases) // Use relatedCases here
                ).map(([activity, cases]) => (
                  <Collapsible key={activity} className="border-b-2">
                    <CollapsibleTrigger className="flex justify-between items-center w-full p-4 hover:bg-gray-200 ">
                      <span className="font-bold text-xs">
                        {" "}
                        Activity {activity}
                      </span>
                      <ChevronDown />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="py-2 px-2 bg-gray-100">
                      <Table>
                        <TableBody>
                          {cases.map((caseItem) => (
                            <TableRow key={caseItem.id}>
                              <TableCell className="w-[30%] font-extrabold">
                                {caseItem.caseName}
                              </TableCell>
                              <TableCell className="w-[15%]">
                                {caseItem.startTime}
                              </TableCell>
                              <TableCell className="w-[15%]">
                                {caseItem.endTime}
                              </TableCell>
                              <TableCell className="w-[15%]">
                                {caseItem.totalTime}
                              </TableCell>
                              <TableCell className="w-[20%]">
                                {caseItem.activity}
                              </TableCell>
                              <TableCell className="w-[5%]">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Ellipsis className="cursor-pointer" />
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleEditSession(caseItem)
                                      }
                                    >
                                      Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      className="text-red-500"
                                      onClick={() =>
                                        handleOpenDeleteDialog(caseItem)
                                      }
                                    >
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}

export { CaseOverviewDialog };
