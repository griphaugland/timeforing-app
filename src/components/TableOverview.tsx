import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Case } from "./pages/Home";
import { ChevronDown, Ellipsis } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { useDailyEntries } from "../hooks/daily-entries-hook";
import { Input } from "./ui/input";

interface Props {
  cases: Case[];
  refresh: () => void;
  currentTime: number;
  isTimerRunning: boolean;
}

const formatTextToShowDotsWithTextOnHover = (text: string) => {
  return text.length > 14 ? (
    <span className="hide-text-after-14-characters">
      {text.slice(0, 14)} ...
    </span>
  ) : (
    text
  );
};

const TableOverview = ({
  cases,
  refresh,
  currentTime,
  isTimerRunning,
}: Props) => {
  const minimumRows = 8;
  const emptyRows = Math.max(0, minimumRows - cases.length);
  const { deleteCase, editCase, calculateTotalTime } = useDailyEntries(cases);
  const [formattedTime, setFormattedTime] = useState("00:00:00:000");

  const [relatedCases, setRelatedCases] = useState<Case[]>([]);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<Case | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [caseToEdit, setCaseToEdit] = useState<Case | null>(null);

  const handleEditSession = (caseItem: Case) => {
    setCaseToEdit(caseItem); // Set the selected case for editing
    setEditDialogOpen(true); // Open the edit dialog
  };
  // Utility: Group cases by activity
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
    const calculateTotalTimeForCaseName = (caseName: string, cases: Case[]) => {
      const totalSecondsWithSameCaseName = cases
        .filter((caseItem) => caseItem.caseName === caseName)
        .reduce((acc, caseItem) => {
          if (caseItem.totalTime !== "--:--") {
            acc += timeToSeconds(caseItem.totalTime);
          }
          return acc;
        }, 0);

      const currentElapsed =
        relatedCases[0]?.caseName === caseName && isTimerRunning
          ? currentTime / 1000
          : 0;

      return totalSecondsWithSameCaseName + currentElapsed;
    };

    if (relatedCases.length > 0) {
      const calculatedTime = calculateTotalTimeForCaseName(
        relatedCases[0].caseName,
        relatedCases
      );
      setFormattedTime(secondsToTime(calculatedTime));
    }
  }, [relatedCases, currentTime, isTimerRunning]);

  const handleSaveEdit = () => {
    if (caseToEdit) {
      const updatedCase = {
        ...caseToEdit,
        totalTime: calculateTotalTime(caseToEdit.startTime, caseToEdit.endTime),
      };
      editCase(updatedCase);
      refresh();
      setEditDialogOpen(false);
    }
  };

  const handleDeleteSession = () => {
    if (caseToDelete) {
      deleteCase(caseToDelete.id);
      setCaseToDelete(null);
      setDeleteDialogOpen(false);
      refresh();
    }
  };

  const handleOpenDeleteDialog = (caseItem: Case) => {
    setCaseToDelete(caseItem);
    setDeleteDialogOpen(true);
  };
  // Adjusted handleCaseClick to populate relatedCases dynamically
  const handleCaseClick = (caseName: string) => {
    const filteredCases = cases.filter(
      (caseItem) => caseItem.caseName === caseName
    );
    setRelatedCases(filteredCases);
    setDetailsDialogOpen(true);
  };

  return (
    <>
      <Card className="w-full bg-content border-border border-2 rounded-2xl">
        <CardContent className="p-0">
          <div className="relative w-full">
            <Table>
              <TableHeader className="sticky top-0 z-10">
                <TableRow>
                  <TableHead className="w-[30%] font-extrabold">Case</TableHead>
                  <TableHead className="w-[15%] font-extrabold">
                    Start
                  </TableHead>
                  <TableHead className="w-[15%] font-extrabold">End</TableHead>
                  <TableHead className="w-[15%] font-extrabold">Time</TableHead>
                  <TableHead className="w-[20%] font-extrabold">
                    Activity
                  </TableHead>
                  <TableHead className="w-[5%] font-extrabold">Edit</TableHead>
                </TableRow>
              </TableHeader>
            </Table>

            <ScrollArea className="h-[320px]">
              <Table>
                <TableBody>
                  {cases.map((caseItem, index) => (
                    <TableRow key={caseItem.id || index}>
                      <TableCell
                        onClick={() => handleCaseClick(caseItem.caseName)}
                        className="w-[30%] font-extrabold text-foreground cursor-pointer"
                      >
                        {formatTextToShowDotsWithTextOnHover(caseItem.caseName)}
                      </TableCell>
                      <TableCell className="w-[15%] font-extrabold text-foreground">
                        {caseItem.startTime}
                      </TableCell>
                      <TableCell className="w-[15%] font-extrabold text-foreground">
                        {caseItem.endTime}
                      </TableCell>
                      <TableCell className="w-[15%] font-extrabold text-foreground">
                        {calculateTotalTime(
                          caseItem.startTime,
                          caseItem.endTime
                        )}
                      </TableCell>
                      <TableCell className="w-[20%] font-extrabold text-foreground">
                        {formatTextToShowDotsWithTextOnHover(caseItem.activity)}
                      </TableCell>
                      <TableCell className="w-[5%] font-extrabold text-foreground">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            asChild
                            className="rounded-full hover:text-gray-500 focus:text-gray-500"
                          >
                            <Ellipsis className="cursor-pointer" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleEditSession(caseItem)}
                            >
                              Edit Session
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleOpenDeleteDialog(caseItem)}
                              className="text-red-500 cursor-pointer"
                            >
                              Delete Session
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {Array.from({ length: emptyRows }).map((_, index) => (
                    <TableRow key={`empty-${index}`}>
                      <TableCell className="w-[30%]">&nbsp;</TableCell>
                      <TableCell className="w-[15%]">&nbsp;</TableCell>
                      <TableCell className="w-[15%]">&nbsp;</TableCell>
                      <TableCell className="w-[15%]">&nbsp;</TableCell>
                      <TableCell className="w-[20%]">&nbsp;</TableCell>
                      <TableCell className="w-[5%]">&nbsp;</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Dialogs remain the same */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl w-full h-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold">
              All Sessions
            </DialogTitle>
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
                        <span className="font-medium">{activity}</span>
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

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Session</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this session?</p>
          <div className="mt-4 flex justify-end space-x-4">
            <Button variant="ghost" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSession}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session</DialogTitle>
          </DialogHeader>
          {caseToEdit && (
            <div className="space-y-4">
              {/* ID (Uneditable) */}
              <div>
                <label className="block text-sm font-medium">
                  ID (Uneditable)
                </label>
                <Input value={caseToEdit.id} disabled />
              </div>
              {/* Case Name */}
              <div>
                <label className="block text-sm font-medium">Case Name</label>
                <Input
                  value={caseToEdit.caseName}
                  onChange={(e) =>
                    setCaseToEdit(
                      (prev) => prev && { ...prev, caseName: e.target.value }
                    )
                  }
                />
              </div>
              {/* Activity */}
              <div>
                <label className="block text-sm font-medium">Activity</label>
                <Input
                  value={caseToEdit.activity}
                  onChange={(e) =>
                    setCaseToEdit(
                      (prev) => prev && { ...prev, activity: e.target.value }
                    )
                  }
                />
              </div>
              {/* Start Time */}
              <div>
                <label className="block text-sm font-medium">Start Time</label>
                <Input
                  type="time"
                  value={caseToEdit.startTime}
                  onChange={(e) =>
                    setCaseToEdit(
                      (prev) => prev && { ...prev, startTime: e.target.value }
                    )
                  }
                />
              </div>
              {/* End Time */}
              <div>
                <label className="block text-sm font-medium">End Time</label>
                <Input
                  type="time"
                  value={caseToEdit.endTime}
                  onChange={(e) =>
                    setCaseToEdit(
                      (prev) => prev && { ...prev, endTime: e.target.value }
                    )
                  }
                />
              </div>
              {/* Total Time */}
              <div>
                <label className="block text-sm font-medium">Total Time</label>
                <Input
                  value={calculateTotalTime(
                    caseToEdit?.startTime || "",
                    caseToEdit?.endTime || ""
                  )}
                  disabled
                />
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => setEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export { TableOverview };
