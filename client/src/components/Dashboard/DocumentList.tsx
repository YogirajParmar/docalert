import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Document } from "@shared/schema";

interface DocumentListProps {
  documents: Document[];
  onEdit: (document: Document) => void;
  onDelete: (id: number) => void;
}

export function DocumentList({ documents, onEdit, onDelete }: DocumentListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const getRowStyle = (expirationDate: Date) => {
    const current = new Date();
    const expiration = new Date(expirationDate);
    const warningDate = new Date();
    warningDate.setDate(current.getDate() + 15);

    if (expiration < current) {
      return "bg-red-100";
    } else if (expiration < warningDate) {
      return "bg-yellow-100";
    }
    return "bg-green-100";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Type</TableHead>
            <TableHead>Vehicle Type</TableHead>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Expiration Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className={getRowStyle(doc.expirationDate)}>
              <TableCell>{doc.documentType}</TableCell>
              <TableCell>{doc.vehicleType}</TableCell>
              <TableCell>{doc.vehicleNumber}</TableCell>
              <TableCell>{formatDate(doc.issueDate)}</TableCell>
              <TableCell>{formatDate(doc.expirationDate)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(doc)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(doc.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
