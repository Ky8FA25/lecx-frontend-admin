import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { useApi } from "../../../utils/api";
import { CategoryODataDto } from "../../../types/CategoryODataDto";
import ODataResponse from "../../../types/ODataResponse";

export default function CategoryODataTable() {
  const { apiFetch } = useApi();
  const [categories, setCategories] = useState<CategoryODataDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalType, setModalType] = useState<"detail" | "edit" | "delete" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryODataDto | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch<ODataResponse<CategoryODataDto>>("/odata/categoryOData");
        setCategories(data.value);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openModal = (type: "detail" | "edit" | "delete", category: CategoryODataDto) => {
    setSelectedCategory(category);
    if (type === "edit") {
      setEditName(category.FullName);
      setEditDesc(category.Description);
    }
    setModalType(type);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedCategory(null);
  };

  const handleEditSubmit = async () => {
    if (!selectedCategory) return;
    try {
      await apiFetch(`/category/${selectedCategory.CategoryId}`, {
        method: "PUT",
        body: JSON.stringify({ fullName: editName, description: editDesc }),
      });
      setCategories((prev) =>
        prev.map((c) =>
          c.CategoryId === selectedCategory.CategoryId
            ? { ...c, FullName: editName, Description: editDesc }
            : c
        )
      );
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCategory) return;
    try {
      await apiFetch(`/category/${selectedCategory.CategoryId}`, {
        method: "DELETE",
      });
      setCategories((prev) => prev.filter((c) => c.CategoryId !== selectedCategory.CategoryId));
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading categories...</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Category ID
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Description
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {categories.map((cat) => (
                <TableRow key={cat.CategoryId}>
                  <TableCell className="px-5 py-4 text-start text-theme-sm dark:text-white/90">
                    {cat.CategoryId}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {cat.FullName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {cat.Description}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 flex gap-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => openModal("detail", cat)}
                    >
                      Read
                    </button>
                    <button
                      className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      onClick={() => openModal("edit", cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => openModal("delete", cat)}
                    >
                      Delete
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Overlay */}
      {modalType && selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-96">
            {/* Detail Modal */}
            {modalType === "detail" && (
              <>
                <h2 className="text-lg font-bold mb-4">Category Details</h2>
                <p>
                  <strong>ID:</strong> {selectedCategory.CategoryId}
                </p>
                <p>
                  <strong>Name:</strong> {selectedCategory.FullName}
                </p>
                <p>
                  <strong>Description:</strong> {selectedCategory.Description}
                </p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </>
            )}

            {/* Edit Modal */}
            {modalType === "edit" && (
              <>
                <h2 className="text-lg font-bold mb-4">Edit Category</h2>
                <input
                  className="w-full border rounded px-3 py-2 mb-3"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Full Name"
                />
                <textarea
                  className="w-full border rounded px-3 py-2 mb-3"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Description"
                />
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    onClick={handleEditSubmit}
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {/* Delete Modal */}
            {modalType === "delete" && (
              <>
                <h2 className="text-lg font-bold mb-4">Delete Category</h2>
                <p>
                  Are you sure you want to delete <strong>{selectedCategory.FullName}</strong>?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={handleDeleteSubmit}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
