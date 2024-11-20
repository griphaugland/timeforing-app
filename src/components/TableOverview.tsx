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

interface Props {
  cases: Case[];
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

// Helper function to sum total time (assuming totalTime is in a format like 'HH:mm')
const sumTotalTime = (cases: Case[]) => {
  let totalSeconds = 0;

  cases.forEach((caseItem) => {
    const [hours, minutes, seconds] = caseItem.totalTime.split(":").map(Number);
    totalSeconds += hours * 3600 + minutes * 60 + seconds;
  });

  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  const totalSecondsLeft = totalSeconds % 60;

  return `${totalHours}h ${totalMinutes}m ${totalSecondsLeft}s`;
};

const TableOverview = ({ cases }: Props) => {
  const minimumRows = 8;
  const emptyRows = Math.max(0, minimumRows - cases.length);

  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [relatedCases, setRelatedCases] = useState<Case[]>([]); // Hold filtered cases

  const handleCaseClick = (caseName: string) => {
    // Filter all cases with the same caseName
    const filteredCases = cases.filter(
      (caseItem) => caseItem.caseName === caseName
    );
    setRelatedCases(filteredCases); // Store filtered cases
    setDetailsDialogOpen(true); // Open the dialog
  };

  return (
    <>
      {/* Main Table */}
      <Card className="w-full bg-content border-border border-2 rounded-2xl ">
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
                  <TableHead className="w-[25%] font-extrabold">
                    Activity
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>

            <ScrollArea className="h-[320px]">
              <Table>
                <TableBody>
                  {cases.map((caseItem, index) => (
                    <TableRow key={index}>
                      <TableCell
                        onClick={() => handleCaseClick(caseItem.caseName)} // Click to filter by caseName
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
                        {caseItem.totalTime}
                      </TableCell>
                      <TableCell className="w-[25%] font-extrabold text-foreground">
                        {formatTextToShowDotsWithTextOnHover(caseItem.activity)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {cases.length < minimumRows &&
                    Array.from({ length: emptyRows }).map((_, index) => (
                      <TableRow key={`empty-${index}`}>
                        <TableCell className="w-[30%]">&nbsp;</TableCell>
                        <TableCell className="w-[15%]">&nbsp;</TableCell>
                        <TableCell className="w-[15%]">&nbsp;</TableCell>
                        <TableCell className="w-[15%]">&nbsp;</TableCell>
                        <TableCell className="w-[25%]">&nbsp;</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Related Cases Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Related Cases</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {relatedCases.length > 0 ? (
              <>
                <p>
                  <strong>Total Time for All Related Cases:</strong>{" "}
                  {sumTotalTime(relatedCases)}
                </p>
                <hr />
                {relatedCases.map((caseItem, index) => (
                  <div key={index}>
                    <p>
                      <strong>Case Name:</strong> {caseItem.caseName}
                    </p>
                    <p>
                      <strong>Start Time:</strong> {caseItem.startTime}
                    </p>
                    <p>
                      <strong>End Time:</strong> {caseItem.endTime}
                    </p>
                    <p>
                      <strong>Total Time:</strong> {caseItem.totalTime}
                    </p>
                    <p>
                      <strong>Activity:</strong> {caseItem.activity}
                    </p>
                    <hr />
                  </div>
                ))}
              </>
            ) : (
              <p>No related cases found.</p>
            )}
          </div>
          <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { TableOverview };
