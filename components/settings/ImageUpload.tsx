"use client";

import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageChange: () => void;
}

export function ImageUpload({ currentImage, onImageChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validação
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
      alert('O arquivo deve ter no máximo 2MB');
      return;
    }

    setIsUploading(true);

    try {
      // Converter para Base64
      const reader = new FileReader();
      reader.onloadend = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          setPreview(result);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!preview) return;

    setIsUploading(true);
    // TODO: Implementar upload action
    setTimeout(() => {
      setIsUploading(false);
      setPreview(null);
      onImageChange();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000);
  };

  const displayImage = currentImage || preview;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          {displayImage ? (
            <AvatarImage 
              src={displayImage} 
              alt="Avatar" 
            />
          ) : (
            <AvatarFallback className="text-2xl">
              {currentImage ? "U" : "?"}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="outline"
            size="sm"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Processando..." : "Selecionar Imagem"}
          </Button>
          
          {preview && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              size="sm"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? "Salvando..." : "Salvar"}
            </Button>
          )}
        </div>
      </div>

      {preview && (
        <div className="mt-4">
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
                Nova imagem selecionada. Clique em &quot;Salvar& quot; para atualizar.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
