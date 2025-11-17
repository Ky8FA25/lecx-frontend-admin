import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import CategoryTableOne from "./CategoryTableOne";

export default function CategoryTables() {
  return (
    <>
      <PageMeta
        title="React.js Category Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Category Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Category Tables" />
      <div className="space-y-6">
        <ComponentCard title="Category Table 1">
          <CategoryTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
