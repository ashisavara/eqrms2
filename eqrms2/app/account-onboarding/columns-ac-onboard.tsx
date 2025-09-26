import { ColumnDef } from "@tanstack/react-table";  
import Link from "next/link";
import { RatingDisplay } from "@/components/conditional-formatting";
import { AccountOnboarding } from "@/types/account-onboard-detail";
import { CircleCheckBig } from "lucide-react";
import { EditAcOnboardButton } from "@/components/forms/EditAcOnboard";

export const columns: ColumnDef<AccountOnboarding>[] = [
  { accessorKey: "onboarding_title", 
    header: "Name", 
    cell: ({ getValue, row }) => getValue() == null ? null : <div className="blue-hyperlink"><EditAcOnboardButton 
        AcOnboardingData={row.original} 
        acOnboardId={row.original.id} 
    /></div> 
  },
  { accessorKey: "onboarding_type_name", header: "Type", cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800 font-semibold">{getValue() as string}</div>, filterFn: "arrIncludesSome" },
  { accessorKey: "group_name", header: "Group", cell: ({ getValue }) => getValue() == null ? null : <div className="text-gray-800 font-semibold">{getValue() as string}</div>, filterFn: "arrIncludesSome" },
  { accessorKey: "status_client", header: "Status Client", cell: ({ getValue }) => getValue() == null ? null : <div>{getValue() as string}</div> },
  { accessorKey: "status_internal", header: "Status Internal", cell: ({ getValue }) => getValue() == null ? null : <div>{getValue() as string}</div> },
  { accessorKey: "get_customer_info", header: "Info", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
  { accessorKey: "ops_check_info", header: "Info correct", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
  { accessorKey: "forms_filled", header: "Form filled", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
  { accessorKey: "sent_for_sig", header: "Sent Sign", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
  { accessorKey: "form_recieved", header: "Form Recvd", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
  { accessorKey: "form_processing", header: "Form Processing", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
  { accessorKey: "account_opened", header: "Ac Opened", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
  { accessorKey: "funding_done", header: "Funding Done", cell: ({ getValue }) => getValue() === true ? <div className="text-center"><CircleCheckBig className="h-5 w-5 text-green-800 bg-green-100 rounded-md mx-auto" /></div> : null, filterFn: "arrIncludesSome" },
];