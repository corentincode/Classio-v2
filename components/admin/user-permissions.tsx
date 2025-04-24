"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function UserPermissions() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Gestion des rôles et permissions</h3>
          <p className="text-sm text-muted-foreground">
            Configurez les droits d'accès pour chaque type d'utilisateur.
          </p>
        </div>
        <Select defaultValue="admin">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sélectionner un rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Administrateur</SelectItem>
            <SelectItem value="direction">Direction</SelectItem>
            <SelectItem value="cpe">CPE</SelectItem>
            <SelectItem value="teacher">Enseignant</SelectItem>
            <SelectItem value="secretary">Secrétariat</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Module</TableHead>
              <TableHead className="text-center">Lecture</TableHead>
              <TableHead className="text-center">Écriture</TableHead>
              <TableHead className="text-center">Modification</TableHead>
              <TableHead className="text-center">Suppression</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Élèves</TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Enseignants</TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Classes</TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Emplois du temps</TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Notes et bulletins</TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Absences et retards</TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Communication</TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="text-center"><Checkbox defaultChecked /></TableCell>
              <TableCell className="\
