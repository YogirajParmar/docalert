import { Card } from "@/components/ui/card";
import { FileText, AlertTriangle } from "lucide-react";

interface DashboardStatsProps {
  totalDocuments: number;
  expiredDocuments: number;
}

export function DashboardStats({ totalDocuments, expiredDocuments }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-blue-500" />
          <div>
            <span className="block text-2xl font-bold">{totalDocuments}</span>
            <p className="text-gray-600">Total Documents</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div>
            <span className="block text-2xl font-bold">{expiredDocuments}</span>
            <p className="text-gray-600">Expired Documents</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
