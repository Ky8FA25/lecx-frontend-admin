import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import UserTableOne from "./UserTableOne";

export default function UserTables() {
  return (
    <>
      <PageMeta
        title="React.js User Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js User Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="User Tables" />
      <div className="space-y-6">
        <ComponentCard title="User Table 1">
          <UserTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
