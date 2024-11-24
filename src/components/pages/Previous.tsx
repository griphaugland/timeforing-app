import { useState } from "react";
import Wrapper from "../navigation/wrapper";
import { PageSlots } from "../navigation/page-slots";
import { DatePicker } from "../ui/date-picker"; // Replace with your ShadCN DatePicker import
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { TableOverview } from "../TableOverview";
import { useDailyEntries } from "../../hooks/daily-entries-hook";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export default function PreviousEntries() {
  const { allCases, getEntriesForDate } = useDailyEntries([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dateCases, setDateCases] = useState(allCases);
  const navigate = useNavigate();

  // Handle date selection
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;

    // Format date to YYYY-MM-DD in local time zone
    const formattedDate = format(date, "yyyy-MM-dd");
    setSelectedDate(formattedDate);

    // Fetch cases for the selected date
    const casesForDate = getEntriesForDate(formattedDate);
    setDateCases(casesForDate);
  };

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <Wrapper>
      <PageSlots>
        <PageSlots.Top>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-black">Previous Entries</h1>
            <Button variant="greyText" onClick={() => navigate("/")}>
              Back to Today <ChevronRight />
            </Button>
          </div>
        </PageSlots.Top>
        <PageSlots.Left>
          <TableOverview
            cases={dateCases}
            refresh={() => console.log("Deleted successfully")}
          />
        </PageSlots.Left>
        <PageSlots.Right>
          <div className="space-y-4">
            <DatePicker
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={handleDateChange}
              placeholder="Pick a date"
            />
            {/*             <Button
              variant="greyText"
              size="tiny"
              onClick={() => setNewDay()}
              className="flex items-center space-x-2"
            >
              <RotateCw />
              <span>Reset Today&apos;s Cases</span>
            </Button> */}
          </div>
        </PageSlots.Right>
        <PageSlots.Bottom>
          {formattedDate ? (
            <h2 className="text-lg font-semibold">
              Entries for {formattedDate}
            </h2>
          ) : (
            <h2 className="text-lg font-semibold">Today&apos;s Entries</h2>
          )}
          {dateCases.length > 0 ? (
            <p className="text-gray-700">
              Displaying {dateCases.length} entries.
            </p>
          ) : (
            <p className="text-gray-600">No entries for the selected date.</p>
          )}
        </PageSlots.Bottom>
      </PageSlots>
    </Wrapper>
  );
}
