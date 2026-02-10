"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Phone, Mail, MessageSquare, Calendar } from "lucide-react";

interface Activity {
  id: string;
  type: "NOTE" | "CALL" | "EMAIL" | "MEETING";
  content: string;
  createdAt: string;
  user: {
    nome: string;
  };
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ACTIVITY_CONFIG = {
  NOTE: {
    icon: MessageSquare,
    color: "text-blue-600",
    label: "Nota",
  },
  CALL: {
    icon: Phone,
    color: "text-green-600",
    label: "Telefone",
  },
  EMAIL: {
    icon: Mail,
    color: "text-purple-600",
    label: "E-mail",
  },
  MEETING: {
    icon: Calendar,
    color: "text-orange-600",
    label: "Reunião",
  },
};

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atividades</CardTitle>
          <CardDescription>Registro de interações com o cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">📋</div>
            <p className="text-sm">Nenhuma atividade registrada</p>
            <p className="text-xs mt-1">Adicione a primeira interação usando o formulário acima</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Atividades</CardTitle>
        <CardDescription>{activities.length} atividades registradas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = ACTIVITY_CONFIG[activity.type];
            const Icon = config.icon;
            
            return (
              <div key={activity.id} className="flex gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full bg-muted flex items-center justify-center ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(activity.createdAt)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {activity.content}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[10px]">
                        {getInitials(activity.user.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{activity.user.nome}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
