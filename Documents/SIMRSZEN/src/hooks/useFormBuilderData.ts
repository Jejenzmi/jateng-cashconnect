import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "./use-toast";

// Interfaces untuk data form builder
interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  fields: any[]; // Struktur field dalam bentuk JSON
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface FormSubmission {
  id: string;
  form_template_id: string;
  patient_id: string;
  submitted_data: any; // Data yang disubmit dalam bentuk JSON
  submitted_by: string;
  submitted_at: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  created_at: string;
  updated_at: string;
}

interface FormField {
  id: string;
  form_template_id: string;
  field_order: number;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'checkbox' | 'radio' | 'select' | 'section_header';
  field_label: string;
  field_name: string;
  field_placeholder?: string;
  field_options?: any[]; // Opsi untuk radio/select
  is_required: boolean;
  validation_rules?: any; // Aturan validasi dalam bentuk JSON
  created_at: string;
  updated_at: string;
}

export function useFormBuilderData() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all form templates
  const { data: formTemplates, isLoading: isLoadingFormTemplates } = useQuery<FormTemplate[]>({
    queryKey: ["form-templates"],
    queryFn: async () => {
      try {
        const result = await getApi<FormTemplate[]>`
          SELECT 
            id,
            name,
            description,
            category,
            fields,
            is_active,
            created_by,
            created_at,
            updated_at
          FROM form_templates
          ORDER BY name
        `;
        return result;
      } catch (error) {
        console.error("Error fetching form templates:", error);
        throw error;
      }
    },
  });

  // Fetch all form submissions
  const { data: formSubmissions, isLoading: isLoadingFormSubmissions } = useQuery<FormSubmission[]>({
    queryKey: ["form-submissions"],
    queryFn: async () => {
      try {
        const result = await getApi<FormSubmission[]>`
          SELECT 
            fs.id,
            fs.form_template_id,
            fs.patient_id,
            fs.submitted_data,
            fs.submitted_by,
            fs.submitted_at,
            fs.status,
            fs.created_at,
            fs.updated_at,
            ft.name as form_name,
            p.name as patient_name
          FROM form_submissions fs
          LEFT JOIN form_templates ft ON fs.form_template_id = ft.id
          LEFT JOIN patients p ON fs.patient_id = p.id
          ORDER BY fs.submitted_at DESC
        `;
        return result;
      } catch (error) {
        console.error("Error fetching form submissions:", error);
        throw error;
      }
    },
  });

  // Fetch fields for a specific form
  const getFormFields = async (formId: string) => {
    try {
      const result = await getApi<FormField[]>`
        SELECT 
          id,
          form_template_id,
          field_order,
          field_type,
          field_label,
          field_name,
          field_placeholder,
          field_options,
          is_required,
          validation_rules,
          created_at,
          updated_at
        FROM form_fields
        WHERE form_template_id = ${formId}
        ORDER BY field_order
      `;
      return result;
    } catch (error) {
      console.error("Error fetching form fields:", error);
      throw error;
    }
  };

  // Create new form template
  const createFormTemplate = useMutation({
    mutationFn: async (formData: Omit<FormTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      const result = await getApi<FormTemplate[]>`
        INSERT INTO form_templates (
          name,
          description,
          category,
          fields,
          is_active,
          created_by
        ) VALUES (
          ${formData.name},
          ${formData.description},
          ${formData.category},
          ${JSON.stringify(formData.fields)},
          ${formData.is_active},
          ${formData.created_by}
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: (data) => {
      // Simpan field-field untuk form ini
      if(data.fields && Array.isArray(data.fields)) {
        data.fields.forEach(async (field, index) => {
          await postApi("/generic-api", {});
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["form-templates"] });
      toast({
        title: "Form Berhasil Dibuat",
        description: "Template form baru telah ditambahkan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Membuat Form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update form template
  const updateFormTemplate = useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<FormTemplate> & { id: string }) => {
      const result = await getApi<FormTemplate[]>`
        UPDATE form_templates 
        SET 
          name = ${updateData.name},
          description = ${updateData.description},
          category = ${updateData.category},
          fields = ${updateData.fields ? JSON.stringify(updateData.fields) : undefined},
          is_active = ${updateData.is_active},
          updated_at = NOW()
        WHERE id = ${id} 
        RETURNING *
      `;
      return result[0];
    },
    onSuccess: (data) => {
      // Update fields jika diperlukan
      if(data.fields && Array.isArray(data.fields)) {
        // Hapus field-field lama
        deleteApi("/generic-api");
        
        // Masukkan field-field baru
        data.fields.forEach(async (field, index) => {
          await postApi("/generic-api", {});
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ["form-templates"] });
      queryClient.invalidateQueries({ queryKey: ["form-fields"] });
      toast({
        title: "Form Berhasil Diperbarui",
        description: "Template form telah diperbarui.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Memperbarui Form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete form template
  const deleteFormTemplate = useMutation({
    mutationFn: async (id: string) => {
      // Hapus field-field terlebih dahulu
      await deleteApi("/generic-api");
      // Baru hapus template form
      await deleteApi("/generic-api");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form-templates"] });
      queryClient.invalidateQueries({ queryKey: ["form-fields"] });
      toast({
        title: "Form Berhasil Dihapus",
        description: "Template form telah dihapus dari sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menghapus Form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Submit form
  const submitForm = useMutation({
    mutationFn: async (submissionData: Omit<FormSubmission, 'id' | 'created_at' | 'updated_at' | 'status'>) => {
      const result = await getApi<FormSubmission[]>`
        INSERT INTO form_submissions (
          form_template_id,
          patient_id,
          submitted_data,
          submitted_by,
          submitted_at,
          status
        ) VALUES (
          ${submissionData.form_template_id},
          ${submissionData.patient_id},
          ${JSON.stringify(submissionData.submitted_data)},
          ${submissionData.submitted_by},
          ${submissionData.submitted_at},
          'submitted'
        ) RETURNING *
      `;
      return result[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form-submissions"] });
      toast({
        title: "Form Berhasil Disubmit",
        description: "Data form telah disimpan ke sistem.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Gagal Menyubmit Form",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    formTemplates,
    formSubmissions,
    isLoadingFormTemplates,
    isLoadingFormSubmissions,
    getFormFields,
    createFormTemplate: createFormTemplate.mutate,
    updateFormTemplate: updateFormTemplate.mutate,
    deleteFormTemplate: deleteFormTemplate.mutate,
    submitForm: submitForm.mutate,
    isCreatingFormTemplate: createFormTemplate.isPending,
    isUpdatingFormTemplate: updateFormTemplate.isPending,
    isDeletingFormTemplate: deleteFormTemplate.isPending,
    isSubmittingForm: submitForm.isPending,
  };
}