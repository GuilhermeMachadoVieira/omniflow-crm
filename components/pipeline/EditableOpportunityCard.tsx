"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit2, Save, X, Calendar, DollarSign } from "lucide-react";
import { OpportunitySafe } from "@/lib/frontend-types";
import { updateOpportunity } from "@/app/actions/pipeline";
import { toast } from "sonner";

interface EditableOpportunityCardProps {
  opportunity: OpportunitySafe;
  onUpdate: (updatedOpportunity: OpportunitySafe) => void;
}

const PRIORITY_OPTIONS = [
  { value: "HIGH", label: "Alta", color: "bg-red-100 text-red-800" },
  { value: "MEDIUM", label: "Média", color: "bg-yellow-100 text-yellow-800" },
  { value: "LOW", label: "Baixa", color: "bg-green-100 text-green-800" }
];

export function EditableOpportunityCard({ opportunity, onUpdate }: EditableOpportunityCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: opportunity.title,
    value: opportunity.value,
    priority: opportunity.priority,
    probability: opportunity.probability,
    expectedCloseDate: opportunity.expectedCloseDate
  });

  const handleSave = async () => {
    try {
      const result = await updateOpportunity(opportunity.id, editData);
      if (result.success) {
        onUpdate({
          ...opportunity,
          ...editData
        });
        setIsEditing(false);
        toast.success("Oportunidade atualizada com sucesso!");
      } else {
        toast.error(result.error || "Erro ao atualizar oportunidade");
      }
    } catch (error) {
      toast.error("Erro ao atualizar oportunidade");
    }
  };

  const handleCancel = () => {
    setEditData({
      title: opportunity.title,
      value: opportunity.value,
      priority: opportunity.priority,
      probability: opportunity.probability,
      expectedCloseDate: opportunity.expectedCloseDate
    });
    setIsEditing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getPriorityColor = (priority: string) => {
    return PRIORITY_OPTIONS.find(opt => opt.value === priority)?.color || "bg-gray-100 text-gray-800";
  };

  if (isEditing) {
    return (
      <Card className="w-72 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Input
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="text-sm font-medium"
              placeholder="Título da oportunidade"
            />
            <div className="flex gap-1">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-600">Valor</label>
            <Input
              type="number"
              value={editData.value}
              onChange={(e) => setEditData(prev => ({ ...prev, value: Number(e.target.value) }))}
              className="text-sm"
              placeholder="0,00"
            />
          </div>
          
          <div>
            <label className="text-xs font-medium text-gray-600">Prioridade</label>
            <Select value={editData.priority} onValueChange={(value) => setEditData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Probabilidade (%)</label>
            <Input
              type="number"
              min="0"
              max="100"
              value={editData.probability}
              onChange={(e) => setEditData(prev => ({ ...prev, probability: Number(e.target.value) }))}
              className="text-sm"
              placeholder="50"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-gray-600">Data Prevista</label>
            <Input
              type="date"
              value={editData.expectedCloseDate ? new Date(editData.expectedCloseDate).toISOString().split('T')[0] : ''}
              onChange={(e) => setEditData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-72 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
          <Button
            size="sm"
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            <Edit2 className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(opportunity.value)}
          </span>
          <Badge className={`text-xs ${getPriorityColor(opportunity.priority)}`}>
            {PRIORITY_OPTIONS.find(opt => opt.value === opportunity.priority)?.label}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Calendar className="h-3 w-3" />
            {opportunity.expectedCloseDate 
              ? new Date(opportunity.expectedCloseDate).toLocaleDateString('pt-BR')
              : 'Sem data prevista'
            }
          </div>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <DollarSign className="h-3 w-3" />
            {opportunity.probability}% de probabilidade
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
