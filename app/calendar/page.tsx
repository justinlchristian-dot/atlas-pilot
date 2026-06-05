import { PagePlaceholder } from "@/components/page-placeholder";
import { placeholderPages } from "@/data/today";

export default function CalendarPage() {
  return <PagePlaceholder {...placeholderPages.calendar} />;
}
