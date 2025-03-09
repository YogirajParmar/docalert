import { useCallback, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Document, InsertDocument } from "@shared/schema";
import { TitleBar } from "@/components/Layout/TitleBar";
import { DashboardStats } from "@/components/Dashboard/DashboardStats";
import { ExpiringDocuments } from "@/components/Dashboard/ExpiringDocuments";
import { DocumentList } from "@/components/Dashboard/DocumentList";
import { UploadForm } from "@/components/Dashboard/UploadForm";
import { EditDocumentModal } from "@/components/Dashboard/EditDocumentModal";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);

  // Fetch documents
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
  });

  // Fetch stats
  const { data: stats = { totalDocuments: 0, expiredDocuments: 0 } } = useQuery<{
    totalDocuments: number;
    expiredDocuments: number;
  }>({
    queryKey: ["/api/documents/stats"],
  });

  // Add document mutation
  const addDocumentMutation = useMutation({
    mutationFn: async (document: InsertDocument) => {
      const res = await apiRequest("POST", "/api/documents", document);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/stats"] });
      toast({
        title: "Success",
        description: "Document added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update document mutation
  const updateDocumentMutation = useMutation({
    mutationFn: async ({
      id,
      document,
    }: {
      id: number;
      document: InsertDocument;
    }) => {
      const res = await apiRequest("PUT", `/api/documents/${id}`, document);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/stats"] });
      setEditingDocument(null);
      toast({
        title: "Success",
        description: "Document updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete document mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/stats"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEditDocument = useCallback((document: Document) => {
    setEditingDocument(document);
  }, []);

  const handleDeleteDocument = useCallback(
    (id: number) => {
      if (window.confirm("Are you sure you want to delete this document?")) {
        deleteDocumentMutation.mutate(id);
      }
    },
    [deleteDocumentMutation]
  );

  const handleUpdateDocument = useCallback(
    (id: number, document: InsertDocument) => {
      updateDocumentMutation.mutate({ id, document });
    },
    [updateDocumentMutation]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <TitleBar />

      <div className="container mx-auto px-4 py-8 mt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Document Dashboard</h1>
            <p className="text-gray-600">
              Welcome back, {user?.firstName} {user?.lastName}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => logoutMutation.mutate()}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {logoutMutation.isPending ? "Logging out..." : "Logout"}
          </Button>
        </div>

        <DashboardStats
          totalDocuments={stats.totalDocuments}
          expiredDocuments={stats.expiredDocuments}
        />

        <ExpiringDocuments documents={documents} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-semibold mb-4">Document List</h2>
            <DocumentList
              documents={documents}
              onEdit={handleEditDocument}
              onDelete={handleDeleteDocument}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Add New Document</h2>
            <UploadForm
              onSubmit={(data) => addDocumentMutation.mutate(data)}
              isSubmitting={addDocumentMutation.isPending}
            />
          </div>
        </div>

        <EditDocumentModal
          document={editingDocument}
          isOpen={!!editingDocument}
          onClose={() => setEditingDocument(null)}
          onSubmit={handleUpdateDocument}
          isSubmitting={updateDocumentMutation.isPending}
        />
      </div>
    </div>
  );
}
