import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import CVTableOne from "./CVTableOne";

export default function CVTables() {
  return (
    <>
      <PageMeta
        title="React.js CV Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js CV Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="CV Tables" />
      <div className="space-y-6">
        <ComponentCard title="CV Table 1">
          <CVTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
