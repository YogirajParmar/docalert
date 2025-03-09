import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document } from "@shared/schema";
import { AlertTriangle } from "lucide-react";

interface ExpiringDocumentsProps {
  documents: Document[];
}

export function ExpiringDocuments({ documents }: ExpiringDocumentsProps) {
  const expiringDocs = documents.filter(doc => {
    const expirationDate = new Date(doc.expirationDate);
    const fifteenDaysFromNow = new Date();
    fifteenDaysFromNow.setDate(fifteenDaysFromNow.getDate() + 15);
    return expirationDate <= fifteenDaysFromNow && expirationDate > new Date();
  });

  const getDaysUntilExpiry = (expirationDate: Date) => {
    return Math.ceil(
      (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Documents Expiring Soon
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full">
          <div className="flex gap-4 pb-4">
            {expiringDocs.length === 0 ? (
              <div className="w-full text-center text-gray-500">
                No documents expiring soon
              </div>
            ) : (
              expiringDocs.map((doc) => (
                <Card key={doc.id} className="min-w-[250px] bg-yellow-50">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-2">{doc.documentType}</h4>
                    <p className="text-sm"><strong>Vehicle:</strong> {doc.vehicleNumber}</p>
                    <p className="text-sm">
                      <strong>Expires:</strong> {new Date(doc.expirationDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm">
                      <strong>Days left:</strong> {getDaysUntilExpiry(doc.expirationDate)}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
