import { useState } from "react";
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
import { Ellipsis } from "lucide-react";
import { CaseOverviewDialog } from "./ui/case-overview";
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
  currentCase: Case | null | undefined;
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
  currentCase,
  refresh,
  currentTime,
  isTimerRunning,
}: Props) => {
  const minimumRows = 8;
  const emptyRows = Math.max(0, minimumRows - cases.length);
  const { deleteCase, editCase, calculateTotalTime } = useDailyEntries(cases);

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

      <CaseOverviewDialog
        detailsDialogOpen={detailsDialogOpen}
        setDetailsDialogOpen={setDetailsDialogOpen}
        relatedCases={relatedCases}
        handleEditSession={handleEditSession}
        handleOpenDeleteDialog={handleOpenDeleteDialog}
        isTimerRunning={isTimerRunning}
        currentTime={currentTime}
        currentCase={currentCase}
      />

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
