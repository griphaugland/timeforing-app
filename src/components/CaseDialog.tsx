import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

interface CaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (caseName: string, activity: string) => void;
}

const CaseDialog = ({ open, onOpenChange, onSubmit }: CaseDialogProps) => {
  const [caseName, setCaseName] = React.useState("");
  const [activity, setActivity] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(caseName, activity);
    setCaseName("");
    setActivity("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl">New Case</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="caseName">Case Name</Label>
              <Input
                id="caseName"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="activity">Activity</Label>
              <Input
                id="activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Start Timer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CaseDialog;
