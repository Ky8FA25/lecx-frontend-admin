import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ComponentCard from "../../../components/common/ComponentCard";
import PageMeta from "../../../components/common/PageMeta";
import PaymentTableOne from "./PaymentTableOne";

export default function PaymentTables() {
  return (
    <>
      <PageMeta
        title="React.js Payment Tables Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js Payment Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Payment Tables" />
      <div className="space-y-6">
        <ComponentCard title="Payment Table 1">
          <PaymentTableOne />
        </ComponentCard>
      </div>
    </>
  );
}
