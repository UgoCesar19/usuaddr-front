import { Role } from "./role.model";

export interface Usuario {
  id: number;
  email: string;
  senha: string;
  nome: string;
  dataCriacao: string;
  perfis: Role[];
}
