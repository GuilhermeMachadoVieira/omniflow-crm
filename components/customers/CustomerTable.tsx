import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Phone, Mail, Building, Eye, ExternalLink, Users } from "lucide-react";
import { CustomerSafe } from "@/lib/frontend-types";
import { getInitials } from "@/lib/utils";
import Link from "next/link";

interface CustomerTableProps {
  customers: CustomerSafe[];
  onViewDetails?: (customer: CustomerSafe) => void;
}

export function CustomerTable({ customers, onViewDetails }: CustomerTableProps) {

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-sm">
          <div className="text-4xl mb-4 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum cliente encontrado</h3>
          <p className="text-muted-foreground">
            Comece adicionando seu primeiro cliente para gerenciar seu relacionamento com eles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Data de Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={customer.nome} />
                    <AvatarFallback className="text-xs">
                      {getInitials(customer.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <Link 
                    href={`/customers/${customer.id}`}
                    className="font-medium hover:text-primary hover:underline transition-colors"
                  >
                    {customer.nome}
                  </Link>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    {customer.email}
                  </div>
                  {customer.telefone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {customer.telefone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {customer.empresa ? (
                  <div className="flex items-center gap-2">
                    <Building className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm">{customer.empresa}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {customer.source ? (
                  <Badge variant="outline" className="text-xs">
                    {customer.source}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {customer.tags && customer.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{customer.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  aria-label="Ver detalhes do cliente"
                >
                  <Link href={`/customers/${customer.id}`}>
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
