import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useApi } from "../../../utils/api";
import { InstructorConfirmationODataDto } from "../../../types/InstructorConfirmationODataDto";
import ODataResponse from "../../../types/ODataResponse";

export interface ApproveInstructorConfirmationResponse {
  success: boolean;
  message?: string;
}

export default function InstructorConfirmationTable() {
  const { apiFetch } = useApi();
  const [confirmations, setConfirmations] = useState<
    InstructorConfirmationODataDto[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<number | null>(null);

  // modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedConfirmation, setSelectedConfirmation] =
    useState<InstructorConfirmationODataDto | null>(null);

  useEffect(() => {
    const fetchConfirmations = async () => {
      try {
        const data = await apiFetch<
          ODataResponse<InstructorConfirmationODataDto>
        >("/odata/instructorconfirmationodata");
        setConfirmations(data.value);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfirmations();
  }, []);

  const handleApproveClick = (conf: InstructorConfirmationODataDto) => {
    setSelectedConfirmation(conf);
    setShowModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedConfirmation) return;

    try {
      setApprovingId(selectedConfirmation.ConfirmationId);
      setShowModal(false);

      // Bước 1: Chờ approve xong
      await apiFetch<ApproveInstructorConfirmationResponse>(
        "/api/instructor-confirmations/approve",
        {
          method: "POST",
          body: JSON.stringify({
            ConfirmationId: selectedConfirmation.ConfirmationId,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      // Bước 2: Sau khi approve xong, fetch lại data
      const data = await apiFetch<
        ODataResponse<InstructorConfirmationODataDto>
      >("/odata/instructorconfirmationodata");
      setConfirmations(data.value); // ← Set lại confirmations
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
      setSelectedConfirmation(null);
    }
  };

  const handleCancelApprove = () => {
    setShowModal(false);
    setSelectedConfirmation(null);
  };

  if (loading) return <div>Loading confirmations...</div>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    User Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    File Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Certificate Link
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Send Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {confirmations.map((conf) => (
                  <TableRow key={conf.ConfirmationId}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm dark:text-white/90">
                      {conf.UserName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {conf.FileName}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <a
                        href={decodeURIComponent(conf.Certificatelink)}
                        target="_blank" // Mở tab mới
                        rel="noopener noreferrer" // Bảo mật
                        className="text-theme-500 hover:underline cursor-pointer"
                      >
                        View Certificate
                      </a>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(conf.SendDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {conf.Description}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <button
                        onClick={() => handleApproveClick(conf)}
                        disabled={approvingId === conf.ConfirmationId}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300"
                      >
                        {approvingId === conf.ConfirmationId
                          ? "Approving..."
                          : "Approve"}
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Confirm Approval
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Are you sure you want to approve{" "}
              <strong>{selectedConfirmation.UserName}</strong>'s submission?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleCancelApprove}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
