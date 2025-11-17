import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Badge from "../../../components/ui/badge/Badge";
import { useApi } from "../../../utils/api";
import { CourseODataDto } from "../../../types/CourseODataDto";
import { CourseStatus } from "../../../constants/enums";

interface Category {
  id: number;
  name: string;
  description: string;
}

const categories: Category[] = [
  { id: 1, name: "Programming", description: "Courses related to programming and software development." },
  { id: 2, name: "Data Science", description: "Courses focused on data analysis and machine learning." },
  { id: 3, name: "Web Development", description: "Courses for building websites and web applications." },
  { id: 4, name: "Design", description: "Courses for graphic design and multimedia." },
];

export default function CourseTableOne() {
  const { apiFetch } = useApi();
  const [courses, setCourses] = useState<CourseODataDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [level, setLevel] = useState<string | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<"Title" | "Price">("Title");
  const [orderDir, setOrderDir] = useState<"asc" | "desc">("asc");

  // --- Pagination state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);

  const CourseStatusMap: Record<number, string> = {
    [CourseStatus.Draft]: "Draft",
    [CourseStatus.Published]: "Published",
    [CourseStatus.Archived]: "Archived",
    [CourseStatus.Active]: "Active",
    [CourseStatus.Inactive]: "Inactive",
  };

  // Build OData query string with pagination
  const buildODataQuery = () => {
    const filters: string[] = [];
    if (search) filters.push(`contains(Title,'${search}')`);
    if (categoryId) filters.push(`CategoryId eq ${categoryId}`);
    if (level) filters.push(`Level eq '${level}'`);

    const filterQuery = filters.length > 0 ? `$filter=${filters.join(" and ")}` : "";
    const skip = (currentPage - 1) * pageSize;
    const paginationQuery = `$top=${pageSize}&$skip=${skip}&$count=true`;

    let query = filterQuery ? `${filterQuery}&${paginationQuery}` : paginationQuery;
    if (orderBy) {
      query += `&$orderby=${orderBy} ${orderDir}`;
    }
    return query ? "?" + query : "";
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // reset page when searching
    setSearch(searchInput);
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const query = buildODataQuery();
      const data = await apiFetch<{ value: CourseODataDto[]; "@odata.count": number }>(
        `/odata/courseodata${query}`
      );
      setCourses(data.value);
      setTotalCount(data["@odata.count"] || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [search, categoryId, level, orderBy, orderDir, currentPage, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  if (loading) return <div>Loading courses...</div>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Search title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Search
          </button>
        </form>
        <select
          value={categoryId ?? ""}
          onChange={(e) =>
            setCategoryId(e.target.value ? Number(e.target.value) : undefined)
          }
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          value={level ?? ""}
          onChange={(e) => setLevel(e.target.value || undefined)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        <select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value as "Title" | "Price")}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="Title">Order by Title</option>
          <option value="Price">Order by Price</option>
        </select>
        <select
          value={orderDir}
          onChange={(e) => setOrderDir(e.target.value as "asc" | "desc")}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:text-white"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Title
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Course Code
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Instructor
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Students
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Price
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {courses.map((course) => (
                  <TableRow key={course.CourseId}>
                    <TableCell className="px-5 py-4 text-start text-theme-sm dark:text-white/90">{course.Title}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{course.CourseCode}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{course.InstructorName}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{course.NumberOfStudents}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">${course.Price.toFixed(2)}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <Badge size="sm" color={
                        course.Status === CourseStatus.Published || course.Status === CourseStatus.Active
                          ? "success"
                          : course.Status === CourseStatus.Draft
                          ? "warning"
                          : "error"
                      }>
                        {CourseStatusMap[course.Status] ?? "Unknown"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 dark:bg-white/[0.03] dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-2 py-1 border rounded dark:bg-gray-800 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white">First</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white">Previous</button>
          <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white">Next</button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white">Last</button>
        </div>
      </div>
    </div>
  );
}
