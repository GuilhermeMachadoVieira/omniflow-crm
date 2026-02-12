"use client";

import { useState, useRef, startTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Upload, Trash2 } from "lucide-react";
import {
  uploadUserImage,
  deleteUserImage,
  uploadOrganizationLogo,
  deleteOrganizationLogo,
} from "@/app/actions/upload";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: (newUrl?: string) => void;
  type?: 'user' | 'organization';
}

export function ImageUpload({ currentImage, onImageChange, type = 'user' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('O arquivo deve ter no máximo 5MB');
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onloadend = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !preview) return;

    startTransition(async () => {
      setIsUploading(true);
      
      try {
        const result = type === "organization"
          ? await uploadOrganizationLogo(file)
          : await uploadUserImage(file);
        
        if (result.success) {
          toast.success('Imagem atualizada com sucesso!');
          setPreview(null);
          onImageChange(result.url);
          
          // Limpar input
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        } else {
          toast.error(result.error || 'Erro ao fazer upload');
        }
      } catch (error) {
        toast.error('Erro ao fazer upload da imagem');
      } finally {
        setIsUploading(false);
      }
    });
  };

  const handleDelete = () => {
    if (!currentImage) return;

    startTransition(async () => {
      setIsDeleting(true);
      
      try {
        const result = type === "organization"
          ? await deleteOrganizationLogo()
          : await deleteUserImage();
        
        if (result.success) {
          toast.success('Imagem removida com sucesso!');
          onImageChange(undefined);
        } else {
          toast.error(result.error || 'Erro ao remover imagem');
        }
      } catch (error) {
        toast.error('Erro ao remover imagem');
      } finally {
        setIsDeleting(false);
      }
    });
  };

  const displayImage = currentImage || preview;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          {displayImage ? (
            <AvatarImage 
              src={displayImage} 
              alt={type === 'user' ? "Avatar do usuário" : "Logo da organização"} 
            />
          ) : (
            <AvatarFallback className="text-2xl">
              {type === 'user' ? "U" : "O"}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading || isDeleting}
          />
          
          <div className="flex gap-2">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || isDeleting}
              variant="outline"
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processando...
                </>
              ) : (
                "Selecionar Imagem"
              )}
            </Button>
            
            {preview && (
              <Button
                onClick={handleUpload}
                disabled={isUploading || isDeleting}
                size="sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                {isUploading ? "Salvando..." : "Salvar"}
              </Button>
            )}
            
            {currentImage && !preview && (
              <Button
                onClick={handleDelete}
                disabled={isUploading || isDeleting}
                variant="destructive"
                size="sm"
              >
                {isDeleting ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Removendo...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {preview && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Preview:</p>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage 
                src={preview} 
                alt="Preview" 
              />
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Nova imagem selecionada. Clique em &quot;Salvar&quot; para atualizar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
