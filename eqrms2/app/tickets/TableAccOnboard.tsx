"use client";

import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import { ReactTableWrapper } from "@/components/data-table/ReactTableWrapper";
import { columns } from "./columns-ac-onboard";
import { AccountOnboarding } from "@/types/account-onboard-detail";
import { useAutoSorting } from "@/lib/hooks/useAutoSorting";

export default function TableAccOnboard({ data }: { data: AccountOnboarding[] }) {

  const autoSortedColumns = useAutoSorting(data, columns);

  const table = useReactTable({
    data,
    columns: autoSortedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    globalFilterFn: "includesString",
    filterFns: {
        // Custom filter function for multi-select
        arrIncludesSome: (row, columnId, value) => {
          const cellValue = row.getValue(columnId);
          return value.includes(cellValue);
        },
      },
      initialState: {
        pagination: {
          pageSize: 30, // Set default page size
        },
      },
    });

    const filters = [
        { column: "onboarding_type_name", title: "Type", placeholder: "Type" },
        { column: "group_name", title: "Group", placeholder: "Group" },
        { column: "get_customer_info", title: "Info", placeholder: "Info" },
        { column: "ops_check_info", title: "Info check", placeholder: "Info check" },
        { column: "forms_filled", title: "Form Fill", placeholder: "Form Fill" },
        { column: "sent_for_sig", title: "Sent Sign", placeholder: "Sent Sign" },
        { column: "form_recieved", title: "Form Recvd", placeholder: "Form Recvd" },
        { column: "form_processing", title: "Form Process", placeholder: "Form Process" },
        { column: "account_opened", title: "AC Open", placeholder: "AC Open" },
      ];
    
      return <ReactTableWrapper table={table} className="text-xs text-center" filters={filters} />;
    }