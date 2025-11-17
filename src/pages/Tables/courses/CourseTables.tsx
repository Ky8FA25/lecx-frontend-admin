import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import CourseTableOne from "./CourseTableOne";

export default function CourseTables() {
  return (
    <>
      <PageMeta
        title="React.js Course Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Course Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Course Tables" />
      <div className="space-y-6">
        <ComponentCard title="Course Table 1">
          <CourseTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
