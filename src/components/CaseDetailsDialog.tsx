import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Case } from "./pages/Home";

interface CaseDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caseDetails?: Case | undefined;
}

const CaseDetailsDialog = ({
  open,
  onOpenChange,
  caseDetails,
}: CaseDetailsDialogProps) => {
  if (!caseDetails) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Case Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 flex gap-2 ">
          <p>
            <strong>Case Name:</strong> {caseDetails.caseName}
          </p>
          <p>
            <strong>Start Time:</strong> {caseDetails.startTime}
          </p>
          <p>
            <strong>End Time:</strong> {caseDetails.endTime}
          </p>
          <p>
            <strong>Total Time:</strong> {caseDetails.totalTime}
          </p>
          <p>
            <strong>Activity:</strong> {caseDetails.activity}
          </p>
        </div>
        <Button onClick={() => onOpenChange(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default CaseDetailsDialog;
